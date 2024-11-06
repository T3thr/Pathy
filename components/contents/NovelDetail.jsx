// components/NovelDetail.jsx
import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './NovelDetail.module.css';

export default function NovelDetail({ novelDetails }) {
  const router = useRouter();

  if (!novelDetails) {
    return <div>Novel not found</div>;
  }

  const handleReadNow = async () => {
    try {
      const response = await axios.post(`/api/novels/${encodeURIComponent(novelDetails.title)}/view`, {
        genre: novelDetails.genre,
        author: novelDetails.author,
        description: novelDetails.description,
        imageUrl: novelDetails.imageUrl,
      });
      console.log('Updated view count:', response.data.viewCount);
      router.push(`/novel/${encodeURIComponent(novelDetails.title)}/read`);
    } catch (error) {
      console.error('Failed to update view count:', error);
      alert('Failed to update view count. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{novelDetails.title}</h1>
      <img className={styles.coverImage} src={novelDetails.imageUrl} alt={`Cover of ${novelDetails.title}`} />
      <h2 className={styles.author}>By {novelDetails.author}</h2>
      <p className={styles.description}>{novelDetails.description}</p>
      <button className={styles.readButton} onClick={handleReadNow}>
        Read Now
      </button>
    </div>
  );
}
