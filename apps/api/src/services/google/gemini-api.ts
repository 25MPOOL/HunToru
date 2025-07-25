// =================================================================
// Constants
// =================================================================

const API_ENDPOINT_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_NAME = 'gemini-2.0-flash';

/**
 * Gemini API に投げるプロンプト
 * - {theme}: 判定対象のお題に置換される
 * - {labels}: Vision API が検出したラベルのリストに置換される
 */
const PROMPT_TEMPLATE = `
あなたは画像のテーマ判定AIです。
ユーザーから提示された「テーマ」と、画像から検出された「ラベルリスト」を受け取ります。
ラベルリストがテーマにどれだけ合っているかを評価し、類似度スコアを0.0から1.0の間で算出してください。
結果は必ず以下のJSON形式で返してください。
{ "score": 0.85, "reason": "理由をここに記述" }

---
テーマ: "{theme}"
ラベルリスト: [{labels}]
`;

// =================================================================
// Type Definitions
// =================================================================

interface CallGeminiAPIParams {
  theme: string;
  labels: string[];
  apiKey: string;
}

interface GeminiResponse {
  score: number;
  reason: string;
}

// =================================================================
// Functions
// =================================================================

/**
 * Gemini API を呼び出して、テーマとラベルの類似度を判定させる関数
 * @param payload - 判定に必要な情報（テーマ、ラベル、APIキー）を含むオブジェクト
 * @returns 判定結果 GeminiResponse
 */
export async function callGeminiAPI(
  params: CallGeminiAPIParams,
): Promise<GeminiResponse> {
  const { theme, labels, apiKey } = params;

  const endpoint = `${API_ENDPOINT_BASE}/${MODEL_NAME}:generateContent?key=${apiKey}`;
  const labelString = labels.map((label) => `"${label}"`).join(', ');
  const prompt = PROMPT_TEMPLATE.replace('{theme}', theme).replace(
    '{labels}',
    labelString,
  );

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: 'application/json',
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Gemini API の呼び出しに失敗しました: ${response.status}`);
  }

  const data = await response.json();
  const responseText = data.candidates[0].content.parts[0].text;

  return JSON.parse(responseText) as GeminiResponse;
}
