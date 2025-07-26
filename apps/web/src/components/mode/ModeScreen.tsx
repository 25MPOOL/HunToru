import clsx from 'clsx';

import styles from './ModeScreen.module.css';

export const ModeScreen = () => {
  return (
    <div className={clsx(styles.screen, styles['difficulty-screen'])}>
      <div className={styles.content}>
        <div className={styles['difficulty-header']}>
          <h1 className={styles['difficulty-title']}>難易度を選択</h1>
          <p className={styles['difficulty-subtitle']}>
            お題のムズかしさを選んでね
          </p>
        </div>

        <div className={styles['difficulty-list']}>
          {/* かんたん */}
          <div className={clsx(styles['difficulty-card'], styles.easy)}>
            <div className={styles['difficulty-icon']}>
              <div className={styles['pixel-icon']} />
            </div>
            <div className={styles['difficulty-content']}>
              <h3 className={styles['difficulty-name']}>かんたん</h3>
              <p className={styles['difficulty-desc']}>概念や抽象的なモノ</p>
              <div className={styles['difficulty-example']}>
                例：何か丸いもの
              </div>
            </div>
          </div>

          {/* ふつう */}
          <div className={clsx(styles['difficulty-card'], styles.normal)}>
            {/* おすすめバッジ */}
            <div className={styles['recommended-badge']}>おすすめ</div>
            <div className={styles['difficulty-icon']}>
              <div className={styles['pixel-icon']} />
            </div>
            <div className={styles['difficulty-content']}>
              <h3 className={styles['difficulty-name']}>ふつう</h3>
              <p className={styles['difficulty-desc']}>具体的なモノ</p>
              <div className={styles['difficulty-example']}>例：キーボード</div>
            </div>
          </div>

          {/* むずかしい */}
          <div className={clsx(styles['difficulty-card'], styles.hard)}>
            <div className={styles['difficulty-icon']}>
              <div className={styles['pixel-icon']} />
            </div>
            <div className={styles['difficulty-content']}>
              <h3 className={styles['difficulty-name']}>むずかしい</h3>
              <p className={styles['difficulty-desc']}>形容詞 + モノ</p>
              <div className={styles['difficulty-example']}>例：白いコップ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
