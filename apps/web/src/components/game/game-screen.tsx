import React, { useEffect, useState } from 'react';

import { Camera } from '../camera';
import { ThemeDisplay } from './theme-display';
import { Timer } from './timer';
import type { GameScreenProps, GameState } from './types';

/**
 * メインゲーム画面コンポーネント（API側1個お題提供版）
 *
 * @description
 * - ゲーム全体の進行を管理
 * - APIから1個のお題を取得 → 撮影 → 判定 → 結果の流れを制御
 * - タイマーとカメラの連携
 * - やり直し時は同じお題で写真取り直し
 *
 * @example
 * ```tsx
 * <GameScreen onGameEnd={(result) => console.log('ゲーム終了:', result)} />
 * ```
 */
export const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'THEME_DISPLAY',
    selectedTheme: null,
    remainingTime: 60,
    capturedImage: null,
    judgeResult: null,
  });

  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  // APIから1個のお題を取得（修正版）
  useEffect(() => {
    const fetchSingleTheme = async () => {
      try {
        setIsLoadingTheme(true);
        const apiUrl = import.meta.env.API_URL_DEV || 'http://localhost:8787';

        // difficultyクエリパラメータを追加
        const response = await fetch(`${apiUrl}/themes?difficulty=NORMAL`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // バックエンドは { themes: [theme] } 形式で返す（1要素の配列）
        const themes = data.themes || [];
        const theme = themes.length > 0 ? themes[0] : null;

        setGameState((prev) => ({
          ...prev,
          selectedTheme: theme,
        }));
      } catch (error) {
        console.error('お題取得エラー:', error);
        // フォールバック処理...
      } finally {
        setIsLoadingTheme(false);
      }
    };

    fetchSingleTheme();
  }, []);

  // 撮影開始時の処理
  const handleStartShooting = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'SHOOTING',
      remainingTime: 60,
    }));
    setTimerKey((prev) => prev + 1); // タイマーリセット
  };

  // 撮影完了時の処理
  const handleImageCapture = async (imageData: string) => {
    setGameState((prev) => ({
      ...prev,
      phase: 'JUDGING',
      capturedImage: imageData,
    }));

    // AI判定の実行
    await sendImageToAPI(imageData);
  };

  // 時間切れ時の処理
  const handleTimeUp = () => {
    if (gameState.phase === 'SHOOTING') {
      // 時間切れの場合は自動で撮影処理をトリガー
      console.log('⏰ 時間切れ！自動撮影します');
      // 実際の実装では、カメラコンポーネントに自動撮影を指示する必要があります
    }
  };

  // API送信処理
  const sendImageToAPI = async (imageData: string) => {
    try {
      const apiUrl = import.meta.env.API_URL_DEV || 'http://localhost:8787';

      const response = await fetch(`${apiUrl}/judge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData,
          theme: gameState.selectedTheme?.display_text || 'テストお題',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setGameState((prev) => ({
        ...prev,
        phase: 'RESULT',
        judgeResult: result,
      }));

      // 少し待ってからゲーム終了
      setTimeout(() => {
        onGameEnd(result);
      }, 3000);
    } catch (error) {
      console.error('API送信エラー:', error);
      const errorResult = {
        success: false,
        theme: gameState.selectedTheme?.display_text || 'テストお題',
        label_score: 0,
        detected_labels: [],
        message: '',
        error: '画像の送信に失敗しました。',
      };

      setGameState((prev) => ({
        ...prev,
        phase: 'RESULT',
        judgeResult: errorResult,
      }));

      setTimeout(() => {
        onGameEnd(errorResult);
      }, 3000);
    }
  };

  // やり直し処理（同じお題で写真取り直し）
  const handleRetry = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'SHOOTING', // お題表示をスキップして直接撮影フェーズへ
      remainingTime: 60,
      capturedImage: null,
      judgeResult: null,
      // selectedTheme はそのまま維持
    }));
    setTimerKey((prev) => prev + 1); // タイマーリセット
  };

  return (
    <div
      className="game-screen"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* ヘッダー部分 */}
      <div
        style={{
          padding: '10px 20px',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '20px' }}>🎯 HunToru</h1>

        {gameState.phase === 'SHOOTING' && (
          <Timer
            initialTime={60}
            onTimeUp={handleTimeUp}
            isActive={true}
            resetKey={timerKey}
          />
        )}
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {gameState.phase === 'THEME_DISPLAY' && (
          <ThemeDisplay
            theme={gameState.selectedTheme}
            onStartShooting={handleStartShooting}
            isLoading={isLoadingTheme}
          />
        )}

        {gameState.phase === 'SHOOTING' && gameState.selectedTheme && (
          <div style={{ height: '100%', position: 'relative' }}>
            {/* 選択されたお題の表示 */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                📸 お題
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {gameState.selectedTheme.display_text}
              </div>
            </div>

            {/* カメラプレビュー */}
            <div style={{ height: '100%', paddingTop: '100px' }}>
              <Camera onCapture={handleImageCapture} />
            </div>
          </div>
        )}

        {gameState.phase === 'JUDGING' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '20px' }}>
              🤖 AI が評価中...
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              しばらくお待ちください
            </div>
          </div>
        )}

        {gameState.phase === 'RESULT' && gameState.judgeResult && (
          <div style={{ padding: '20px' }}>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '30px',
              }}
            >
              <h2>🎯 結果発表！</h2>
              {gameState.judgeResult.success ? (
                <div style={{ color: '#28a745', fontSize: '18px' }}>
                  ✅ 成功！
                </div>
              ) : (
                <div style={{ color: '#dc3545', fontSize: '18px' }}>
                  ❌ 失敗
                </div>
              )}
            </div>

            {/* 撮影した画像 */}
            {gameState.capturedImage && (
              <img
                src={gameState.capturedImage}
                alt="撮影された画像"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: '8px',
                  margin: '0 auto 20px',
                  display: 'block',
                }}
              />
            )}

            {/* 判定結果 */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <p>
                <strong>スコア:</strong>{' '}
                {(gameState.judgeResult.label_score * 100).toFixed(1)}%
              </p>
              <p>
                <strong>お題:</strong> {gameState.judgeResult.theme}
              </p>
              <p>
                <strong>メッセージ:</strong> {gameState.judgeResult.message}
              </p>
            </div>

            {/* やり直しボタン */}
            <button
              onClick={handleRetry}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              📸 もう一度撮影
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
