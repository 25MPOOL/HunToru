import React, { useEffect, useState } from 'react';

import styles from './timer.module.css';
import type { TimerProps } from './types';

/**
 * ゲーム用カウントダウンタイマーコンポーネント
 *
 * @description
 * - 1分間（60秒）のカウントダウンタイマー
 * - 残り時間が少なくなると色が変化
 * - 時間切れ時に自動的にコールバックを実行
 *
 * @example
 * ```tsx
 * <Timer
 *   initialTime={60}
 *   onTimeUp={() => console.log('時間切れ!')}
 *   isActive={true}
 * />
 * ```
 */
export const Timer: React.FC<TimerProps> = ({
  initialTime,
  onTimeUp,
  isActive,
  resetKey = 0,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // タイマーリセット処理
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, resetKey]);

  // カウントダウン処理
  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  // 残り時間に応じた色の決定
  const getTimerColor = () => {
    if (timeLeft <= 10) return '#ff4444';
    if (timeLeft <= 30) return '#ff8800';
    return '#F5E6D3';
  };

  // 時間を MM:SS 形式でフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.timerContainer}>
      <span className={styles.timerIcon}>⏳</span>
      <span
        className={`${styles.timerText} ${timeLeft <= 10 ? styles.timerUrgent : ''}`}
        style={{ color: getTimerColor() }}
      >
        制限時間 {formatTime(timeLeft)}
      </span>
      {timeLeft <= 10 && <div className={styles.urgentMessage}>急いで！</div>}
    </div>
  );
};
