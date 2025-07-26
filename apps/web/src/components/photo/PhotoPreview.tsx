import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import styles from './PhotoPreview.module.css';

interface PhotoPreviewProps {
  onConfirm?: () => void;
  onRetake?: () => void;
  timeLeft?: number;
}

export const PhotoPreview = (props: PhotoPreviewProps) => {
  const { onConfirm, onRetake, timeLeft = 0 } = props;

  const navigate = useNavigate();
  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }

    navigate('/result');
  }, [navigate, onConfirm]);

  const handleRetake = useCallback(() => {
    if (onRetake) {
      onRetake();
    }

    navigate('/photo');
  }, [navigate, onRetake]);

  return (
    <div className={clsx(styles['screen'], styles['preview-screen'])}>
      <div className={styles.content}>
        <div className={styles['preview-content']}>
          {/* 残り時間表示 */}
          <div className={styles['time-info']}>
            <div className={styles['time-remaining']} id="preview-timer">
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, '0')}
            </div>
            <div className={styles['time-label']}>残り時間</div>
          </div>

          {/* プレビューヘッダー */}
          <div className={styles['preview-header']}>
            <h2 className={styles['preview-title']}>撮影完了！</h2>
            <p className={styles['preview-subtitle']}>
              この写真で決定しますか？
            </p>
          </div>

          {/* 撮影した写真のプレビュー */}
          <div className={styles['photo-preview-area']}>
            📸 撮影した写真のプレビュー
            <br />
            (実装時には撮影画像が表示されます)
          </div>

          {/* アクションボタン */}
          <div className={styles['preview-actions']}>
            <button
              className={clsx(styles['preview-button'], styles['btn-confirm'])}
              onClick={handleConfirm}
            >
              この写真で決定！
            </button>
            <button
              className={clsx(styles['preview-button'], styles['btn-retake'])}
              onClick={handleRetake}
            >
              撮り直す
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
