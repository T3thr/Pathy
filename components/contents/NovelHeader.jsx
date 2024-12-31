// components/NovelHeader.jsx
import React from "react";
import Image from "next/image";

export const genreGradients = {
  รักหวานแหวว: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 shadow-pink-400",
  ตลกขบขัน: "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 shadow-yellow-400",
  สยองขวัญ: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-blue-400",
  แฟนตาซี: "bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 shadow-purple-400",
};

// Novel Card Component
export const NovelCard = ({ novel, viewCount, onCardClick }) => (
  <div
    className="flex flex-col w-48 justify-between bg-var-container shadow-var-light rounded-lg overflow-hidden transform transition-transform hover:shadow-lg cursor-pointer"
    onClick={() => onCardClick(novel.title)}
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
export const GenreSection = ({ genre, novels, viewCounts, onCardClick }) => (
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
            onCardClick={onCardClick}
          />
        ))
      ) : (
        <p className="text-var-muted text-sm">ไม่มีนิยายในหมวดหมู่นี้</p>
      )}
    </div>
  </div>
);
