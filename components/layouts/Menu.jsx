'use client'
import React from 'react';
import SearchBar from './SearchBar';
import { IoIosMenu } from "react-icons/io";

export default function Menu() {
    return (
        <div className='container max-w-screen-xl w-full mx-auto px-4 bg-gray-200'>
            <div className='flex flex-wrap items-center justify-between'>
                <div className='flex-shrink-0 mr-auto lg:mx-16 mb-4 lg:mb-0'>
                    {/* Logo or Brand Name can go here */}
                </div>
                
                {/* Wrap SearchBar and Menu Button in a flex container */}
                <div className='flex items-center ml-auto space-x-4'>
                    <SearchBar />
                    <div className='md:hidden sm:flex'>
                        <button
                            type='button'
                            onClick={() => window.location.href = '/profile'} 
                            className='bg-white p-3 inline-flex items-center rounded-md text-black hover:bg-gray-200 hover:text-gray-800 border border-transparent'
                        >
                            <span className='sr-only'>Open menu</span>
                            <IoIosMenu />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
