'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { stories } from '@/data/stories';

export default function NovelDetail({ novelDetails }) {
  const router = useRouter();
  const [episodes, setEpisodes] = useState([]);
  const [story, setStory] = useState([]);

  useEffect(() => {
    // Dynamically fetch the story for the novel
    const storyData = stories[novelDetails.title] || [];
    setStory(storyData);
  }, [novelDetails.title]);

  const updateViewCount = useCallback(async () => {
    try {
      const response = await axios.post(`/api/novels/${encodeURIComponent(novelDetails.title)}/viewCount`, {
        title: novelDetails.title,
      });
      return response.data.viewCount;
    } catch (error) {
      console.error('Failed to update view count:', error);
      return null;
    }
  }, [novelDetails.title]);
  

  const handleReadNovel = useCallback(async (resetProgress = false) => {
    if (resetProgress) {
      localStorage.removeItem(`progress-${novelDetails.title}`);
    }

    await updateViewCount();
    router.push(`/novel/${encodeURIComponent(novelDetails.title)}/read`);
  }, [novelDetails, router, updateViewCount]);

  const handleEpisodeRead = useCallback(async (episodeIndex) => {
    const currentEpisode = story[episodeIndex];
    if (currentEpisode && currentEpisode.choices) {
      localStorage.setItem(`progress-${novelDetails.title}`, episodeIndex.toString());
  
      // Trigger the view count update for the episode
      await updateViewCount();
  
      router.push(`/novel/${encodeURIComponent(novelDetails.title)}/read`);
    }
  }, [story, novelDetails, router, updateViewCount]);

  const [lastReadChapter, setLastReadChapter] = useState(null);

  useEffect(() => {
    const progress = localStorage.getItem(`progress-${novelDetails.title}`);
    setLastReadChapter(progress ? parseInt(progress, 10) : null);
  }, [novelDetails.title]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-var-container text-var-foreground rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center animate-fadeIn">{novelDetails.title}</h1>

      <div className="relative w-full h-64 mb-4">
        <Image 
          src={novelDetails.imageUrl} 
          alt={`Cover of ${novelDetails.title}`} 
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          priority
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">By {novelDetails.author}</h2>
      <p className="text-base mb-6 text-var-muted">{novelDetails.description}</p>

      <div className="flex space-x-4 mb-8">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          onClick={() => handleReadNovel()}
        >
          {lastReadChapter !== null ? 'Continue Reading' : 'Start Reading'}
        </button>

        {lastReadChapter !== null && (
          <button 
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none"
            onClick={() => handleReadNovel(true)}
          >
            Start Over
          </button>
        )}

        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none"
          onClick={() => router.push(`/novel/${encodeURIComponent(novelDetails.title)}/readvisual`)}
        >
          Read Visual Version
        </button>
      </div>


      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Story Chapters</h3>
        {story.length > 0 ? (
          <div className="space-y-4">
            {story.map((episode, index) => (
              <div 
                key={index} 
                className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-var-divider"
              >
                <h4 className="text-xl font-semibold mb-2">{episode.title}</h4>
                <p className="text-var-muted mb-4">
                  {episode.content ? `${episode.content.slice(0, 100)}...` : 'No content available'}
                </p>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none"
                  onClick={() => handleEpisodeRead(index)}
                >
                  Read Chapter
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No chapters available for this novel.</p>
        )}
      </div>
    </div>
  );
}
