// components/NovelTitle.jsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useNovels } from '@/context/NovelContext'; // Adjust the path as necessary
import styles from './NovelTitle.module.css';

export default function NovelTitle() {
  const router = useRouter();
  const { title } = useParams(); // Get the title from the URL parameters
  const { novels } = useNovels(); // Use the novels from context
  const [selectedNovel, setSelectedNovel] = useState(null);

  useEffect(() => {
    // Find the novel that matches the title in the URL
    const foundNovel = Object.values(novels).flat().find(novel => novel.title.replace(/\s+/g, '-').toLowerCase() === title);
    setSelectedNovel(foundNovel);
  }, [title, novels]); // Update when title or novels change

  if (!selectedNovel) {
    return <div className={styles.loading}>Loading...</div>; // Loading state
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.novelTitle}>{selectedNovel.title}</h1>
      <img src={selectedNovel.imageUrl} alt={`Cover of ${selectedNovel.title}`} className={styles.coverImage} />
      <p className={styles.novelDescription}>{selectedNovel.description}</p>
      <p className={styles.novelAuthor}>Author: {selectedNovel.author}</p>
      <button className={styles.backButton} onClick={() => router.back()}>Back to Novels</button>
    </div>
  );
}
