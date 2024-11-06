// pages/novel/[title]/read/page.js
'use client'
import React, { useState } from 'react';
import ReadNovel from '@/components/contents/read/ReadNovel'; // Adjust the import path as necessary
import { novels } from '@/data/novels'; // Import the novels data
import { stories } from '@/data/stories'; // Import the stories data

export default function ReadPage({ params }) {
  const title = decodeURIComponent(params.title);
  
  const novelDetails = novels.find(novel => novel.title === title);
  
  // Check if the novel exists early on, before using useState
  if (!novelDetails) {
    return <p>Novel not found.</p>;
  }

  // Proceed with useState and other logic
  const story = stories[novelDetails.title];
  const [currentChapter, setCurrentChapter] = useState(0);

  // Handle user's choice and move to the next chapter
  const handleChoice = (nextChapter) => {
    setCurrentChapter(nextChapter);
  };

  return (
    <ReadNovel
      title={novelDetails.title}
      story={story}
      currentChapter={currentChapter}
      onChoice={handleChoice}
    />
  );
}
