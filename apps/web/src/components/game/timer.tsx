import React, { useEffect, useState } from 'react';

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
    return '#007bff';
  };

  // 時間を MM:SS 形式でフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="timer-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        color: 'white',
        minWidth: '100px',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: getTimerColor(),
          fontFamily: 'monospace',
        }}
      >
        {formatTime(timeLeft)}
      </div>
      {timeLeft <= 10 && (
        <div
          style={{
            fontSize: '10px',
            color: '#ff4444',
            marginTop: '2px',
            animation: 'blink 1s infinite',
          }}
        >
          急いで！
        </div>
      )}
      <style>{`
        @keyFrames blink {
          0%m 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
