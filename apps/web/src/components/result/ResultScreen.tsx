import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import huntoru_angry from '@/web/assets/huntoru_angry.gif';
import huntoru_happy from '@/web/assets/huntoru_happy.gif';
import styles from '@/web/components/result/ResultScreen.module.css';
import { PixelBubble } from '@/web/components/ui/PixelBubble';
import components from '@/web/styles/App.module.css';

export const ResultScreen = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scoreValueRef = useRef<HTMLSpanElement>(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [reason, setReason] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const navigate = useNavigate();
  const handleReplay = useCallback(() => {
    localStorage.removeItem('judgeResult');

    // 残っている可能性があるので削除
    localStorage.removeItem('photo');
    localStorage.removeItem('currentThemes');

    navigate('/mode');
  }, [navigate]);

  const handleHome = useCallback(() => {
    localStorage.removeItem('judgeResult');

    // 残っている可能性があるので削除
    localStorage.removeItem('photo');
    localStorage.removeItem('currentThemes');

    navigate('/');
  }, [navigate]);

  const animateScore = (
    element: HTMLElement,
    start: number,
    end: number,
    duration: number,
  ) => {
    const startTime = performance.now();

    const updateScore = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = start + (end - start) * easeProgress;

      // DOM更新のみ
      element.textContent = currentValue.toFixed(2);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        element.textContent = end.toFixed(2);
      }
    };

    requestAnimationFrame(updateScore);
  };

  useEffect(() => {
    const judgeResult = JSON.parse(localStorage.getItem('judgeResult') || '{}');
    if (judgeResult.score) {
      setScore(judgeResult.score);
    }
    if (judgeResult.isMatch) {
      setIsMatch(judgeResult.isMatch);
    }
    if (judgeResult.reason) {
      setReason(judgeResult.reason);
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!isDataLoaded || score === 0) return;

    const progressBar = progressBarRef.current;
    const scoreValue = scoreValueRef.current;
    if (!progressBar || !scoreValue) return;

    const animateResult = () => {
      // 初期状態にリセット
      progressBar.style.width = '0%';
      setProgress(0);

      return setTimeout(() => {
        const targetProgress = score * 100;
        progressBar.style.width = `${targetProgress}%`;
        setProgress(targetProgress);
        animateScore(scoreValue, 0, score, 1500);
      }, 500);
    };

    const timeoutId = animateResult();
    return () => clearTimeout(timeoutId);
  }, [isDataLoaded, score]);

  return (
    <motion.div
      className={clsx(components.screen, styles['result-screen'])}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.content}>
        <div className={styles['result-content']}>
          {/* 上部の情報 */}
          <div className={styles['result-top-info']}>
            {/* プログレスバースコア表示 */}
            <div className={styles['score-progress-container']}>
              <div className={styles['score-header']}>
                <div className={styles['score-label-progress']}>似ている度</div>
                <span
                  className={styles['score-value-progress']}
                  ref={scoreValueRef}
                >
                  {score}
                </span>
              </div>
              <div className={styles['progress-bar-container']}>
                <div
                  className={styles['progress-bar-fill']}
                  style={{ width: `${progress}%` }}
                  ref={progressBarRef}
                />
              </div>
            </div>
          </div>

          {/* キャラクター */}
          <div className={styles['character-center']}>
            <PixelBubble className={styles['pixel-bubble']} />
            <p className={styles['pixel-bubble-text']}>{reason}</p>
            <img
              src={isMatch ? huntoru_happy : huntoru_angry}
              alt="huntoru"
              className={styles['character-image']}
            />
          </div>

          {/* ボタン */}
          <div className={styles['action-buttons-result']}>
            <button
              type="button"
              className={clsx(
                styles['action-button-result'],
                styles['btn-primary-result'],
              )}
              onClick={handleReplay}
            >
              もう一度とる！
            </button>
            <button
              type="button"
              className={clsx(
                styles['action-button-result'],
                styles['btn-secondary-result'],
              )}
              onClick={handleHome}
            >
              ホームへ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
