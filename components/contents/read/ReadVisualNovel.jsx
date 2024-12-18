'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { visualStories } from '@/data/visualstories';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookmarkIcon, 
  RefreshCcwIcon, 
  HeartIcon,
  SmileIcon,
  FrownIcon,
  ThumbsUpIcon,
  ThumbsDownIcon
} from 'lucide-react';

export default function ReadVisualNovel({ params }) {
  const router = useRouter();
  const [story, setStory] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [gameStatus, setGameStatus] = useState({
    mood: 'neutral',
    relationships: {},
    stats: {
      happiness: 50,
      relationship: 0,
      knowledge:0,
      romance: 0,
      trust: 50,
    }
  });

  const [progressHistory, setProgressHistory] = useState([]);
  const [showStatusPanel, setShowStatusPanel] = useState(false);

  const loadStory = useCallback(() => {
    const title = decodeURIComponent(params.title);
    const selectedStory = visualStories[title];

    if (selectedStory) {
      setStory(selectedStory);
      
      const savedProgress = localStorage.getItem(`visual-progress-${title}`);
      const startSceneId = savedProgress ? Number(savedProgress) : 0;
      
      const startScene = selectedStory.find(scene => scene.id === startSceneId);
      setCurrentScene(startScene);
      
      // Reset game status
      setGameStatus({
        mood: 'neutral',
        relationships: {},
        stats: {
          happiness: 50,
          relationship: 0,
          knowledge:0,
          romance: 0,
          trust: 50,
        }
      });

      // Reset progress history
      setProgressHistory([startScene]);
    }
  }, [params.title]);

  useEffect(() => {
    loadStory();
    
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('touchmove', preventDefaults, { passive: false });
    return () => {
      window.removeEventListener('touchmove', preventDefaults);
    };
  }, [loadStory]);

  const saveProgress = useCallback(() => {
    if (currentScene) {
      const title = decodeURIComponent(params.title);
      localStorage.setItem(`visual-progress-${title}`, currentScene.id.toString());
      
      const saveNotification = document.createElement('div');
      saveNotification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300';
      saveNotification.textContent = 'Progress Saved Successfully!';
      document.body.appendChild(saveNotification);

      setTimeout(() => {
        saveNotification.classList.add('opacity-0');
        setTimeout(() => {
          document.body.removeChild(saveNotification);
        }, 300);
      }, 2000);
    }
  }, [currentScene, params.title]);

  const handleChoice = useCallback((choice) => {
    if (!story) return;

    // Update game status based on choice
    setGameStatus(prev => {
      const newStats = { ...prev.stats };
      
      // Update stats if choice has impact
      if (choice.impact) {
        Object.keys(choice.impact).forEach(key => {
          if (key in newStats) {
            newStats[key] = Math.max(0, Math.min(100, newStats[key] + choice.impact[key]));
          }
        });
      }

      return {
        ...prev,
        stats: newStats,
        mood: determineMood(newStats)
      };
    });

    const nextScene = story.find(scene => scene.id === choice.nextSceneId);
    if (nextScene) {
      setCurrentScene(nextScene);
      setProgressHistory(prev => [...prev, nextScene]);
    }
  }, [story]);

  // Determine mood based on stats
  const determineMood = (stats) => {
    const avgStat = Object.values(stats).reduce((a, b) => a + b, 0) / Object.keys(stats).length;
    
    if (avgStat > 75) return 'happy';
    if (avgStat < 25) return 'sad';
    return 'neutral';
  };

  const advanceScene = useCallback(() => {
    if (!currentScene || !currentScene.nextScene) return;

    if (currentScene.nextScene.type === 'auto') {
      const nextScene = story.find(scene => scene.id === currentScene.nextScene.nextSceneId);
      if (nextScene) {
        setCurrentScene(nextScene);
        setProgressHistory(prev => [...prev, nextScene]);
      }
    }
  }, [currentScene, story]);

  const resetProgress = () => {
    const title = decodeURIComponent(params.title);
    localStorage.removeItem(`visual-progress-${title}`);
    loadStory();
  };

  // Mood Icon Component
  const MoodIcon = () => {
    const iconProps = { size: 24, className: 'text-white' };
    switch(gameStatus.mood) {
      case 'happy': return <SmileIcon {...iconProps} />;
      case 'sad': return <FrownIcon {...iconProps} />;
      default: return <HeartIcon {...iconProps} />;
    }
  };

  if (!story || !currentScene) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="relative w-full max-w-[1200px] h-full max-h-[640px] bg-black rounded-none md:rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Scene Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
          style={{ 
            backgroundImage: `url(${currentScene.backgroundImage})`,
          }}
        />

        {/* Game Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <button 
            onClick={() => router.back()}
            className="bg-gray-700/50 text-white p-2 rounded-full hover:bg-gray-600/50 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex space-x-2 items-center">
            {/* Status Toggle Button */}
            <button 
              onClick={() => setShowStatusPanel(!showStatusPanel)}
              className="bg-purple-700/50 text-white p-2 rounded-full hover:bg-purple-600/50 transition-all"
            >
              <MoodIcon />
            </button>

            <button 
              onClick={saveProgress}
              className="bg-green-700/50 text-white p-2 rounded-full hover:bg-green-600/50 transition-all"
            >
              <BookmarkIcon size={24} />
            </button>
            <button 
              onClick={resetProgress}
              className="bg-red-700/50 text-white p-2 rounded-full hover:bg-red-600/50 transition-all"
            >
              <RefreshCcwIcon size={24} />
            </button>
            <div className="bg-gray-700/50 text-white px-4 py-2 rounded-lg">
              Chapter {currentScene.chapter}
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <AnimatePresence>
          {showStatusPanel && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 right-4 bg-black/80 text-white p-4 rounded-xl z-30 w-64"
            >
              <h3 className="text-xl font-bold mb-4 text-center">Game Status</h3>
              {Object.entries(gameStatus.stats).map(([stat, value]) => (
                <div key={stat} className="mb-2">
                  <div className="flex justify-between mb-1 capitalize">
                    <span>{stat}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Image */}
        <motion.div 
          key={currentScene.characterImage}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex-grow flex items-end justify-center z-0 md:px-20"
        >
          <Image
            src={currentScene.characterImage}
            alt={currentScene.characterName}
            width={600}
            height={600}
            className="object-contain max-w-full max-h-[60vh] md:max-h-[70vh]"
            priority
          />
        </motion.div>

        {/* Dialogue Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 w-full bg-black/80 text-white p-6"
          onClick={currentScene.nextScene?.type === 'auto' ? advanceScene : null}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-purple-300">{currentScene.characterName}</h2>
            <p className="text-lg mb-4">{currentScene.dialogue}</p>

            {/* Interactive Choices */}
            {currentScene.nextScene?.type === 'choice' && (
              <div className="flex flex-wrap gap-4 justify-center">
                {currentScene.nextScene.options.map((choice, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice(choice)}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    {choice.text}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-white"
      >
        <h1 className="text-4xl font-bold mb-4 animate-pulse">กำลังโหลดเรื่องราว...</h1>
        <p className="text-xl animate-bounce">Please wait...</p>
      </motion.div>
    </div>
  );
}