// components/contents/SearchNovel.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { novels } from '@/data/novels';
import styles from './SearchNovel.module.css';
import { useNovelViewCounts } from '@/backend/lib/novelAction';
import { genreGradients } from './Novel'; // Import genre gradients for consistent styling

export default function SearchNovel() {
    const { keyword } = useParams();
    const [filteredNovels, setFilteredNovels] = useState({});
    const { data: viewCounts, error } = useNovelViewCounts();

    useEffect(() => {
        if (keyword) {
            // Filter novels that include the keyword in the title or genre and categorize them
            const newFilteredNovels = novels.reduce((acc, novel) => {
                if (novel.title.includes(decodeURIComponent(keyword)) || novel.genre.includes(decodeURIComponent(keyword))) {
                    if (!acc[novel.genre]) acc[novel.genre] = [];
                    acc[novel.genre].push(novel);
                }
                return acc;
            }, {});
            setFilteredNovels(newFilteredNovels);
        }
    }, [keyword]);

    if (error) return <p>404</p>;
    if (!viewCounts) return null;

    return (
        <div className={styles.searchContainer}>
            <h2 className={styles.searchTitle}>ผลการค้นหาสำหรับ "{decodeURIComponent(keyword)}"</h2>
            {Object.keys(filteredNovels).length > 0 ? (
                Object.entries(filteredNovels).map(([genre, novels]) => (
                    <div className={styles.genreSection} key={genre}>
                        <div className={styles.genreHeader} style={{ background: genreGradients[genre] }}>
                            {genre}
                        </div>
                        <div className={styles.resultsGrid}>
                            {novels.map(novel => (
                                <a
                                    key={novel.title}
                                    href={`/novel/${encodeURIComponent(novel.title)}`}
                                    className={styles.novelCard}
                                    aria-label={`Read ${novel.title}`}
                                >
                                    <img src={novel.imageUrl} alt={novel.title} className={styles.novelImage} />
                                    <div className={styles.novelInfo}>
                                        <h3 className={styles.novelTitle}>{novel.title}</h3>
                                        <p className={styles.novelGenre}>{novel.genre}</p>
                                        <p className={styles.viewCount}>Views: {viewCounts[novel.title] || 0}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noResults}>ไม่พบผลลัพธ์สำหรับ "{decodeURIComponent(keyword)}"</p> 
            )}
        </div>
    );
}
