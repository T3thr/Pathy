'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimesCircle } from "react-icons/fa";

export default function SearchBar() {
    const [keyword, setKeyword] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isDimmed, setIsDimmed] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false); 
    const router = useRouter();

    const clearHistoryBtnRef = useRef(null);
    const searchBarRef = useRef(null);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(savedHistory);

        if (isSearchVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSearchVisible]);

    const submitHandler = (e) => {
        e.preventDefault(); 
    
        if (keyword) {
            const updatedHistory = [keyword, ...searchHistory.filter(item => item !== keyword)];
            setSearchHistory(updatedHistory);
            localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
            // Open the new URL in a new tab
            const searchUrl = `/search/novel/${encodeURIComponent(keyword)}`;
            window.open(searchUrl, '_blank');
        } 
    };
    

    const handleHistoryItemClick = (item) => {
        setKeyword(item);
    };

    const handleClearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
        setIsDimmed((prev) => !prev);
        setShowHistory(false); // Reset history display when toggling
    };

    const handleClickOutside = (e) => {
        if (
            searchBarRef.current && !searchBarRef.current.contains(e.target) &&
            clearHistoryBtnRef.current && !clearHistoryBtnRef.current.contains(e.target) &&
            isSearchVisible
        ) {
            toggleSearch();
        }
    };

    useEffect(() => {
        if (isSearchVisible) {
            document.addEventListener('click', handleClickOutside);
            setTimeout(() => setShowHistory(true),50); // Delay for search history to show after search bar transition
        } else {
            document.removeEventListener('click', handleClickOutside);
            setShowHistory(false); // Hide history when search bar is closed
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSearchVisible]);

    const handleCloseButtonClick = (e) => {
        e.preventDefault();  
        e.stopPropagation(); 

        setKeyword(''); 
        toggleSearch(); 
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitHandler(e); 
        }
    };

    return (
        <div className="relative">
            {/* Search icon to toggle search bar */}
            <div className="flex justify-center w-full text-blue-800">
                <div onClick={toggleSearch} className="cursor-pointer p-2 rounded-full border bg-indigo-200 hover:bg-indigo-300 transition-colors">
                    <FaSearch size={24} />
                </div>
            </div>

            {/* Dimmed background when search bar is visible */}
            {isDimmed && (
                <div className="fixed inset-0 bg-black opacity-40 z-40" onClick={toggleSearch}></div>
            )}

            {/* Search bar container, including history */}
            <form
                ref={searchBarRef}
                className={`search-bar fixed top-0 h-16 w-screen left-1/2 transform -translate-x-1/2 px-4 py-3 bg-white shadow-lg rounded-lg z-50 transition-all duration-300 ease-in-out ${isSearchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-100%]'}`}
                onSubmit={submitHandler}
                style={{
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                }}
            >
                <div className="flex justify-center items-center w-full  space-x-4">

                    <div className='relative '>
                                            {/* Search button locked to the left side of the search bar */}
                    <button
                        type="submit"
                        className="absolute top-2 mt-4  left-56 transform -translate-y-1/2 px-4 py-3 text-white bg-indigo-600 rounded-e-3xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    >
                        ค้นหา
                    </button>
                    {/* Search input */}
                    <input
                        className="flex border w-72 mb-4 h-12  text-gray-900 border-gray-300 bg-gray-50 rounded-full py-2 px-2 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        type="text"
                        placeholder="ค้นหานิยาย..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyPress} // Handle Enter key press
                    />

                    </div>

                    {/* Close button moved to the left side of the search input */}
                    <button
                        onClick={handleCloseButtonClick}  // Handle close button click separately
                        className="mt-4 transform -translate-y-1/2 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-indigo-100 transition-colors"
                    >
                        <FaTimesCircle size={24} />
                    </button>

                </div>

            {/* Search history container, positioned below the search bar */}
            {isSearchVisible && (
                <div
                    className={`z-40 absolute transition-opacity duration-700 ease-in-out ${showHistory ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        top: '3.7rem', 
                        left: '50%', // Center horizontally
                        transform: 'translateX(-59%)', // Adjust to ensure it's centered
                        width: 'calc(100% - 6rem)', 
                        maxWidth: '265px', 
                        transitionDelay: '200ms',
                    }}
                >
                    {searchHistory.length > 0 && (
                        <div className="bg-gray-100 p-4 rounded-b-lg shadow-md w-full"> 
                            <h3 className="text-sm font-semibold text-gray-700">Search History</h3>
                            <ul className="mt-2 space-y-2">
                                {searchHistory.map((item, index) => (
                                    <li
                                        key={index}
                                        className="text-sm cursor-pointer text-indigo-600 hover:text-indigo-800"
                                        onClick={() => handleHistoryItemClick(item)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                ref={clearHistoryBtnRef}
                                className="text-xs mt-2 text-red-500"
                                onClick={handleClearHistory}
                            >
                                Clear History
                            </button>
                        </div>
                    )}
                </div>
            )}

            </form>
        </div>
    );
}
