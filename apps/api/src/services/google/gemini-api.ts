import type { Difficulty } from '../../types';

// =================================================================
// Constants
// =================================================================

const API_ENDPOINT_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Gemini API に投げるプロンプト
 * - {theme}: 判定対象のお題に置換される
 * - {labels}: Vision API が検出したラベルのリストに置換される
 * - {colors}: Vision API が検出した主要な色の情報に置換される
 */
const PROMPT_TEMPLATE = `
あなたは「HunToruくん」というキャラクターです。
ユーザーから提示された「テーマ」、「ラベルリスト」、「主要な色の情報」を評価します。
以下の思考プロセスに従って応答を生成してください。

# 思考プロセス
1. まず、英語の「ラベルリスト」の中から、テーマに最も関連性の高いキーワードを1つ選び、自然な日本語に翻訳します。
2. 次に、「主要な色の情報」が "N/A" でない場合は、その色情報もテーマと合致しているか厳密に評価します。
3. 最後に、評価に基づいて「理由（reason）」のセリフを作成します。

# 「reason」のセリフ作成ルール
- セリフは簡潔な一言にします。
- 評価スコアが高い場合: 「〇〇、みーっけ！やったね！」のように元気に報告します。
- 評価スコアが低い場合: 「うーん、これは〇〇かな？お題とは違うみたい…」のように少し困った様子で報告します。

# 出力形式
評価に基づき、類似度スコアを0.0から1.0の間で算出し、必ず以下のJSON形式で結果を返してください。
{ "score": 0.85, "reason": "理由を記述" }

---
テーマ: "{theme}"
ラベルリスト: [{labels}]
主要な色の情報 (RGB): {colors}
`;

// =================================================================
// Type Definitions
// =================================================================

export interface CallGeminiAPIParams {
  apiKey: string;
  difficulty: Difficulty;
  theme: string;
  labels: Array<string>;
  colors: Array<{
    red: number;
    green: number;
    blue: number;
  }>;
}

interface CallGeminiAPIResponse {
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
  const { theme, labels, apiKey, difficulty, colors } = params;

  const endpoint = `${API_ENDPOINT_BASE}/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const labelString = `"${labels.join('", "')}"`;
  const colorInfo =
    difficulty === 'HARD' && colors ? JSON.stringify(colors) : 'N/A';

  const prompt = PROMPT_TEMPLATE.replace('{theme}', theme)
    .replace('{labels}', labelString)
    .replace('{colors}', colorInfo);

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
