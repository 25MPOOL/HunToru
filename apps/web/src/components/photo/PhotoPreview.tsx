import clsx from 'clsx';

import styles from './PhotoPreview.module.css';

type PhotoPreviewProps = {
  onConfirm: () => void;
  onRetake: () => void;
  timeLeft: number;
};

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  onConfirm,
  onRetake,
  timeLeft,
}) => {
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
              onClick={onConfirm}
            >
              この写真で決定！
            </button>
            <button
              className={clsx(styles['preview-button'], styles['btn-retake'])}
              onClick={onRetake}
            >
              撮り直す
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
