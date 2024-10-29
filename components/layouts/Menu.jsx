'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import AuthContext from '@/context/AuthContext';
import SearchBar from './SearchBar';
import { FaUserAlt } from "react-icons/fa";

export default function Menu() {
    const { user } = useContext(AuthContext);
    const { data: session } = useSession();

    return (
        <div className='container max-w-screen-xl w-full mx-auto px-4 bg-gray-200'>
            <div className='flex flex-wrap items-center justify-between'>
                <div className='flex-shrink-0 mr-auto lg:mx-16 mb-2 lg:mb-0'>
                    {/* Logo or Brand Name can go here */}
                </div>
                
                <div className='flex items-center ml-auto space-x-4 mb-1'>
                    {/* Circular frame around SearchBar */}
                    <div className='flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-300 rounded-full'>
                        <SearchBar className="mb-[-2px]" />
                    </div>

                    {/* Show button only when not authenticated */}
                    {!session?.user ? (
                        <div className='md:hidden sm:flex'>
                            <button
                                type='button'
                                onClick={() => window.location.href = '/signin'} 
                                className='bg-white p-3 items-center rounded-full text-black hover:bg-gray-300 hover:text-gray-800'
                            >
                                <span className='sr-only'>User</span>
                                <FaUserAlt />
                            </button>
                        </div>
                    ) : (
                        // Show Profile Display when authenticated
                        <Link href='/profile'>
                            <div className='flex items-center space-x-3 cursor-pointer'>
                                <img
                                    className='w-10 h-10 border-md shadow-md rounded-full'
                                    src={'/images/default.png'}
                                />
                                <div className='space-y-1 font-medium'>
                                    <p>
                                        {user ? user.name : 'GUEST'}
                                        <time className='block text-sm text-gray-500 dark:text-gray-400'>
                                            {user?.email}
                                        </time>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
