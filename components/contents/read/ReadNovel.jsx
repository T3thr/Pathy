// components/ReadNovel.jsx
import React from 'react';
import styles from './ReadNovel.module.css'; // Adjust the path as necessary

export default function ReadNovel({ title, content }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>
        <p>{content}</p>
      </div>
    </div>
  );
}
