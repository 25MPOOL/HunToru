import React, { useRef, useEffect, useState } from 'react';
import type { CameraProps } from './types';

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
export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // カメラの初期化
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment' // 背面カメラを優先
          }
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setIsLoading(false);
      } catch (err) {
        console.error('カメラアクセスエラー:', err);
        setError('カメラにアクセスできませんでした。カメラの使用を許可してください。');
        setIsLoading(false);
      }
    };

    initCamera();

    // クリーンアップ
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  /**
   * 撮影処理
   * ビデオフレームをキャンバスに描画し、base64形式で画像データを取得
   */
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    // キャンバスサイズをビデオサイズに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // ビデオフレームをキャンバスに描画
    context.drawImage(video, 0, 0);

    // base64形式で画像データを取得
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
  };

  if (error) {
    return (
      <div className="camera-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="camera-container">
      {isLoading && <div className="camera-loading">カメラを起動中...</div>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-preview"
        style={{
          width: '100%',
          maxWidth: '100vw',
          height: 'auto',
          display: isLoading ? 'none' : 'block'
        }}
      />

      {/* 撮影用の隠しキャンバス */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {!isLoading && (
        <button
          onClick={handleCapture}
          className="capture-button"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer'
          }}
        >
          📷 撮影
        </button>
      )}
    </div>
  );
}; 