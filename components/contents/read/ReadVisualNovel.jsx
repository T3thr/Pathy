'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { visualStories } from '@/data/visualstories';
import Loading from '@/app/loading';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookmarkIcon, 
  RefreshCcwIcon, 
  HeartIcon,
  SmileIcon,
  FrownIcon,
  Users,
  BarChart2
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
      knowledge: 0
    }
  });

  const [progressHistory, setProgressHistory] = useState([]);
  const [showRelationshipPanel, setShowRelationshipPanel] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(false);

  const initializeRelationships = (storyData) => {
    const characters = new Set();
    storyData.forEach(scene => {
      if (scene.characterName && scene.characterName !== 'Narrator') {
        characters.add(scene.characterName);
      }
    });

    const relationships = {};
    characters.forEach(character => {
      relationships[character] = {
        trust: 0,
        romance: 0
      };
    });
    return relationships;
  };

  const loadStory = useCallback(() => {
    const title = decodeURIComponent(params.title);
    const selectedStory = visualStories[title];

    if (selectedStory) {
      setStory(selectedStory);
      
      const savedProgress = localStorage.getItem(`visual-progress-${title}`);
      const startSceneId = savedProgress ? Number(savedProgress) : 0;
      const startScene = selectedStory.find(scene => scene.id === startSceneId);
      
      // Initialize relationships based on story characters
      const initialRelationships = initializeRelationships(selectedStory);
      
      setCurrentScene(startScene);
      setGameStatus({
        mood: 'neutral',
        relationships: initialRelationships,
        stats: {
          happiness: 50,
          knowledge: 0
        }
      });
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
    return () => window.removeEventListener('touchmove', preventDefaults);
  }, [loadStory]);

  const saveProgress = useCallback(() => {
    if (currentScene) {
      const title = decodeURIComponent(params.title);
      localStorage.setItem(`visual-progress-${title}`, currentScene.id.toString());
      
      const saveNotification = document.createElement('div');
      saveNotification.className = 'fixed top-36 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300';
      saveNotification.textContent = 'Progress Saved Successfully!';
      document.body.appendChild(saveNotification);

      setTimeout(() => {
        saveNotification.classList.add('opacity-0');
        setTimeout(() => document.body.removeChild(saveNotification), 300);
      }, 2000);
    }
  }, [currentScene, params.title]);

  const handleChoice = useCallback((choice) => {
    if (!story || !currentScene) return;

    setGameStatus(prev => {
      const newStats = { ...prev.stats };
      const newRelationships = { ...prev.relationships };
      
      if (choice.impact) {
        // Update general stats
        Object.entries(choice.impact).forEach(([key, value]) => {
          if (key in newStats) {
            newStats[key] = Math.max(0, Math.min(100, newStats[key] + value));
          }
        });

        // Update relationship stats for current character
        if (currentScene.characterName in newRelationships) {
          const relationship = newRelationships[currentScene.characterName];
          if (choice.impact.trust) {
            relationship.trust = Math.max(0, Math.min(100, relationship.trust + choice.impact.trust));
          }
          if (choice.impact.romance) {
            relationship.romance = Math.max(0, Math.min(100, relationship.romance + choice.impact.romance));
          }
        }
      }

      return {
        ...prev,
        stats: newStats,
        relationships: newRelationships,
        mood: determineMood(newStats)
      };
    });

    const nextScene = story.find(scene => scene.id === choice.nextSceneId);
    if (nextScene) {
      setCurrentScene(nextScene);
      setProgressHistory(prev => [...prev, nextScene]);
    }
  }, [story, currentScene]);

  const determineMood = useCallback((stats) => {
    const avgStat = Object.values(stats).reduce((a, b) => a + b, 0) / Object.keys(stats).length;
    if (avgStat > 75) return 'happy';
    if (avgStat < 25) return 'sad';
    return 'neutral';
  }, []);

  const RelationshipPanel = () => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute top-16 left-4 bg-black/80 text-white p-4 rounded-xl z-30 w-72"
    >
      <h3 className="text-xl font-bold mb-4 text-center">Character Relationships</h3>
      <div className="space-y-4">
        {Object.entries(gameStatus.relationships).map(([character, stats]) => (
          <div key={character} className="border-b border-gray-700 pb-3">
            <h4 className="text-lg font-semibold text-purple-300 mb-2">{character}</h4>
            {Object.entries(stats).map(([stat, value]) => (
              <div key={stat} className="mb-2">
                <div className="flex justify-between mb-1 capitalize">
                  <span>{stat}</span>
                  <span>{value}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      stat === 'trust' ? 'bg-blue-500' : 'bg-pink-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );

  const StatusPanel = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-16 right-4 bg-black/80 text-white p-4 rounded-xl z-30 w-64"
    >
      <h3 className="text-xl font-bold mb-4 text-center">Player Status</h3>
      {Object.entries(gameStatus.stats).map(([stat, value]) => (
        <div key={stat} className="mb-4">
          <div className="flex justify-between mb-1 capitalize">
            <span>{stat}</span>
            <span>{value}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                stat === 'happiness' ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );

  if (!story || !currentScene) return <Loading />;

  return (
    <div className="fixed sm:relative items-center lg:mt-2 justify-center w-screen h-screen bg-var-background overflow-hidden">
      <div className="relative w-full items-center justify-center mx-auto lg:my-2 lg:max-w-[1200px] h-full lg:max-h-[580px] max-w-[560px] max-h-[590px] bg-black rounded-none md:rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
          style={{ backgroundImage: `url(${currentScene.backgroundImage})` }}
        />

        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <button 
            onClick={() => router.back()}
            className="bg-gray-700/50 text-white p-2 rounded-full hover:bg-gray-600/50 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex space-x-2 items-center">
            <button 
              onClick={() => {
                setShowRelationshipPanel(!showRelationshipPanel);
                setShowStatusPanel(false);
              }}
              className="bg-purple-700/50 text-white p-2 rounded-full hover:bg-purple-600/50 transition-all"
            >
              <Users size={24} />
            </button>
            
            <button 
              onClick={() => {
                setShowStatusPanel(!showStatusPanel);
                setShowRelationshipPanel(false);
              }}
              className="bg-green-700/50 text-white p-2 rounded-full hover:bg-green-600/50 transition-all"
            >
              <BarChart2 size={24} />
            </button>

            <button 
              onClick={saveProgress}
              className="bg-blue-700/50 text-white p-2 rounded-full hover:bg-blue-600/50 transition-all"
            >
              <BookmarkIcon size={24} />
            </button>
            
            <button 
              onClick={() => {
                const title = decodeURIComponent(params.title);
                localStorage.removeItem(`visual-progress-${title}`);
                loadStory();
              }}
              className="bg-red-700/50 text-white p-2 rounded-full hover:bg-red-600/50 transition-all"
            >
              <RefreshCcwIcon size={24} />
            </button>
            
            <div className="bg-gray-700/50 text-white px-4 py-2 rounded-lg">
              {currentScene.title}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showRelationshipPanel && <RelationshipPanel />}
          {showStatusPanel && <StatusPanel />}
        </AnimatePresence>

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
            className="object-contain max-w-[440px] max-h-[40vh] md:max-h-[60vh]"
            priority
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 w-full bg-black/80 text-white p-6"
          onClick={currentScene.nextScene?.type === 'auto' ? () => {
            if (!currentScene.nextScene) return;
            const nextScene = story.find(scene => scene.id === currentScene.nextScene.nextSceneId);
            if (nextScene) {
              setCurrentScene(nextScene);
              setProgressHistory(prev => [...prev, nextScene]);
            }
          } : undefined}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-purple-300">
              {currentScene.characterName}
            </h2>
            <p className="text-lg mb-4">{currentScene.dialogue}</p>

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