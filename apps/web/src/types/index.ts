export interface Theme {
  id: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  theme: string;
}

/**
 * カメラコンポーネントのRef（外部から撮影をトリガー）
 */
export interface CameraRef {
  capture: () => void;
}
