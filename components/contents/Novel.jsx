'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './Novel.module.css'; // Importing the CSS module
import { novels, recommendationText } from './NovelList';

export default function Novel() {
  const [categorizedNovels, setCategorizedNovels] = useState({});
  const novelListRefs = useRef({}); // To store refs for each genre's novel list

  // Categorize novels by genre
  useEffect(() => {
    const savedNovels = localStorage.getItem('categorizedNovels');
    if (savedNovels) {
      setCategorizedNovels(JSON.parse(savedNovels));
    } else {
      const newCategorizedNovels = {
        รักหวานแหวว: novels.filter(novel => novel.genre === "รักหวานแหวว"),
        ตลกขบขัน: novels.filter(novel => novel.genre === "ตลกขบขัน"),
        สยองขวัญ: novels.filter(novel => novel.genre === "สยองขวัญ"),
        แฟนตาซี: novels.filter(novel => novel.genre === "แฟนตาซี"),
      };
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
    const touchStartX = event.touches[0].clientX; // Get the initial touch position
    novelListRefs.current[genre] = { touchStartX }; // Store the initial touch position
  };

  const handleTouchMove = (event, genre) => {
    if (novelListRefs.current[genre]) {
      const touchMoveX = event.touches[0].clientX; // Get the current touch position
      const difference = touchStartX - touchMoveX; // Calculate the swipe distance

      // If swiping right, scroll the list to the right
      if (difference > 30) {
        event.preventDefault(); // Prevent default scrolling
        novelListRefs.current[genre].scrollLeft += 100; // Scroll right
      }
      // If swiping left, scroll the list to the left
      else if (difference < -30) {
        event.preventDefault(); // Prevent default scrolling
        novelListRefs.current[genre].scrollLeft -= 100; // Scroll left
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
            {`${genre} `}
          </div>
          <div
            className={styles.novelList}
            ref={(el) => (novelListRefs.current[genre] = el)} // Store ref for the genre list
            onTouchStart={(event) => handleTouchStart(event, genre)} // Start touch event
            onTouchMove={(event) => handleTouchMove(event, genre)} // Move touch event
          >
            {novels.map((novel, index) => (
              <a key={index} href={`/novel/${novel.title.replace(/\s+/g, '-').toLowerCase()}`} className={styles.novelCard}>
                <img className={styles.novelImage} src={novel.imageUrl} alt={`Cover of ${novel.title}`} />
                <h3 className={styles.novelTitle}>{novel.title}</h3>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
