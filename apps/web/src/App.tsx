import { useState } from "react";

import { Camera } from "./components";

import "./App.css";

/**
 * Vision API レスポンスの型定義
 */
interface ApiResponse {
  success: boolean;
  theme: string;
  label_score: number;
  detected_labels: Array<{
    description: string;
    score: number;
  }>;
  image_properties?: unknown; // 詳細な型定義は後で追加
  message: string;
  error?: string;
}

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL_PROD // 本番環境の場合
    : import.meta.env.VITE_API_URL_DEV; // 開発環境の場合

function App() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const sendImageToAPI = async (imageData: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/judge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: imageData,
          theme: "テストお題",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      console.log("API レスポンス:", result);
      setApiResponse(result);
    } catch (error) {
      console.error("API送信エラー:", error);
      setApiResponse({
        success: false,
        theme: "テストお題",
        label_score: 0,
        detected_labels: [],
        message: "",
        error: "画像の送信に失敗しました。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    console.log("画像が撮影されました:", imageData.substring(0, 50) + "...");

    sendImageToAPI(imageData);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setApiResponse(null);
  };

  return (
    <div className="app">
      <h1>HunToru カメラテスト</h1>

      {!capturedImage ? (
        <div style={{ position: "relative", width: "100%", height: "70vh" }}>
          <Camera onCapture={handleImageCapture} />
        </div>
      ) : (
        <div className="capture-result">
          <h2>撮影完了！</h2>
          <img
            src={capturedImage}
            alt="撮影された画像"
            style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
          />

          {isLoading && (
            <div style={{ margin: "20px 0" }}>
              <p>🤖 AI が画像を評価中...</p>
            </div>
          )}

          {apiResponse && !isLoading && (
            <div
              style={{
                margin: "20px 0",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: apiResponse.success ? "#f0f8f0" : "#f8f0f0",
              }}
            >
              <h3>🎯 AI判定結果</h3>
              {apiResponse.success ? (
                <>
                  <p>
                    <strong>スコア:</strong>{" "}
                    {(apiResponse.label_score * 100).toFixed(1)}%
                  </p>
                  <p>
                    <strong>お題:</strong> {apiResponse.theme}
                  </p>
                  <p>
                    <strong>メッセージ:</strong> {apiResponse.message}
                  </p>
                  <details style={{ marginTop: "10px" }}>
                    <summary>検出されたラベル</summary>
                    <ul>
                      {apiResponse.detected_labels?.map(
                        (label, index: number) => (
                          <li key={index}>
                            {label.description}:{" "}
                            {(label.score * 100).toFixed(1)}%
                          </li>
                        ),
                      )}
                    </ul>
                  </details>
                </>
              ) : (
                <p style={{ color: "red" }}>❌ {apiResponse.error}</p>
              )}
            </div>
          )}

          <button
            onClick={handleRetake}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            もう一度撮影
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
