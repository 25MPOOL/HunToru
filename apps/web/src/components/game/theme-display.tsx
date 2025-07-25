import React from 'react';

import type { ThemeDisplayProps } from './types';

/**
 * お題表示コンポーネント（1個ランダム表示版）
 *
 * @description
 * - /themes APIから取得した1つのランダムお題を表示
 * - ユーザーが確認後、撮影開始ボタンを押して撮影フェーズへ移行
 * - 難易度に応じた視覚的な区別
 *
 * @example
 * ```tsx
 * <ThemeDisplay
 *   theme={randomTheme}
 *   onStartShooting={() => console.log('撮影開始')}
 * />
 * ```
 */
export const ThemeDisplay: React.FC<ThemeDisplayProps> = ({
  theme,
  onStartShooting,
  isLoading = false,
}) => {
  // 難易度に応じた色の取得
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return '#28a745';
      case 'NORMAL':
        return '#ffc107';
      case 'HARD':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  // 難易度の日本語表示
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'イージー';
      case 'NORMAL':
        return 'ノーマル';
      case 'HARD':
        return 'ハード';
      default:
        return '不明';
    }
  };

  if (isLoading) {
    return (
      <div
        className="theme-loading"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
            fontSize: '24px',
            textAlign: 'center',
          }}
        >
          🎯 お題を準備中...
        </div>
        <div
          style={{
            fontSize: '16px',
            opacity: 0.7,
            textAlign: 'center',
            lineHeight: '1.5',
          }}
        >
          お題をランダムに選んでいます
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div
        className="theme-error"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
            fontSize: '24px',
            color: '#dc3545',
          }}
        >
          ❌ お題の取得に失敗しました
        </div>
        <div
          style={{
            fontSize: '16px',
            opacity: 0.7,
            textAlign: 'center',
          }}
        >
          ネットワークを確認してページを再読み込みしてください
        </div>
      </div>
    );
  }

  return (
    <div
      className="theme-display"
      style={{
        padding: '20px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            marginBottom: '30px',
            fontSize: '28px',
            color: '#333',
          }}
        >
          📸 今回のお題
        </h2>

        {/* お題カード */}
        <div
          className="theme-card"
          style={{
            padding: '40px 30px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            marginBottom: '40px',
            position: 'relative',
            border: `3px solid ${getDifficultyColor(theme.difficulty_level)}`,
          }}
        >
          {/* 難易度バッジ */}
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: getDifficultyColor(theme.difficulty_level),
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {getDifficultyLabel(theme.difficulty_level)}
          </div>

          {/* お題テキスト */}
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              lineHeight: '1.4',
              marginTop: '10px',
            }}
          >
            {theme.display_text}
          </div>
        </div>

        {/* 説明テキスト */}
        <p
          style={{
            marginBottom: '30px',
            color: '#666',
            fontSize: '16px',
            lineHeight: '1.5',
          }}
        >
          このお題で撮影に挑戦しましょう！
          <br />
          制限時間は1分間です。
        </p>

        {/* 撮影開始ボタン */}
        <button
          onClick={onStartShooting}
          style={{
            width: '100%',
            padding: '18px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,123,255,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
          }}
        >
          🎯 撮影開始！
        </button>

        {/* ヒント */}
        <div
          style={{
            marginTop: '20px',
            fontSize: '14px',
            color: '#999',
            lineHeight: '1.4',
          }}
        >
          💡 ヒント: お題に近いものを明るい場所で撮影すると
          <br />
          高いスコアが狙えます！
        </div>
      </div>
    </div>
  );
};
