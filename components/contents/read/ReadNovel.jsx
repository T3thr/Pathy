'use client';
import React, { useState, useEffect } from 'react';
import { novels } from '@/data/novels';
import { stories } from '@/data/stories';

export default function ReadNovel({ params }) {
  const [novelDetails, setNovelDetails] = useState(null);
  const [story, setStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    const title = decodeURIComponent(params.title);
    const chapter = params.chapter ? Number(params.chapter) : 0; // Get chapter from params if exists

    const novel = novels.find(novel => novel.title === title);

    if (novel) {
      setNovelDetails(novel);
      setStory(stories[novel.title]);
      setCurrentChapter(chapter);

      // Load progress from localStorage if available
      const savedProgress = localStorage.getItem(`progress-${novel.title}`);
      if (savedProgress) {
        setCurrentChapter(Number(savedProgress));
      }
    }
  }, [params.title, params.chapter]);

  const handleChoice = (nextChapter) => {
    setCurrentChapter(nextChapter);

    // Save progress in localStorage
    localStorage.setItem(`progress-${novelDetails.title}`, nextChapter);
  };

  if (!novelDetails || !story) {
    return <p className="text-var-muted">Novel not found.</p>;
  }

  const chapter = story[currentChapter];

  return (
    <div className="bg-var-background min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-var-container p-6 rounded-lg shadow-lg theme-change-animation">
        <h1 className="text-3xl font-semibold text-center text-var-foreground mb-6">
          {novelDetails.title}
        </h1>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-var-foreground">
            {chapter.title}
          </h2>
          <p className="text-var-muted mt-2">
            {chapter.content}
          </p>
        </div>

        {chapter.choices && (
          <div className="mt-4">
            {chapter.choices.map((choice, index) => (
              <button
                key={index}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 gap-3"
                onClick={() => handleChoice(choice.nextChapter)}
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
