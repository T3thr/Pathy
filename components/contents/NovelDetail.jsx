'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './NovelDetail.module.css';
import { stories } from '../../data/stories'; // Import the stories data

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

  const handleStartOver = () => {
    // Clear the localStorage progress
    localStorage.removeItem(`progress-${novelDetails.title}`);
    router.push(`/novel/${encodeURIComponent(novelDetails.title)}/read`);
  };

  // Retrieve last read chapter from localStorage
  const lastReadChapter = localStorage.getItem(`progress-${novelDetails.title}`);

  // Retrieve the correct story from stories.js
  const story = stories[novelDetails.title];

  const handleEpisodeRead = (episodeIndex) => {
    // Get the current episode data
    const currentEpisode = story[episodeIndex];
    if (currentEpisode && currentEpisode.choices) {
      // Pass the nextChapter to the ReadNovel page
      const nextChapter = currentEpisode.choices[0].nextChapter;
      router.push(`/novel/${encodeURIComponent(novelDetails.title)}/read/`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{novelDetails.title}</h1>
      <img className={styles.coverImage} src={novelDetails.imageUrl} alt={`Cover of ${novelDetails.title}`} />
      <h2 className={styles.author}>By {novelDetails.author}</h2>
      <p className={styles.description}>{novelDetails.description}</p>
      
      <button className={styles.readButton} onClick={handleReadNow}>
        {lastReadChapter ? 'Continue Reading' : 'Start Reading'}
      </button>

      {/* Start Over Button */}
      <button className={styles.startOverButton} onClick={handleStartOver}>
        Start Over
      </button>

      <div className={styles.episodesContainer}>
        <h3 className={styles.episodesTitle}>Episodes</h3>
        {episodes.length > 0 ? (
          <div className={styles.episodesList}>
            {episodes.map((episode, index) => (
              <div key={episode._id} className={styles.episodeBox}>
                <h4 className={styles.episodeTitle}>{episode.title}</h4>
                <p className={styles.episodeContent}>
                  {episode.content ? episode.content.slice(0, 100) : 'No content available'}...
                </p>
                <button
                  className={styles.readEpisodeButton}
                  onClick={() => handleEpisodeRead(index)} // Navigate to specific episode
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
