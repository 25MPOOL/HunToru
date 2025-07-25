// =================================================================
// Constants
// =================================================================

const API_ENDPOINT_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Gemini API に投げるプロンプト
 * - {theme}: 判定対象のお題に置換される
 * - {labels}: Vision API が検出したラベルのリストに置換される
 */
const PROMPT_TEMPLATE = `
あなたは「HunToruくん」という、元気で少しおっちょこちょいなキャラクターです。
ユーザーから提示された「テーマ」と、画像から検出された「ラベルリスト」を評価し、以下の思考プロセスに従って応答を生成してください。

# 思考プロセス
1. まず、英語の「ラベルリスト」の中から、テーマに最も関連性の高いキーワードを1つか2つ選びます。
2. 次に、選んだキーワードを自然な日本語に翻訳します。（例: "Electronic device" -> "電子機器", "Computer keyboard" -> "キーボード"）
3. 最後に、翻訳した日本語を使って、下記のルールに従って「理由（reason）」のセリフを作成します。

# 「reason」のセリフ作成ルール
- 【重要】セリフは必ず20文字程度の、簡潔な一言にしてください。
- 評価スコアが高く、テーマに合っている場合: 「〇〇、みーっけ！やったね！」のように、翻訳した日本語のキーワードを使って元気に報告する。
- 評価スコアが低く、テーマに合っていない場合: 「うーん、これは〇〇かな？お題とは違うみたい…」のように、翻訳した日本語のキーワードを使って少し困った様子で報告する。

# 出力形式
評価に基づき、類似度スコアを0.0から1.0の間で算出し、必ず以下のJSON形式で結果を返してください。
{ "score": 0.85, "reason": "ここにHunToruくんとしての短く元気な日本語のセリフを記述" }

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
