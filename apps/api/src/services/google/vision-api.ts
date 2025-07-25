/**
 * Google Cloud Vision API REST クライアント実装
 * Cloudflare Workers 環境用
 */

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

interface VisionApiRequest {
  requests: Array<{
    image: {
      content: string; // base64
    };
    features: Array<{
      type: string;
      maxResults?: number;
    }>;
  }>;
}

export interface VisionApiResponse {
  responses: Array<{
    labelAnnotations?: Array<{
      mid: string;
      description: string;
      score: number;
      topicality: number;
    }>;
    imagePropertiesAnnotation?: {
      dominantColors: {
        colors: Array<{
          color: {
            red: number;
            green: number;
            blue: number;
          };
          score: number;
          pixelFraction: number;
        }>;
      };
    };
    error?: {
      code: number;
      message: string;
      status: string;
    };
  }>;
}

/**
 * Google Cloud Vision API呼び出しメイン関数
 */
export async function callVisionAPI({
  image,
  serviceAccountKey,
}: {
  image: string;
  projectId: string;
  serviceAccountKey: string;
}): Promise<VisionApiResponse> {
  // サービスアカウントキーをパース
  const credentials: ServiceAccountCredentials = JSON.parse(serviceAccountKey);

  // アクセストークン取得
  const accessToken = await getAccessToken(credentials);

  // Vision APIリクエスト構築
  const requestBody: VisionApiRequest = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 10,
          },
          // ハードモード用に色情報も取得
          {
            type: 'IMAGE_PROPERTIES',
          },
        ],
      },
    ],
  };

  // Vision API呼び出し
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Vision API error: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return await response.json();
}

/**
 * Google Cloud OAuth2 アクセストークン取得
 * JWT → OAuth2 Token Exchange フロー
 */
async function getAccessToken(
  credentials: ServiceAccountCredentials,
): Promise<string> {
  // 1. JWT作成
  const jwt = await createJWT(credentials);

  // 2. OAuth2 token endpoint でアクセストークン取得
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
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
    const errorText = await tokenResponse.text();
    throw new Error(
      `Token exchange failed: ${tokenResponse.status} - ${errorText}`,
    );
  }

  const tokenData: AccessTokenResponse = await tokenResponse.json();
  return tokenData.access_token;
}

/**
 * JWT作成（RS256署名）
 */
async function createJWT(
  credentials: ServiceAccountCredentials,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // JWT Header
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: credentials.private_key_id,
  };

  // JWT Payload
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-vision',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600, // 1時間後に期限切れ
    iat: now,
  };

  // Base64URL エンコード
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // 署名対象文字列
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // RS256 署名作成
  const signature = await signRS256(signingInput, credentials.private_key);

  return `${signingInput}.${signature}`;
}

/**
 * RS256署名作成（Web Crypto API使用）
 */
async function signRS256(data: string, privateKeyPem: string): Promise<string> {
  // PEM形式の秘密鍵をWebCrypto用に変換
  const privateKey = await importPrivateKey(privateKeyPem);

  // 署名作成
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    dataBuffer,
  );

  // Base64URL エンコード
  return base64UrlEncodeBuffer(signatureBuffer);
}

/**
 * PEM形式の秘密鍵をWebCrypto用にインポート
 */
async function importPrivateKey(pemKey: string): Promise<CryptoKey> {
  // PEMヘッダー・フッター除去とbase64デコード
  const pemContents = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  const keyBuffer = base64Decode(pemContents);

  return await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );
}

/**
 * Base64URL エンコード（文字列）
 */
function base64UrlEncode(data: string): string {
  const base64 = btoa(data);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64URL エンコード（ArrayBuffer）
 */
function base64UrlEncodeBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64デコード
 */
function base64Decode(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
