import React from 'react';
import styles from './loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <img 
        src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTZ6aTBha21zNWVrbGd6Mmw0cmRkdG9iOWZrdHA4NHg1Yjg4bHlxbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gJ3mEToTDJn3LT6kCT/giphy.gif"  // Nyan Cat GIF URL (or your own GIF)
        alt="loading"
        className={styles.gif}
      />
      <p className={styles.loadingText}>Loading, please wait...</p>
    </div>
  );
};

export default Loading;
