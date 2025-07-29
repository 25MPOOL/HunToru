import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import styles from './camera.module.css';

import type { CameraRef } from '@/web/types';

interface CameraProps {
  /** 撮影完了時のコールバック関数（base64形式の画像データを受け取る） */
  onCapture: (imageData: string) => void;
}

/**
 * カメラプレビューと撮影機能を提供するコンポーネント
 *
 * @description
 * - スマートフォンの背面カメラを優先して使用
 * - 撮影した画像をbase64形式で返却
 * - カメラアクセス権限の管理
 *
 * @example
 * ```tsx
 * <Camera onCapture={(imageData) => console.log('撮影完了:', imageData)} />
 * ```
 */
export const Camera = forwardRef<CameraRef, CameraProps>(
  ({ onCapture }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // カメラの初期化
    useEffect(() => {
      let currentStream: MediaStream | null = null;

      const initCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 }, // 少し小さめに調整
              height: { ideal: 480 },
              facingMode: 'environment', // 背面カメラを優先
            },
          });

          currentStream = mediaStream;

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          setIsLoading(false);
        } catch (err) {
          console.error('カメラアクセスエラー:', err);
          setError('カメラにアクセスできませんでした');
          setIsLoading(false);
        }
      };

      initCamera();

      return () => {
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
        }
      };
    }, []);

    /**
     * 撮影処理（外部から呼び出し可能）
     */
    const handleCapture = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(imageData);
    };

    // 外部から撮影をトリガーできるように、refを公開
    useImperativeHandle(ref, () => ({
      capture: handleCapture,
    }));

    if (error) {
      return (
        <div className={styles.cameraContainer}>
          <div className={styles.cameraError}>
            <p>{error}</p>
            <p>カメラの使用を許可してください</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.cameraContainer}>
        {isLoading && (
          <div className={styles.cameraLoading}>カメラを起動中...</div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={styles.cameraPreview}
          style={{
            display: isLoading ? 'none' : 'block',
          }}
        />

        {/* 撮影用の隠しキャンバス */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  },
);

Camera.displayName = 'Camera';
