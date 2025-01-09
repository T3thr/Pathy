'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { stories } from '@/data/stories';
import { visualStories } from '@/data/visualstories';
import { motion } from 'framer-motion';

export default function NovelDetail({ novelDetails }) {
  const router = useRouter();
  const [episodes, setEpisodes] = useState([]);
  const [story, setStory] = useState([]);
  const [visualStory, setVisualStory] = useState([]);
  const [lastReadChapter, setLastReadChapter] = useState(null);
  const [lastReadVisualProgress, setLastReadVisualProgress] = useState(null);

  // Fetch stories for both text and visual versions
  useEffect(() => {
    const textStoryData = stories[novelDetails.title] || [];
    const visualStoryData = visualStories[novelDetails.title] || [];
    
    setStory(textStoryData);
    setVisualStory(visualStoryData);
  }, [novelDetails.title]);

  // Track progress for both text and visual novels
  useEffect(() => {
    const textProgress = localStorage.getItem(`progress-${novelDetails.title}`);
    
    // Get visual novel progress
    const visualProgressString = localStorage.getItem(`visual-progress-${novelDetails.title}`);
    const visualProgress = visualProgressString ? JSON.parse(visualProgressString) : null;
    
    setLastReadChapter(textProgress ? parseInt(textProgress, 10) : null);
    setLastReadVisualProgress(visualProgress);
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
    router.push(`/novel/${encodeURIComponent(novelDetails.title)}/read`);
    await updateViewCount();
  }, [novelDetails, router, updateViewCount]);

  const handleReadVisualNovel = useCallback(async (resetProgress = false) => {
    const visualStoryData = visualStories[novelDetails.title] || [];
    
    if (resetProgress) {
      localStorage.removeItem(`visual-progress-${novelDetails.title}`);
      localStorage.removeItem(`visual-state-${novelDetails.title}`);
      setLastReadVisualProgress(null);
    }
  
    if (!visualStoryData.length) {
      console.error('No visual story data available');
      return;
    }
  
    let progressData;
    
    if (!resetProgress && lastReadVisualProgress) {
      // Continue from last saved progress
      progressData = lastReadVisualProgress;
    } else {
      // Start from the beginning
      const firstScene = visualStoryData[0];
      progressData = {
        sceneId: firstScene.id,
        chapter: firstScene.title.split(':')[0].trim() // Extract just the chapter part
      };
    }
  
    // Save the current progress
    localStorage.setItem(
      `visual-progress-${novelDetails.title}`, 
      JSON.stringify(progressData)
    );
    
    router.push(`/novel/${encodeURIComponent(novelDetails.title)}/readvisual`);
    await updateViewCount();
  }, [novelDetails, router, updateViewCount, lastReadVisualProgress]);
  
  // Update the getVisualNovelProgress function as well
  const getVisualNovelProgress = useCallback(() => {
    // If no progress saved or on first scene (sceneId = 0), show "Start Visual Novel"
    if (!lastReadVisualProgress || lastReadVisualProgress.sceneId === 0) {
      return 'Start Visual Novel';
    }
    
    // Otherwise show continue message with chapter
    return `Continue from: ${lastReadVisualProgress.chapter}`;
  }, [lastReadVisualProgress]);

  const handleEpisodeRead = useCallback(async (episodeIndex) => {
    const currentEpisode = story[episodeIndex];
    if (currentEpisode && currentEpisode.choices) {
      localStorage.setItem(`progress-${novelDetails.title}`, episodeIndex.toString());
  
      await updateViewCount();
  
      router.push(`/novel/${encodeURIComponent(novelDetails.title)}/read`);
    }
  }, [story, novelDetails, router, updateViewCount]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 bg-var-container text-var-foreground rounded-xl shadow-2xl"
    >
      <motion.h1 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-bold mb-6 text-center text-gradient dark:bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl bg-blue-200"
      >
        {novelDetails.title}
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cover Image Section */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-48 lg:h-96 rounded-xl overflow-hidden shadow-lg"
        >
          <Image 
            src={novelDetails.imageUrl} 
            alt={`Cover of ${novelDetails.title}`} 
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
            priority
          />
        </motion.div>

        {/* Novel Details Section */}
        <div>
          <motion.h2 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-semibold mb-2"
          >
            By {novelDetails.author}
          </motion.h2>

          <motion.p 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base mb-6 text-var-muted"
          >
            {novelDetails.description}
          </motion.p>

          {/* Reading Mode Buttons */}
          <div className="space-y-4">
            {/* Text Novel Reading Buttons */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Text Novel Mode</h3>
              <div className="flex space-x-4">
                <button 
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleReadNovel()}
                >
                  {lastReadChapter !== null ? 'Continue Reading' : 'Start Reading'}
                </button>

                {lastReadChapter !== null && (
                  <button 
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => handleReadNovel(true)}
                  >
                    Start Over
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div 
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: 0.6, duration: 0.5 }}
  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl"
>
  <h3 className="text-xl font-semibold mb-3 text-purple-600">Visual Novel Mode</h3>
  <div className="flex space-x-4">
    <button 
      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      onClick={() => handleReadVisualNovel()}
      disabled={!visualStory.length}
    >
      {getVisualNovelProgress()}
    </button>

    {lastReadVisualProgress && lastReadVisualProgress.sceneId !== 0 && (
      <button 
        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        onClick={() => handleReadVisualNovel(true)}
      >
        Reset Visual Novel
      </button>
    )}
  </div>
</motion.div>
          </div>
        </div>
      </div>

      {/* Story Chapters Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-12"
      >
        <h3 className="text-2xl font-semibold mb-6 text-center">Story Chapters</h3>
        {story.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {story.map((episode, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.03 }}
                className="border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all"
              >
                <h4 className="text-xl font-semibold mb-2 text-blue-600">{episode.title}</h4>
                <p className="text-var-muted mb-4 line-clamp-3">
                  {episode.content ? `${episode.content.slice(0, 150)}...` : 'No content available'}
                </p>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none transition-colors"
                  onClick={() => handleEpisodeRead(index)}
                >
                  Read Chapter
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No chapters available for this novel.</p>
        )}
      </motion.div>
    </motion.div>
  );
}