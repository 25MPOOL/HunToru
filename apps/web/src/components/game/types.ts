/**
 * ゲーム画面関連の型定義
 */

/**
 * お題の型定義
 */
export interface Theme {
  /** お題ID */
  id: string;
  /** 難易度レベル */
  difficulty_level: 'EASY' | 'NORMAL' | 'HARD';
  /** ユーザーに表示するお題テキスト */
  display_text: string;
  /** AI判定のための条件 */
  ai_conditions: unknown; // 詳細は後で定義
}

/**
 * ゲーム状態の型定義
 */
export interface GameState {
  /** 現在のゲーム段階 */
  phase: 'THEME_DISPLAY' | 'SHOOTING' | 'JUDGING' | 'RESULT';
  /** ランダムに選ばれたお題 */
  selectedTheme: Theme | null;
  /** 残り時間（秒） */
  remainingTime: number;
  /** 撮影された画像 */
  capturedImage: string | null;
  /** AI判定結果 */
  judgeResult: JudgeResult | null;
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
 * ゲーム画面のProps
 */
export interface GameScreenProps {
  /** ゲーム終了時のコールバック */
  onGameEnd: (result: JudgeResult) => void;
}

/**
 * お題表示コンポーネントのProps（1個ランダム表示用）
 */
export interface ThemeDisplayProps {
  /** 表示するお題（1個） */
  theme: Theme | null;
  /** お題確認後の開始コールバック */
  onStartShooting: () => void;
  /** ローディング状態 */
  isLoading?: boolean;
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
