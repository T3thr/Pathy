'use client'
import React, { useState, useEffect } from 'react';
import { novels } from '@/data/novels'; // Import the novels data
import { stories } from '@/data/stories'; // Import the stories data
import styles from './ReadNovel.module.css'; // Make sure you have Tailwind applied here

export default function ReadNovel({ params }) {
  const [novelDetails, setNovelDetails] = useState(null);
  const [story, setStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    const title = decodeURIComponent(params.title);
    const novel = novels.find(novel => novel.title === title);
    
    if (novel) {
      setNovelDetails(novel);
      setStory(stories[novel.title]);
    }
  }, [params.title]);

  // If the novel is not found, show a message
  if (!novelDetails || !story) {
    return <p>Novel not found.</p>;
  }

  const chapter = story[currentChapter]; // Get the current chapter

  const handleChoice = (nextChapter) => {
    setCurrentChapter(nextChapter);
  };

  return (
    <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">{novelDetails.title}</h1>
        
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-700">{chapter.title}</h2>
          <p className="text-gray-600 mt-2">{chapter.content}</p>
        </div>
        
        {/* Display choices if available */}
        {chapter.choices && (
          <div className="mt-6 space-y-4">
            {chapter.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice.nextChapter)}
                className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-all"
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
