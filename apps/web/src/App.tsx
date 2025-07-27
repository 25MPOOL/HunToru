import styles from './App.module.css';
import { AppRoutes } from './AppRoutes';

function App() {
  return (
    <div className={styles['phone-container']}>
      <AppRoutes />
    </div>
  );
}

export default App;
