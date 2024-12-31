'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { novels } from '@/data/novels';
import { useNovelViewCounts } from '@/backend/lib/novelAction';
import { genreGradients } from './Novel'; 
import { useTheme } from '@/context/Theme'; // Accessing Theme Context.
import Loading from '@/app/loading';

export default function SearchNovel() {
  const { keyword } = useParams();
  const [filteredNovels, setFilteredNovels] = useState({});
  const { data: viewCounts, error, isLoading } = useNovelViewCounts();
  const { theme } = useTheme(); // Accessing the current theme (light/dark).

  useEffect(() => {
    if (keyword) {
      const decodedKeyword = decodeURIComponent(keyword).toLowerCase();

      // Filter novels that include the keyword in the title or genre
      const categorizedNovels = novels.reduce((acc, novel) => {
        const title = novel?.title?.toLowerCase() || "";
        const genre = novel?.genre?.toLowerCase() || "";

        if (title.includes(decodedKeyword) || genre.includes(decodedKeyword)) {
          if (!acc[novel.genre]) acc[novel.genre] = [];
          acc[novel.genre].push(novel);
        }
        return acc;
      }, {});

      setFilteredNovels(categorizedNovels);
    }
  }, [keyword]);

  if (error) {
    return (
      <div className="text-red-500 text-center p-6">
        <h2 className="text-xl font-bold mb-2">Error Loading Novels</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`max-w-7xl mx-auto p-6 bg-var-container rounded-lg shadow-lg transition-all ${
        theme === 'dark' ? 'shadow-black' : 'shadow-gray-300'
      } theme-change-animation`}
    >
      <h1 className="text-center text-4xl font-bold text-var-foreground mb-8 drop-shadow-xl">
        ผลการค้นหาสำหรับ &quot;{decodeURIComponent(keyword)}&quot;
      </h1>

      {Object.keys(filteredNovels).length > 0 ? (
        Object.entries(filteredNovels).map(([genre, novels]) => (
          <div className="mb-12" key={genre}>
            <div
              className={`text-white text-xl font-semibold p-4 rounded-md mb-6 shadow-lg transform transition-transform ${genreGradients[genre]}`}
            >
              {genre}
            </div>
            <div
              className="pt-2 pl-4 flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400"
            >
              {novels.map((novel) => (
                <a
                  key={novel.title}
                  href={`/novel/${encodeURIComponent(novel.title)}`}
                  className="flex flex-col w-48 justify-between dark:bg-gray-700 shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-110 hover:shadow-lg"
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
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-var-muted text-sm">ไม่พบผลลัพธ์สำหรับ &quot;{decodeURIComponent(keyword)}&quot;</p>
      )}
    </div>
  );
}
