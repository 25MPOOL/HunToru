import { useState } from 'react';

import styles from './App.module.css';
import { ResultScreen } from './components/game/result-screen';
import { ShootingScreen } from './components/game/shooting-screen';
import type { JudgeResult, Theme } from './components/game/types';

function App() {
  // テスト用のお題データ
  const testTheme: Theme = {
    id: 1,
    difficulty: 'NORMAL',
    theme: 'テスト', // 実際は1・2枚目から渡される
    aiCondition: { label: 'Test' },
  };

  const [currentScreen, setCurrentScreen] = useState<'shooting' | 'result'>(
    'shooting',
  );
  const [result, setResult] = useState<JudgeResult | null>(null);

  const handleComplete = (judgeResult: JudgeResult) => {
    setResult(judgeResult);
    setCurrentScreen('result');
    console.log('撮影完了:', judgeResult);
  };

  const handlePlayAgain = () => {
    setResult(null);
    setCurrentScreen('shooting');
  };

  const handleGoHome = () => {
    // 実際はホーム画面に遷移
    console.log('ホームに戻る');
    handlePlayAgain(); // 今は撮影画面に戻る
  };

  return (
    <div className={styles.app}>
      {currentScreen === 'shooting' ? (
        <ShootingScreen theme={testTheme} onComplete={handleComplete} />
      ) : (
        result && (
          <ResultScreen
            result={result}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        )
      )}
    </div>
  );
}

export default App;
