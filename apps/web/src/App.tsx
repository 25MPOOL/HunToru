import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import styles from './App.module.css';
import { HomeScreen } from './components/home/HomeScreen';
import { ModeScreen } from './components/mode/ModeScreen';
import { PhotoPreview } from './components/photo/PhotoPreview';
import { PhotoScreen } from './components/photo/PhotoScreen';
import { ResultScreen } from './components/result/ResultScreen';

function App() {
  return (
    <div className={styles['phone-container']}>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/mode" element={<ModeScreen />} />
            <Route path="/photo" element={<PhotoScreen />} />
            <Route path="/photo/preview" element={<PhotoPreview />} />
            <Route path="/result" element={<ResultScreen />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </div>
  );
}

export default App;
