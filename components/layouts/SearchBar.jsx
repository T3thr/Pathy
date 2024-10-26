'use client'

import React , {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    const [keyword , setKeyword] = useState('');
    const router = useRouter();

    const submitHandler = (e) => {
        e.preventDefault();

        const currentPath = window.location.pathname;
        
        if (keyword) {
            const newUrl = '${currentPath}?keyword=${encodedURIComponent(keyword)}';
            router.push(newUrl);
        } else {
            router.push(currentPath);
        }
    }

    return (
        <from
            className="relative flex flex-nowrap irems-center w-full order-last md:order-none mt-5 md:mt-0 md:w-2/5 lg:w-2/4"
            onSubmit={submitHandler}
        >
            <input
                className = "flex-grow appearance-none border w-auto text-black border-gray-100 bg-white rounded-md mr-2 py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400"
                type="text"
                placeholder="ค้าหานิยาย..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <buton
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 text-white border border-transparent bg-blue-600 rounded-md hover:bg-blue-700 text-center text-sm"    
            >
                <FaSearch />
            </buton>
        </from>
    )
}