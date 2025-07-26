import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import huntoru from '../../assets/huntoru.png';
import { PixelBubble } from '../ui/PixelBubble';
import styles from './ModeScreen.module.css';

export const ModeScreen = () => {
  const navigate = useNavigate();

  const handleModeSelect = useCallback(
    (mode: string) => {
      navigate('/photo', { state: { mode } });
    },
    [navigate],
  );

  return (
    <div className={clsx(styles.screen, styles['difficulty-screen'])}>
      <div className={styles.content}>
        <div className={styles['difficulty-header']}>
          <PixelBubble className={styles['pixel-bubble']} />
          <p className={styles['pixel-bubble-text']}>モードを選んでね！</p>
          <img src={huntoru} alt="huntoru" className={styles['huntoru-icon']} />
        </div>

        <div className={styles['difficulty-list']}>
          {/* かんたん */}
          <div
            className={clsx(styles['difficulty-card'], styles.easy)}
            onClick={() => handleModeSelect('easy')}
          >
            <div className={styles['difficulty-icon']}>
              <div className={styles['pixel-icon']} />
            </div>
            <div className={styles['difficulty-content']}>
              <h3
                className={clsx(styles['difficulty-name'], 'dotgothic16-bold')}
              >
                イージー
              </h3>
              <p className={styles['difficulty-desc']}>概念や抽象的なモノ</p>
              <div className={styles['difficulty-example']}>
                例：何か丸いもの
              </div>
            </div>
          </div>

          {/* ふつう */}
          <div
            className={clsx(styles['difficulty-card'], styles.normal)}
            onClick={() => handleModeSelect('normal')}
          >
            {/* おすすめバッジ */}
            <div className={styles['recommended-badge']}>おすすめ</div>
            <div className={styles['difficulty-icon']}>
              <div className={styles['pixel-icon']} />
            </div>
            <div className={styles['difficulty-content']}>
              <h3
                className={clsx(styles['difficulty-name'], 'dotgothic16-bold')}
              >
                ノーマル
              </h3>
              <p className={styles['difficulty-desc']}>具体的なモノ</p>
              <div className={styles['difficulty-example']}>例：キーボード</div>
            </div>
          </div>

          {/* むずかしい */}
          <div
            className={clsx(styles['difficulty-card'], styles.hard)}
            onClick={() => handleModeSelect('hard')}
          >
            <div className={styles['difficulty-icon']}>
              <div className={styles['pixel-icon']} />
            </div>
            <div className={styles['difficulty-content']}>
              <h3
                className={clsx(styles['difficulty-name'], 'dotgothic16-bold')}
              >
                ハード
              </h3>
              <p className={styles['difficulty-desc']}>形容詞 + モノ</p>
              <div className={styles['difficulty-example']}>例：白いコップ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
