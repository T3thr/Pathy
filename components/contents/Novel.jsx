"use client";
import React, { useState, useEffect } from "react";
import { novels, recommendationText } from "@/data/novels";
import { stories } from "@/data/stories";
import { useRouter } from "next/navigation";
import { useNovelViewCounts, addNovelEpisodes } from "@/backend/lib/novelAction";
import { useTheme } from "@/context/Theme";
import Image from "next/image";

export const genreGradients = {
  รักหวานแหวว: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 shadow-pink-400",
  ตลกขบขัน: "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 shadow-yellow-400",
  สยองขวัญ: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-blue-400",
  แฟนตาซี: "bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 shadow-purple-400",
};

// Novel Card Component
const NovelCard = ({ novel, viewCount, onAddEpisodes }) => (
  <div
    className="flex flex-col w-48 justify-between bg-var-container shadow-var-light rounded-lg overflow-hidden transform transition-transform hover:shadow-lg cursor-pointer"
    onClick={() => onAddEpisodes(novel.title)}
    style={{ minWidth: "200px" }}
  >
    <div className="relative w-full h-48">
      <Image
        src={novel.imageUrl}
        alt={`Cover of ${novel.title}`}
        fill
        sizes="200px"
        className="object-cover"
        priority={false}
        loading="lazy"
      />
    </div>
    <h3 className="text-var-foreground text-center text-lg font-medium px-4 py-2">
      {novel.title}
    </h3>
    <p className="text-var-muted text-sm text-center pb-4">
      Views: {viewCount || 0}
    </p>
  </div>
);

// Genre Section Component
const GenreSection = ({ genre, novels, viewCounts, onAddEpisodes }) => (
  <div className="mb-12">
    <div
      className={`text-white text-xl font-semibold p-4 rounded-md mb-6 shadow-lg transform transition-transform ${genreGradients[genre]}`}
    >
      {genre}
    </div>
    <div className="pt-2 pl-4 flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400">
      {novels.length > 0 ? (
        novels.map((novel) => (
          <NovelCard
            key={novel.title}
            novel={novel}
            viewCount={viewCounts[novel.title]}
            onAddEpisodes={onAddEpisodes}
          />
        ))
      ) : (
        <p className="text-var-muted text-sm">ไม่มีนิยายในหมวดหมู่นี้</p>
      )}
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse max-w-7xl mx-auto p-6">
    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-10"></div>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="mb-12">
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="flex space-x-6 overflow-x-auto">
          {[1, 2, 3].map((j) => (
            <div key={j} className="w-48 h-64 bg-gray-200 rounded flex-shrink-0"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function Novel() {
  const router = useRouter();
  const { theme } = useTheme();
  const { data: viewCounts, error, isLoading } = useNovelViewCounts();

  const [categorizedNovels, setCategorizedNovels] = useState({
    รักหวานแหวว: [],
    ตลกขบขัน: [],
    สยองขวัญ: [],
    แฟนตาซี: [],
  });

  useEffect(() => {
    const categories = {
      รักหวานแหวว: [],
      ตลกขบขัน: [],
      สยองขวัญ: [],
      แฟนตาซี: [],
    };

    novels.forEach((novel) => {
      if (novel.genre in categories) {
        categories[novel.genre].push(novel);
      }
    });

    setCategorizedNovels(categories);
  }, []);

  const handleAddEpisodes = async (novelTitle) => {
    try {
      const episodes = stories[novelTitle];
      if (!episodes) {
        throw new Error(`No episodes found for novel: ${novelTitle}`);
      }

      const success = await addNovelEpisodes(novelTitle, episodes);
      if (success) {
        router.push(`/novel/${encodeURIComponent(novelTitle)}`);
      }
    } catch (error) {
      console.error(`Failed to add episodes for ${novelTitle}:`, error);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center p-6">
        <h2 className="text-xl font-bold mb-2">Error Loading Novels</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className={`max-w-7xl mx-auto p-6 bg-var-container rounded-lg shadow-lg transition-all ${
        theme === "dark" ? "shadow-black" : "shadow-gray-300"
      }`}
    >
      <h1 className="text-center text-4xl font-bold text-var-foreground mb-8 drop-shadow-xl">
        ยินดีต้อนรับ
      </h1>
      <p className="text-center text-lg text-var-muted mb-10">
        {recommendationText}
      </p>

      {Object.entries(categorizedNovels).map(([genre, novelList]) => (
        <GenreSection
          key={genre}
          genre={genre}
          novels={novelList}
          viewCounts={viewCounts || {}}
          onAddEpisodes={handleAddEpisodes}
        />
      ))}
    </div>
  );
}
