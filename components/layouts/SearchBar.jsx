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

            {isSearchVisible && (
                <form
                    className={`fixed top-0 left-0 right-0 p-1 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${isSearchVisible ? 'translate-y-0' : '-translate-y-full'}`}
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
                            className="px-4 py-2 text-white border border-transparent bg-blue-600 rounded-md hover:bg-blue-700 text-center text-sm"
                        >
                            ค้นหา
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
