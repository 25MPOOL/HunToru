// =================================================================
// Constants
// =================================================================

const OAUTH2_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const VISION_API_SCOPE = 'https://www.googleapis.com/auth/cloud-vision';

// =================================================================
// Type Definitions
// =================================================================

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// =================================================================
// Google Cloud Authentication Client
// =================================================================

/**
 * Google Cloud 認証クライアント
 * サービスアカウントキーを使って、アクセストークンを取得する責務を持つ
 */
export class GoogleAuthClient {
  private credentials: ServiceAccountCredentials;
  private privateKey: CryptoKey | null = null;

  constructor(serviceAccountKey: string) {
    this.credentials = JSON.parse(serviceAccountKey);
  }

  /**
   * OAuth2 アクセストークンを取得する
   */
  public async getAccessToken(): Promise<string> {
    const jwt = await this.createJWT();
    const tokenResponse = await fetch(OAUTH2_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(
        `トークン取得に失敗しました: ${tokenResponse.statusText}`,
      );
    }

    const tokenData: AccessTokenResponse = await tokenResponse.json();
    return tokenData.access_token;
  }

  /**
   * JWT を作成する (RS256署名)
   */
  private async createJWT(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: this.credentials.private_key_id,
    };
    const payload = {
      iss: this.credentials.client_email,
      scope: VISION_API_SCOPE,
      aud: OAUTH2_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const signature = await this.signRS256(signingInput);

    return `${signingInput}.${signature}`;
  }

  /**
   * RS256 署名を作成する
   */
  private async signRS256(data: string): Promise<string> {
    if (!this.privateKey) {
      this.privateKey = await this.importPrivateKey();
    }

    const signatureBuffer = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      this.privateKey,
      new TextEncoder().encode(data),
    );

    return this.base64UrlEncodeBuffer(signatureBuffer);
  }

  /**
   * PEM形式の秘密鍵を WebCrypto 用にインポート
   */
  private async importPrivateKey(): Promise<CryptoKey> {
    const pemContents = this.credentials.private_key.replace(
      /-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,
      '',
    );
    const keyBuffer = this.base64Decode(pemContents);

    return crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign'],
    );
  }

  // === Base64 Helper Methods ===
  private base64UrlEncode = (data: string): string =>
    btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  private base64UrlEncodeBuffer = (buffer: ArrayBuffer): string =>
    this.base64UrlEncode(String.fromCharCode(...new Uint8Array(buffer)));

  private base64Decode = (base64: string): ArrayBuffer =>
    Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
}
