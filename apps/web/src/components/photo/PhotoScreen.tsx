import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import styles from './PhotoScreen.module.css';

import components from '@/web/App.module.css';
import { Camera } from '@/web/components/camera/camera';
import type { CameraRef } from '@/web/types';
import type { Theme } from '@/web/types';

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
  const [themes, setThemes] = useState<Theme[]>([]);
  const [countDown, setCountDown] = useState(59);

  const cameraRef = useRef<CameraRef>(null);

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

  // カメラの撮影完了コールバック
  const handleCameraCapture = useCallback(
    (imageData: string) => {
      localStorage.setItem('photo', imageData);
      handleNextPreview();
    },
    [handleNextPreview],
  );

  /**
   * 写真撮影処理
   * フラッシュエフェクトとボタンエフェクトを含む
   */
  const handleCapturePhoto = useCallback(() => {
    if (isCapturing || !cameraRef.current) return;

    setIsFlashing(true);
    setIsCapturing(true);

    setTimeout(() => {
      setIsFlashing(false);
      setIsCapturing(false);
    }, 300);

    setTimeout(() => {
      cameraRef.current?.capture();
    }, 200);
  }, [isCapturing]);

  useEffect(() => {
    try {
      const rawData =
        localStorage.getItem('currentThemes') || '{ "themes": [] }';
      const parsedObject = JSON.parse(rawData);
      setThemes(parsedObject.themes || []);
    } catch (e) {
      console.error('Failed to load themes from localStorage', e);
      setThemes([]);
    }
  }, []);

  const currentTheme = useMemo(() => {
    if (themes.length > 0) {
      return themes[0].theme;
    }
    return 'お題がありません';
  }, [themes]);

  useEffect(() => {
    const storedCountDown = localStorage.getItem('countDown');
    if (storedCountDown) {
      setCountDown(parseInt(storedCountDown, 10));
    }

    const timer = setInterval(() => {
      setCountDown((prev) => {
        const currentCountDown = prev <= 0 ? 0 : prev - 1;
        localStorage.setItem('countDown', currentCountDown.toString());

        if (currentCountDown <= 0) {
          clearInterval(timer);

          // カメラの撮影をする
          handleCapturePhoto();
          return 0;
        }
        return currentCountDown;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleCapturePhoto]);

  return (
    <motion.div
      className={clsx(components.screen, styles['photo-screen'])}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.content}>
        {/* パターン2: コンパクトヘッダー表示 */}
        <div className={styles['photo-content']}>
          <div className={styles['compact-header']}>
            <div className={styles['compact-timer']}>
              <div className={styles['compact-timer-label']}>残り</div>
              <div className={styles['compact-timer-number']} id="timer">
                0:{countDown.toString().padStart(2, '0')}
              </div>
            </div>
            <div className={styles['compact-challenge']}>
              <div className={styles['compact-challenge-text']}>
                「{currentTheme}」
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
              <div className={styles['camera-preview']}>
                <Camera ref={cameraRef} onCapture={handleCameraCapture} />
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
    </motion.div>
  );
};
