import type React from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import styles from './PhotoScreen.module.css';

/**
 * フォーカスリングの位置情報を表す型
 */
interface FocusRingPosition {
  x: number;
  y: number;
  id: number;
}

export const PhotoScreen = () => {
  const [focusRings, setFocusRings] = useState<FocusRingPosition[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const navigate = useNavigate();

  const handleNextPreview = useCallback(() => {
    navigate('/photo/preview');
  }, [navigate]);

  /**
   * カメラのフォーカス処理
   * タップした位置にフォーカスリングを表示する
   */
  const handleCameraFocus = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const cameraMain = event.currentTarget;
      const rect = cameraMain.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newFocusRing: FocusRingPosition = {
        x,
        y,
        id: Date.now(), // ユニークなIDとして現在時刻を使用
      };

      // 新しいフォーカスリングを追加（既存のものは自動的に消える）
      setFocusRings([newFocusRing]);

      // 1秒後にフォーカスリングを削除
      setTimeout(() => {
        setFocusRings((prev) =>
          prev.filter((ring) => ring.id !== newFocusRing.id),
        );
      }, 1000);
    },
    [],
  );

  /**
   * 写真撮影処理
   * フラッシュエフェクトとボタンエフェクトを含む
   */
  const handleCapturePhoto = useCallback(() => {
    // フラッシュエフェクトを開始
    setIsFlashing(true);
    setIsCapturing(true);

    // エフェクトをリセット
    setTimeout(() => {
      setIsFlashing(false);
      setIsCapturing(false);
    }, 300);

    // 実際の撮影処理（200ms後に実行）
    setTimeout(() => {
      // TODO: 実際のカメラ撮影機能を実装
      console.log('写真を撮影しました');
    }, 200);

    handleNextPreview();
  }, [handleNextPreview]);

  return (
    <div className={clsx(styles['screen'], styles['photo-screen'])}>
      <div className={styles.content}>
        {/* パターン2: コンパクトヘッダー表示 */}
        <div className={styles['photo-content']}>
          <div className={styles['compact-header']}>
            <div className={styles['compact-timer']}>
              <div className={styles['compact-timer-number']} id="timer">
                0:59
              </div>
              <div className={styles['compact-timer-label']}>残り</div>
            </div>
            <div className={styles['compact-challenge']}>
              <div className={styles['compact-challenge-text']}>
                「コップを撮ろう！」
              </div>
              <div className={styles['compact-challenge-hint']}>
                明るい場所で、大きく写そう
              </div>
            </div>
          </div>
          <div className={styles['camera-main']} onClick={handleCameraFocus}>
            {/* カメラのオーバーレイ */}
            <div className={styles['camera-overlay']}>
              <div className={styles['camera-grid']}></div>
              <div className={styles['camera-corners']}>
                <div
                  className={clsx(styles['corner'], styles['top-left'])}
                ></div>
                <div
                  className={clsx(styles['corner'], styles['top-right'])}
                ></div>
                <div
                  className={clsx(styles['corner'], styles['bottom-left'])}
                ></div>
                <div
                  className={clsx(styles['corner'], styles['bottom-right'])}
                ></div>
              </div>
            </div>

            {/* フォーカスリング */}
            {focusRings.map((ring) => (
              <div
                key={ring.id}
                className={styles['focus-ring']}
                style={{ left: ring.x, top: ring.y }}
              />
            ))}

            {/* Shooting Guide */}
            <div className={styles['shooting-guide']}>
              📸 画面をタップしてフォーカス
            </div>

            <div className={styles['camera-preview']}>
              📹 カメラプレビュー画面
              <br />
              (実装時にカメラ機能が表示されます)
            </div>
          </div>

          <div className={styles['camera-controls']}>
            <div
              className={clsx(
                styles['photo-button-large'],
                isCapturing && styles['photo-button-capturing'],
              )}
              onClick={handleCapturePhoto}
            >
              <div className={styles['camera-icon']}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Effect */}
      <div
        className={clsx(
          styles['flash-overlay'],
          isFlashing && styles['flash-active'],
        )}
      />
    </div>
  );
};
