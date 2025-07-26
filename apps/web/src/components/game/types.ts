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
 * AI判定結果の型定義（API仕様に合わせて更新）
 */
export interface JudgeResult {
  success: boolean;
  theme: string;
  score: number; // label_score → score に変更
  reason: string; // message → reason に変更
  isMatch: boolean; // 新規追加
  scoreEffect: number; // 新規追加
  detectedLabels: string[]; // 配列の型を簡素化
  dominantColors?: Array<{
    red: number;
    green: number;
    blue: number;
  }>; // 新規追加
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
