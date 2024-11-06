// components/contents/NovelDetail.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './NovelDetail.module.css';

export default function NovelDetail({ novelDetails }) {
  const [episodes, setEpisodes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(`/api/novels/${encodeURIComponent(novelDetails.title)}/episodes`);
        setEpisodes(response.data.episodes);
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      }
    };

    if (novelDetails?.title) {
      fetchEpisodes();
    }
  }, [novelDetails]);

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

      <div className={styles.episodesContainer}>
        <h3 className={styles.episodesTitle}>Episodes</h3>
        {episodes.length > 0 ? (
          <div className={styles.episodesList}>
            {episodes.map((episode) => (
              <div key={episode._id} className={styles.episodeBox}>
                <h4 className={styles.episodeTitle}>{episode.title}</h4>
                <p className={styles.episodeContent}>{episode.content.slice(0, 100)}...</p>
                <button
                  className={styles.readEpisodeButton}
                  onClick={() => router.push(`/novel/${encodeURIComponent(novelDetails.title)}/episode/${episode.title}`)}
                >
                  Read Episode
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No episodes available for this novel.</p>
        )}
      </div>
    </div>
  );
}
