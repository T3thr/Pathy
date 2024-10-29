// components/NovelDetail.jsx
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './NovelDetail.module.css'; // Adjust the path as necessary

export default function NovelDetail({ novelDetails }) {
  const router = useRouter();

  // Check if the novelDetails prop is provided
  if (!novelDetails) {
    return <div>Novel not found</div>; // Handle case when the novel is not found
  }

  const handleReadNow = () => {
    router.push(` /novel/${encodeURIComponent(novelDetails.title)}/read`);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{novelDetails.title}</h1>
      <img className={styles.coverImage} src={novelDetails.imageUrl} alt={`Cover of ${novelDetails.title}`} />
      <h2 className={styles.author}>By {novelDetails.author}</h2>
      <p className={styles.description}>{novelDetails.description}</p>
      <button className={styles.readButton} onClick = {handleReadNow}>
        Read Now
      </button>
    </div>
  );
};
