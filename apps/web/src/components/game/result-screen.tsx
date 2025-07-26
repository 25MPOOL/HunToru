import React from 'react';

import styles from './result-screen.module.css';
import type { JudgeResult } from './types';

/**
 * 4枚目：結果画面専用コンポーネント
 *
 * @description
 * - AI判定結果を受け取って表示
 * - HunToruくんのリアクション表示
 * - ピクセルアート風のレトロゲームUI
 */

interface ResultScreenProps {
  /** AI判定結果 */
  result: JudgeResult;
  /** もう一度プレイ時のコールバック */
  onPlayAgain: () => void;
  /** ホームに戻る時のコールバック */
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onPlayAgain,
  onGoHome,
}) => {
  // スコアに基づくHunToruくんの状態を決定
  const getHunToruState = () => {
    if (result.error) return 'error';
    if (result.score >= 0.7) return 'very-happy'; // label_score → score
    if (result.score >= 0.5) return 'happy';
    if (result.score >= 0.3) return 'normal';
    return 'sad';
  };

  // スコアに基づくメッセージを生成
  const getMessage = () => {
    if (result.error) return 'エラーが発生したよ！';
    if (result.reason) return result.reason; // APIからのメッセージを使用
    if (result.score >= 0.7) return '三倍太くなったよ！';
    if (result.score >= 0.5) return 'おいしかったよ！';
    if (result.score >= 0.3) return 'まあまあだったよ！';
    return 'ちょっと物足りないよ...';
  };

  const hunToruState = getHunToruState();
  const message = getMessage();

  return (
    <div className={styles.resultScreen}>
      <div className={styles.background}>
        {/* メインコンテンツエリア */}
        <div className={styles.mainContent}>
          {/* HunToruくんの吹き出し */}
          <div className={styles.speechBubble}>
            <div className={styles.speechBubbleContent}>{message}</div>
          </div>

          {/* HunToruくんのキャラクター */}
          <div className={styles.characterArea}>
            <div
              className={`${styles.hunToruCharacter} ${styles[hunToruState]}`}
            >
              {/* ピクセルアートのHunToruくんがここに表示される */}
              <div className={styles.characterSprite}></div>
            </div>
          </div>

          {/* 結果詳細（オプション） */}
          {result.success && (
            <div className={styles.resultDetails}>
              <div className={styles.scoreDisplay}>
                スコア: {(result.score * 100).toFixed(1)}%
              </div>
              {result.detectedLabels.length > 0 && (
                <div className={styles.detectedLabels}>
                  認識: {result.detectedLabels[0]}
                </div>
              )}
            </div>
          )}

          {/* エラー表示 */}
          {result.error && (
            <div className={styles.errorMessage}>{result.error}</div>
          )}

          {/* ボタンエリア */}
          <div className={styles.buttonArea}>
            <button
              className={`${styles.gameButton} ${styles.playAgainButton}`}
              onClick={onPlayAgain}
            >
              <span className={styles.buttonText}>もう一度プレイ</span>
            </button>

            <button
              className={`${styles.gameButton} ${styles.homeButton}`}
              onClick={onGoHome}
            >
              <span className={styles.buttonText}>ホームへ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
