'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './Novel.module.css';
import { novels, recommendationText } from '@/data/novels';

export default function Novel() {
  const [categorizedNovels, setCategorizedNovels] = useState({});
  const novelListRefs = useRef({});

  // Categorize novels by genre
  useEffect(() => {
    const savedNovels = localStorage.getItem('categorizedNovels');
    if (savedNovels) {
      setCategorizedNovels(JSON.parse(savedNovels));
    } else {
      // Initialize categorized novels object
      const newCategorizedNovels = {
        รักหวานแหวว: [],
        ตลกขบขัน: [],
        สยองขวัญ: [],
        แฟนตาซี: [],
      };

      // Categorize novels
      novels.forEach(novel => {
        if (novel.genre in newCategorizedNovels) {
          newCategorizedNovels[novel.genre].push(novel);
        }
      });

      setCategorizedNovels(newCategorizedNovels);
      localStorage.setItem('categorizedNovels', JSON.stringify(newCategorizedNovels));
    }
  }, []);

  // Define gradients for each genre
  const genreGradients = {
    รักหวานแหวว: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    ตลกขบขัน: 'linear-gradient(135deg, #f6d365, #fda085)',
    สยองขวัญ: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    แฟนตาซี: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  };

  // Function to handle swipe events for mobile devices
  const handleTouchStart = (event, genre) => {
    const touchStartX = event.touches[0].clientX;
    novelListRefs.current[genre] = { touchStartX };
  };

  const handleTouchMove = (event, genre) => {
    if (novelListRefs.current[genre]) {
      const touchMoveX = event.touches[0].clientX;
      const difference = novelListRefs.current[genre].touchStartX - touchMoveX;

      // If swiping right, scroll the list to the right
      if (difference > 30) {
        event.preventDefault();
        novelListRefs.current[genre].scrollLeft += 100;
      }
      // If swiping left, scroll the list to the left
      else if (difference < -30) {
        event.preventDefault();
        novelListRefs.current[genre].scrollLeft -= 100;
      }
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
                key={index}
                href={`/novel/${encodeURIComponent(novel.title)}`}
                className={styles.novelCard}
                aria-label={`Read ${novel.title}`} // Add this line
              >
                <img className={styles.novelImage} src={novel.imageUrl} alt={`Cover of ${novel.title}`} />
                <h3 className={styles.novelTitle}>{novel.title}</h3>
              </a>
            )) : <p className={styles.noNovels}>ไม่มีนิยายในหมวดหมู่นี้</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
