'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    const [keyword, setKeyword] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isDimmed, setIsDimmed] = useState(false);
    const router = useRouter();

    const submitHandler = (e) => {
        e.preventDefault();
        const currentPath = window.location.pathname;

        if (keyword) {
            const newUrl = `${currentPath}?keyword=${encodeURIComponent(keyword)}`;
            router.push(newUrl);
        } else {
            router.push(currentPath);
        }
    };

    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
        setIsDimmed((prev) => !prev);
    };

    return (
        <div>
            <div className="relative flex items-center w-full mt-1 text-blue-800">
                <div onClick={toggleSearch} className="cursor-pointer">
                    <FaSearch size={24} />
                </div>
            </div>

            {isDimmed && (
                <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggleSearch}></div>
            )}

            <form
                className={`fixed top-0 left-0 right-0 p-1 bg-white shadow-lg z-50 transition-opacity duration-300 ease-in-out transform ${
                    isSearchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
                }`}
                style={{
                    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                    height: isSearchVisible ? '50px' : '0px', // Set height for visible and hidden states
                    overflow: 'hidden', // Hide overflow when not visible
                }}
                onSubmit={submitHandler}
            >
                <div className="flex items-center w-full">
                    <input
                        className="flex-grow appearance-none border w-full text-black border-gray-100 bg-white rounded-md mr-2 py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400"
                        type="text"
                        placeholder="ค้าหานิยาย..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-2 text-white border border-transparent bg-blue-600 rounded-md hover:bg-blue-700 text-center text-sm"
                    >
                        ค้นหา
                    </button>
                </div>
            </form>
        </div>
    );
}
