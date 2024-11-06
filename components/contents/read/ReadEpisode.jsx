'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReadEpisode({ params }) {
  const router = useRouter();
  const [episodeData, setEpisodeData] = useState(null);
  const [error, setError] = useState(null);

  const { title, episodeTitle } = params; // Using `params` passed by Next.js

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const response = await fetch(`/api/novels/${encodeURIComponent(title)}/episodes/${encodeURIComponent(episodeTitle)}`);
        const data = await response.json();

        if (response.ok) {
          setEpisodeData(data.episode);
        } else {
          setError(data.message || 'Failed to fetch episode');
        }
      } catch (err) {
        setError('An error occurred while fetching the episode');
      }
    };

    fetchEpisodeData();
  }, [title, episodeTitle]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!episodeData) {
    return <p>Loading...</p>;
  }

  const { novelTitle, titles, contents, choices } = episodeData;

  const handleChoice = (nextChapter) => {
    localStorage.setItem(`progress-${novelTitle}`, nextChapter);
    router.push(`/novel/${encodeURIComponent(novelTitle)}/episode/${nextChapter}`);
  };

  const handleStartOver = () => {
    localStorage.removeItem(`progress-${novelTitle}`);
    router.push(`/novel/${encodeURIComponent(novelTitle)}/episode/0`);
  };

  return (
    <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">{novelTitle}</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-4">{titles}</h2>
        <p className="text-gray-600 mt-2">{contents}</p>

        {choices && (
          <div className="mt-6 space-y-4">
            {choices.map((choice, index) => (
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

        <button
          onClick={handleStartOver}
          className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
