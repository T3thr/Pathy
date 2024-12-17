'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { visualStories } from '@/data/visualstories';

export default function ReadVisualNovel({ params }) {
  const [story, setStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    const title = decodeURIComponent(params.title);
    if (visualStories[title]) {
      setStory(visualStories[title]);
      const savedProgress = localStorage.getItem(`visual-progress-${title}`);
      setCurrentChapter(savedProgress ? Number(savedProgress) : 0);
    }
  }, [params.title]);

  const handleChoice = (nextChapter) => {
    setCurrentChapter(nextChapter);
    localStorage.setItem(`visual-progress-${params.title}`, nextChapter);
  };

  if (!story) {
    return <p className="text-var-muted text-center">Visual novel not found.</p>;
  }

  const chapter = story[currentChapter];

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-black"
      style={{ backgroundImage: `url(${chapter.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Character Image */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
        <Image
          src={chapter.characterImage}
          alt={chapter.characterName}
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </div>

      {/* Dialogue Box */}
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">{chapter.characterName}</h2>
        <p className="text-lg mb-4">{chapter.dialogue}</p>

        {/* Choices */}
        {chapter.choices && (
          <div className="flex space-x-4">
            {chapter.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice.nextChapter)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
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
