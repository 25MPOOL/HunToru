import clsx from 'clsx';

import huntoru from '../../assets/huntoru.png';
import styles from './HomeScreen.module.css';

export const HomeScreen = () => {
  return (
    <div className={clsx(styles.screen, styles['home-screen'], styles.active)}>
      <div className={styles['floating-bg']}>🍎</div>
      <div className={styles['floating-bg']}>🍞</div>
      <div className={styles['floating-bg']}>🥛</div>
      <div className={styles['floating-bg']}>🍪</div>

      <div className={styles.content}>
        <div className={styles['home-content']}>
          <h1 className={styles['app-title']}>HunToru</h1>
          <p className={styles['app-subtitle']}>写真でキャラクターを育てよう</p>

          <div className={styles['character-area']}>
            <img
              src={huntoru}
              alt="huntoru"
              className={styles['character-image']}
            />
          </div>

          {/* TODO: ゲームを始めるボタンを押したら、ゲーム画面に遷移する */}
          <button className={styles['start-btn']}>ゲームを始める</button>
        </div>
      </div>
    </div>
  );
};
