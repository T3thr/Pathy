// components/Novel.jsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './Novel.module.css';
import { novels, recommendationText } from '@/data/novels';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Novel() {
  const [categorizedNovels, setCategorizedNovels] = useState({});
  const [viewCounts, setViewCounts] = useState({});
  const novelListRefs = useRef({});
  const router = useRouter();

  useEffect(() => {
    const newCategorizedNovels = {
      รักหวานแหวว: [],
      ตลกขบขัน: [],
      สยองขวัญ: [],
      แฟนตาซี: [],
    };

    novels.forEach(novel => {
      if (novel.genre in newCategorizedNovels) {
        newCategorizedNovels[novel.genre].push(novel);
        if (!viewCounts[novel.title]) {
          setViewCounts(prevCounts => ({ ...prevCounts, [novel.title]: 0 }));
        }
      }
    });

    setCategorizedNovels(newCategorizedNovels);
  }, [viewCounts]);

  // Fetch the view count for each novel from the backend
  useEffect(() => {
    novels.forEach(novel => {
      const fetchViewCount = async () => {
        try {
          const response = await axios.get(`/api/novels/${encodeURIComponent(novel.title)}/viewCount`);
          if (response.status === 200) {
            setViewCounts(prevCounts => ({
              ...prevCounts,
              [novel.title]: response.data.viewCount,
            }));
          }
        } catch (error) {
          console.error(`Error fetching view count for ${novel.title}:`, error);
        }
      };
      fetchViewCount();
    });
  }, []);

    // Define gradients for each genre
    const genreGradients = {
      รักหวานแหวว: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
      ตลกขบขัน: 'linear-gradient(135deg, #f6d365, #fda085)',
      สยองขวัญ: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      แฟนตาซี: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    };

  const handleNovelSelect = async (novel) => {
    try {
      const response = await axios.post(`/api/novels/${encodeURIComponent(novel.title)}/view`, {
        genre: novel.genre,
        author: novel.author,
        description: novel.description,
        imageUrl: novel.imageUrl,
      });

      if (response.status === 200 || response.status === 201) {
        router.push(`/novel/${encodeURIComponent(novel.title)}`); // Navigate to the detail page
      }
    } catch (error) {
      console.error(`Error updating view count for ${novel.title}:`, error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>ยินดีต้อนรับ</h1>
      <p className={styles.textSection}>{recommendationText}</p>

      {Object.entries(categorizedNovels).map(([genre, novels]) => (
        <div className={styles.genreSection} key={genre}>
          <div className={styles.genreHeader} style={{ background: genreGradients[genre] }}>
            {genre}
          </div>
          <div
            className={styles.novelList}
            ref={(el) => (novelListRefs.current[genre] = el)}
            onTouchStart={(event) => handleTouchStart(event, genre)}
            onTouchMove={(event) => handleTouchMove(event, genre)}
          >
            {novels.length > 0 ? novels.map((novel, index) => (
              <a
                key={novel.title} // Assuming titles are unique
                href={`/novel/${encodeURIComponent(novel.title)}`}
                className={`${styles.novelCard} ${index === 0 ? styles.firstNovel : ''}`} // Add conditionally 'firstNovel' class
                aria-label={`Read ${novel.title}`} 
              >
                <img className={styles.novelImage} src={novel.imageUrl} alt={`Cover of ${novel.title}`} />
                <h3 className={styles.novelTitle}>{novel.title}</h3>
                <p className={styles.viewCount}>Views: {viewCounts[novel.title] || 0}</p>
              </a>
            )) : <p className={styles.noNovels}>ไม่มีนิยายในหมวดหมู่นี้</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
