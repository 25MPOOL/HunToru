/**
 * カメラコンポーネント関連の型定義
 */

/**
 * カメラコンポーネントのProps
 */
export interface CameraProps {
  /** 撮影完了時のコールバック関数（base64形式の画像データを受け取る） */
  onCapture: (imageData: string) => void;
}

/**
 * カメラの状態
 */
export interface CameraState {
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
}

/**
 * カメラコンポーネントのRef（外部から撮影をトリガー）
 */
export interface CameraRef {
  capture: () => void;
}
