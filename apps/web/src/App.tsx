import { useState } from 'react';

import { GameScreen } from './components/game/game-screen';
import type { JudgeResult } from './components/game/types';

import './App.css';

function App() {
  const [gameResult, setGameResult] = useState<JudgeResult | null>(null);
  const [showGame, setShowGame] = useState(true);

  const handleGameEnd = (result: JudgeResult) => {
    setGameResult(result);
    setShowGame(false);
  };

  const handleStartNewGame = () => {
    setGameResult(null);
    setShowGame(true);
  };

  return (
    <div className="app">
      {showGame ? (
        <GameScreen onGameEnd={handleGameEnd} />
      ) : (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1>🎉 ゲーム終了！</h1>
          {gameResult && (
            <div style={{ marginBottom: '30px' }}>
              <p>最終スコア: {(gameResult.label_score * 100).toFixed(1)}%</p>
              <p>{gameResult.success ? '🎯 成功！' : '😅 次回頑張ろう！'}</p>
            </div>
          )}
          <button
            onClick={handleStartNewGame}
            style={{
              padding: '15px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            新しいゲームを始める
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
