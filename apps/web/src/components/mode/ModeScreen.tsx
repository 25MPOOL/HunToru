import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import huntoru from '../../assets/huntoru.png';
import { PixelBubble } from '../ui/PixelBubble';
import styles from './ModeScreen.module.css';

import { API_CONFIG } from '@/web/lib/api';
import type { Theme } from '@/web/types';

export const ModeScreen = () => {
  const navigate = useNavigate();

  const handleModeSelect = useCallback(
    (mode: string) => {
      navigate('/photo', { state: { mode } });
    },
    [navigate],
  );

  const fetchThemes = useCallback(async (mode: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}themes?difficulty=${mode}`,
      );
      const themes: Theme[] = await response.json();

      // localStorage に themes を保存する
      localStorage.setItem('currentThemes', JSON.stringify(themes));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <motion.div
      className={clsx(styles.screen, styles['difficulty-screen'])}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
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
            onClick={async () => {
              await fetchThemes('EASY');
              handleModeSelect('EASY');
            }}
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
            onClick={async () => {
              await fetchThemes('NORMAL');
              handleModeSelect('NORMAL');
            }}
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
            onClick={async () => {
              await fetchThemes('HARD');
              handleModeSelect('HARD');
            }}
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
    </motion.div>
  );
};
