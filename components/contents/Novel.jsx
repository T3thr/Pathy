// components/contents/Novel.jsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './Novel.module.css';
import { novels, recommendationText } from '@/data/novels';
import { stories } from '@/data/stories';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

export default function Novel() {
  const [categorizedNovels, setCategorizedNovels] = useState({});
  const novelListRefs = useRef({});
  const router = useRouter();

  // Fetch all view counts for novels in one request
  const fetcher = url => axios.get(url).then(res => res.data);
  const { data: viewCounts, error } = useSWR('/api/novels/${encodeURIComponent(novel.title)}/viewCount', fetcher, { refreshInterval: 5000 });

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
      }
    });

    setCategorizedNovels(newCategorizedNovels);
  }, []);

  const genreGradients = {
    รักหวานแหวว: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    ตลกขบขัน: 'linear-gradient(135deg, #f6d365, #fda085)',
    สยองขวัญ: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    แฟนตาซี: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  };

  const handleAddEpisodes = async (novelTitle) => {
    const episodes = stories[novelTitle];
    if (!episodes) {
      console.error(`No episodes found for novel: ${novelTitle}`);
      return;
    }

    try {
      const response = await axios.post(`/api/novels/${encodeURIComponent(novelTitle)}/episodes`, {
        episodes,
      });

      if (response.status === 201) {
        console.log(`Episodes for ${novelTitle} added successfully`);
        router.push(`/novel/${encodeURIComponent(novelTitle)}`);
      } else {
        console.error(`Failed to add episodes for ${novelTitle}`);
      }
    } catch (error) {
      console.error(`Error adding episodes for ${novelTitle}:`, error);
    }
  };

  if (error || !viewCounts) return null; // Prevents displaying any loading or error text

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
          >
            {novels.length > 0 ? novels.map((novel, index) => (
              <a
                key={novel.title}
                href={`/novel/${encodeURIComponent(novel.title)}`}
                onClick={() => handleAddEpisodes(novel.title)}
                className={`${styles.novelCard} ${index === 0 ? styles.firstNovel : ''}`}
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
