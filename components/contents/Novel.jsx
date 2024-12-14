"use client";
import React, { useEffect, useState, useRef } from 'react';
import { novels, recommendationText } from '@/data/novels';
import { stories } from '@/data/stories';
import { useRouter } from 'next/navigation';
import { useNovelViewCounts, addNovelEpisodes } from '@/backend/lib/novelAction';
import { useTheme } from '@/context/Theme'; // Accessing Theme Context.

export const genreGradients = {
  รักหวานแหวว: 'bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 shadow-pink-400',
  ตลกขบขัน: 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 shadow-yellow-400',
  สยองขวัญ: 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-blue-400',
  แฟนตาซี: 'bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 shadow-purple-400',
};

export default function Novel() {
  const [categorizedNovels, setCategorizedNovels] = useState({});
  const novelListRefs = useRef({});
  const router = useRouter();
  const { theme } = useTheme(); // Accessing the current theme (light/dark).

  // Fetch view counts
  const { data: viewCounts, error } = useNovelViewCounts();

  useEffect(() => {
    const newCategorizedNovels = {
      รักหวานแหวว: [],
      ตลกขบขัน: [],
      สยองขวัญ: [],
      แฟนตาซี: [],
    };

    novels.forEach((novel) => {
      if (novel.genre in newCategorizedNovels) {
        newCategorizedNovels[novel.genre].push(novel);
      }
    });

    setCategorizedNovels(newCategorizedNovels);
  }, []);

  const handleAddEpisodes = async (novelTitle) => {
    const episodes = stories[novelTitle];
    if (!episodes) {
      console.error(`No episodes found for novel: ${novelTitle}`);
      return;
    }

    const success = await addNovelEpisodes(novelTitle, episodes);
    if (success) {
      console.log(`Episodes for ${novelTitle} added successfully`);
      router.push(`/novel/${encodeURIComponent(novelTitle)}`);
    } else {
      console.error(`Failed to add episodes for ${novelTitle}`);
    }
  };

  if (error) return <p className="text-red-500 text-center">404 - Not Found</p>;
  if (!viewCounts) return null;

  return (
    <div
      className={`max-w-7xl mx-auto p-6 bg-var-container rounded-lg shadow-lg transition-all ${
        theme === 'dark' ? 'shadow-black' : 'shadow-gray-300'
      } theme-change-animation`}
    >
      <h1 className="text-center text-4xl font-bold text-var-foreground mb-8 drop-shadow-xl">
        ยินดีต้อนรับ
      </h1>
      <p className="text-center text-lg text-var-muted mb-10">{recommendationText}</p>

      {Object.entries(categorizedNovels).map(([genre, novels]) => (
        <div className="mb-12" key={genre}>
          <div
            className={`text-white text-xl font-semibold p-4 rounded-md mb-6 shadow-lg transform transition-transform ${genreGradients[genre]}`}
          >
            {genre}
          </div>
          <div
            className="pt-2 pl-4 flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400"
            ref={(el) => (novelListRefs.current[genre] = el)}
          >
            {novels.length > 0 ? (
              novels.map((novel) => (
                <a
                  key={novel.title}
                  href={`/novel/${encodeURIComponent(novel.title)}`}
                  onClick={() => handleAddEpisodes(novel.title)}
                  className={`flex flex-col w-48 justify-between dark:bg-gray-700 shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-110 hover:shadow-lg }`}
                  aria-label={`Read ${novel.title}`}
                  style={{ minWidth: '200px' }}
                >
                  <img
                    src={novel.imageUrl}
                    alt={`Cover of ${novel.title}`}
                    className="w-full h-48 object-cover transition-transform"
                  />
                  <h3 className="text-var-foreground text-center text-lg font-medium px-4 py-2">
                    {novel.title}
                  </h3>
                  <p className="text-var-muted text-sm text-center pb-4">
                    Views: {viewCounts[novel.title] || 0}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-var-muted text-sm">ไม่มีนิยายในหมวดหมู่นี้</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
