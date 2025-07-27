import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import huntoru from '../../assets/huntoru.png';
import styles from './HomeScreen.module.css';

export const HomeScreen = () => {
  const navigate = useNavigate();

  const handleStartGame = useCallback(() => {
    navigate('/mode');
  }, [navigate]);

  return (
    <motion.div
      className={clsx(styles.screen, styles['home-screen'], styles.active)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles['floating-bg']}>🍎</div>
      <div className={styles['floating-bg']}>🍞</div>
      <div className={styles['floating-bg']}>🥛</div>
      <div className={styles['floating-bg']}>🍪</div>

      <div className={styles.content}>
        <div className={styles['home-content']}>
          <motion.h1
            className={styles['app-title']}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            HunToru
          </motion.h1>
          <motion.p
            className={styles['app-subtitle']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            写真をHuntしよう!
          </motion.p>

          <motion.div
            className={styles['character-area']}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <img
              src={huntoru}
              alt="huntoru"
              className={styles['character-image']}
            />
          </motion.div>

          <motion.button
            className={styles['start-btn']}
            onClick={handleStartGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ゲームを始める
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
