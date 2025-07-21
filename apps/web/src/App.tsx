import { useState } from 'react';
import './App.css'
import { Camera } from './components';

function App() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    console.log('画像が撮影されました:', imageData.substring(0, 50) + '...');

    // TODO: ここで画像をAPIに送信する処理を追加
    // sendImageToAPI(imageData);
  };

  return (
    <div className="app">
      <h1>HunToru カメラテスト</h1>

      {!capturedImage ? (
        <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
          <Camera onCapture={handleImageCapture} />
        </div>
      ) : (
        <div className="capture-result">
          <h2>撮影完了！</h2>
          <img
            src={capturedImage}
            alt="撮影された画像"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <button
            onClick={() => setCapturedImage(null)}
            style={{ marginTop: '10px', padding: '10px 20px' }}
          >
            もう一度撮影
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
