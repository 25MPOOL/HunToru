import { AppRoutes } from '@/web/AppRoutes';
import styles from '@/web/styles/App.module.css';

function App() {
  return (
    <div className={styles['phone-container']}>
      <AppRoutes />
    </div>
  );
}

export default App;
