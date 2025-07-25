/**
 * 3枚目撮影画面用の型定義
 */

/**
 * お題の型定義（データベースと同じ構造）
 */
export interface Theme {
  /** お題ID */
  id: number;
  /** 難易度レベル */
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  /** お題テキスト */
  theme: string;
  /** AI判定条件 */
  aiCondition: unknown;
}

/**
 * AI判定結果の型定義
 */
export interface JudgeResult {
  success: boolean;
  theme: string;
  label_score: number;
  detected_labels: Array<{
    description: string;
    score: number;
  }>;
  image_properties?: unknown;
  message: string;
  error?: string;
}

/**
 * タイマーコンポーネントのProps
 */
export interface TimerProps {
  /** 初期時間（秒） */
  initialTime: number;
  /** タイマー終了時のコールバック */
  onTimeUp: () => void;
  /** タイマー開始フラグ */
  isActive: boolean;
  /** タイマーリセット用のキー */
  resetKey?: number;
}
