import React, { useRef, useState } from 'react';

import { Camera } from '../camera';
import type { CameraRef } from '../camera/types';
import styles from './shooting-screen.module.css';
import { Timer } from './timer';
import type { JudgeResult, Theme } from './types';

/**
 * 3枚目：撮影画面専用コンポーネント
 *
 * @description
 * - お題を受け取って撮影画面を表示
 * - 1分間のタイマー付き撮影
 * - AI判定後に結果を返す
 */

interface ShootingScreenProps {
  /** 撮影するお題（1・2枚目から受け取る） */
  theme: Theme;
  /** 撮影・判定完了時のコールバック */
  onComplete: (result: JudgeResult) => void;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
}

export const ShootingScreen: React.FC<ShootingScreenProps> = ({
  theme,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'SHOOTING' | 'JUDGING'>('SHOOTING');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraRef>(null);

  // 撮影完了時の処理
  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setPhase('JUDGING');

    // AI判定の実行
    await sendImageToAPI(imageData);
  };

  // 時間切れ時の処理
  const handleTimeUp = () => {
    console.log('⏰ 時間切れ！');
    // 時間切れ時は自動で撮影を実行
    handleManualCapture();
  };

  // API送信処理
  const sendImageToAPI = async (imageData: string) => {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL_DEV || 'http://localhost:8787';

      const response = await fetch(`${apiUrl}/judge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData,
          theme: theme.theme,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // 結果を親コンポーネントに返す
      onComplete(result);
    } catch (error) {
      console.error('API送信エラー:', error);
      const errorResult: JudgeResult = {
        success: false,
        theme: theme.theme,
        label_score: 0,
        detected_labels: [],
        message: '',
        error: '画像の送信に失敗しました。',
      };

      onComplete(errorResult);
    }
  };

  // 手動撮影処理
  const handleManualCapture = () => {
    if (cameraRef.current?.capture) {
      cameraRef.current.capture();
    }
  };

  return (
    <div className={styles.shootingScreen}>
      <div className={styles.mainContent}>
        {phase === 'SHOOTING' && (
          <div className={styles.shootingArea}>
            {/* お題を撮影しよう - 吹き出し */}
            <div className={styles.themeDisplay}>お題を撮影しよう</div>

            {/* お題内容 - 分離された表示 */}
            <div className={styles.themeContent}>お題：{theme.theme}</div>

            {/* キャラクター */}
            <div className={styles.characterArea}>
              <div className={styles.character}></div>
            </div>

            {/* タイマー */}
            <div className={styles.timerArea}>
              <Timer initialTime={60} onTimeUp={handleTimeUp} isActive={true} />
            </div>

            {/* カメラプレビュー */}
            <div className={styles.cameraPreviewArea}>
              <Camera ref={cameraRef} onCapture={handleImageCapture} />
            </div>

            {/* 撮影ボタン */}
            <div className={styles.captureButtonArea}>
              <button
                onClick={handleManualCapture}
                className={styles.captureButton}
              >
                📷 撮影
              </button>
            </div>
          </div>
        )}

        {phase === 'JUDGING' && (
          <div className={styles.judgingArea}>
            {capturedImage && (
              <div className={styles.capturedImageFrame}>
                <img
                  src={capturedImage}
                  alt="撮影された画像"
                  className={styles.capturedImage}
                />
              </div>
            )}

            <div className={styles.judgingTitle}>🤖 AI が評価中...</div>

            <div className={styles.judgingDescription}>
              お題「{theme.theme}」を判定しています
              <br />
              しばらくお待ちください
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
