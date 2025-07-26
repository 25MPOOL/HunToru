// import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import styles from './App.module.css';
import { HomeScreen } from './components/home/HomeScreen';
import { ModeScreen } from './components/mode/ModeScreen';
import { PhotoPreview } from './components/photo/PhotoPreview';
import { PhotoScreen } from './components/photo/PhotoScreen';
// import { ShootingScreen } from './components/game/shooting-screen';
// import type { JudgeResult, Theme } from './components/game/types';
import { ResultScreen } from './components/result/ResultScreen';

function App() {
  // // テスト用のお題データ
  // const testTheme: Theme = {
  //   id: 1,
  //   difficulty: 'NORMAL',
  //   theme: 'テスト', // 実際は1・2枚目から渡される
  //   aiCondition: { label: 'Test' },
  // };

  // const [showShooting, setShowShooting] = useState(true);
  // const [result, setResult] = useState<JudgeResult | null>(null);

  // const handleComplete = (judgeResult: JudgeResult) => {
  //   setResult(judgeResult);
  //   setShowShooting(false);
  //   console.log('撮影完了:', judgeResult);
  //   // 実際は4枚目（結果画面）に遷移
  // };

  // const handleRetry = () => {
  //   setResult(null);
  //   setShowShooting(true);
  // };

  return (
    <div className={styles['phone-container']}>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/mode" element={<ModeScreen />} />
            <Route path="/photo" element={<PhotoScreen />} />
            <Route path="/preview" element={<PhotoPreview />} />
            <Route path="/result" element={<ResultScreen />} />
          </Routes>
        </AnimatePresence>
      </Router>
      {/* {showShooting ? (
        <ShootingScreen theme={testTheme} onComplete={handleComplete} />
      ) : (
        <div className={styles.testResult}>
          <h1 className={styles.testResultTitle}>テスト完了</h1>
          {result && (
            <div className={styles.testResultContent}>
              <p>スコア: {(result.label_score * 100).toFixed(1)}%</p>
              <p>結果: {result.success ? '成功' : '失敗'}</p>
            </div>
          )}
          <button className={styles.testResultButton} onClick={handleRetry}>
            もう一度テスト
          </button>
        </div>
      )} */}
    </div>
  );
}

export default App;
