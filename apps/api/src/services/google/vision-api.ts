import { GoogleAuthClient } from './auth';

// =================================================================
// Constants
// =================================================================

const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// =================================================================
// Type Definitions
// =================================================================

export interface VisionApiParams {
  image: string;
  serviceAccountKey: string;
}

interface LabelAnnotation {
  mid: string;
  description: string;
  score: number;
  topicality: number;
}

interface ImagePropertiesAnnotation {
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
}

interface ApiError {
  code: number;
  message: string;
  status: string;
}

interface VisionApiResponseItem {
  labelAnnotations?: Array<LabelAnnotation>;
  imagePropertiesAnnotation?: ImagePropertiesAnnotation;
  error?: ApiError;
}

export interface VisionApiResponse {
  responses: Array<VisionApiResponseItem>;
}

// =================================================================
// Functions
// =================================================================

/**
 * Google Cloud Vision APIを呼び出す
 * @param params API呼び出しに必要な情報
 * @returns Vision APIのレスポンス
 */
export async function callVisionAPI(
  params: VisionApiParams,
): Promise<VisionApiResponse> {
  const authClient = new GoogleAuthClient(params.serviceAccountKey);
  const accessToken = await authClient.getAccessToken();

  const requestBody = {
    requests: [
      {
        image: { content: params.image },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'IMAGE_PROPERTIES' },
        ],
      },
    ],
  };

  const response = await fetch(VISION_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Vision API エラー: ${response.statusText}`);
  }

  return await response.json();
}
