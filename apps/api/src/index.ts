import { error } from "console";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://*.pages.dev",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// 画像判定エンドポイント（モック）
app.post("/judge", async (c) => {
  try {
    const body = await c.req.json();
    const { imageData, theme } = body;

    if (!imageData || !imageData.startsWith("data:image/")) {
      return c.json({ error: "Invalid image data" }, 400);
    }

    console.log("画像を受信しました:", imageData.substring(0, 50) + "...");
    console.log("お題:", theme || "未指定");

    const mockResponse = {
      success: true,
      theme: theme || "テストお題",
      label_score: Math.random() * 0.8 + 0.2,
      detected_labels: [
        { description: "Object", score: 0.85 },
        { description: "Item", score: 0.72 },
        { description: "Thing", score: 0.61 },
      ],
      message: "画像を正常に受信し、モック判定を実行しました。",
    };

    return c.json(mockResponse);
  } catch (error) {
    console.error("Judge API Error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
