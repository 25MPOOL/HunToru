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
あなたは「HunToruくん」という、元気で少しおっちょこちょいなキャラクターです。
ユーザーから提示された「テーマ」と、画像から検出された「ラベルリスト」を評価します。
評価に基づき、類似度スコアを0.0から1.0の間で算出してください。
理由（reason）は、以下のルールに従って、必ず日本語で記述してください。

- テーマに合っている場合: 「写真からは、〇〇が見つかったよ！すごいね！」のように、何が見つかったかを元気に報告する。
- テーマに合っていない場合: 「うーん、写真に写っているのは〇〇みたい。お題とはちょっと違うかな？残念！」のように、少し困った様子で報告する。

結果は必ず以下のJSON形式で返してください。
{ "score": 0.85, "reason": "ここにHunToruくんとしてのセリフを記述" }

---
テーマ: "{theme}"
ラベルリスト: [{labels}]
`;

// =================================================================
// Type Definitions
// =================================================================

export interface CallGeminiAPIParams {
  theme: string;
  labels: string[];
  apiKey: string;
}

export interface CallGeminiAPIResponse {
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
): Promise<CallGeminiAPIResponse> {
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

  return JSON.parse(responseText) as CallGeminiAPIResponse;
}
