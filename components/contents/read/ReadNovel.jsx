// components/contents/read/ReadNovel.jsx
'use client'
import React from 'react';
import styles from './ReadNovel.module.css'; // Make sure you have Tailwind applied here

export default function ReadNovel({ title, story, currentChapter, onChoice }) {
  const chapter = story[currentChapter]; // Get the current chapter

  return (
    <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">{title}</h1>
        
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
                onClick={() => onChoice(choice.nextChapter)}
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
