'use client'
import { useState } from 'react';
import Link from 'next/link';
import { FaUserAlt, FaBook, FaHome, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import SearchBar from './SearchBar';

export default function Menu({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-wrap max-h-4 items-center justify-between'>
      <div
        className="lg:hidden fixed top-3 left-4 right-4 flex items-center justify-between pointer-events-none"
        style={{ zIndex: 10 }} // Ensures this div stays in front of others
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 order-1 rounded-lg bg-[hsl(var(--primary))] text-white shadow-lg hover:bg-[hsl(var(--secondary))] transition-all duration-300 hover:scale-105 pointer-events-auto"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className="order-2 ml-auto pointer-events-auto"> 
          <SearchBar />
        </div>
      </div>

      <div className="hidden lg:block w-full bg-[var(--divider)] shadow-lg border-b border-[var(--divider)] lg:z-20 -pt-3 -pb-3">
        <div className="container mx-auto px-4 ">
          <div className="flex items-center justify-end space-x-4">
            <SearchBar className="" />
            
            {session ? (
              <Link href="/profile">
                <div className="flex items-center space-x-3 group p-2 rounded-xl hover:bg-[var(--background)] transition-all duration-300">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-[hsl(var(--primary))] group-hover:border-[hsl(var(--accent))] transition-all duration-300 transform group-hover:scale-110"
                    src={session.user.image || '/images/default.png'}
                    alt="Profile"
                  />
                  <div className="space-y-1">
                    <p className="font-medium text-[var(--foreground)]">{session.user.name}</p>
                    <p className="text-sm text-[var(--muted)]">{session.user.email}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/profile">
                <div className="p-3 rounded-full bg-[var(--background)] hover:bg-[hsl(var(--primary))] hover:text-white transition-all duration-300 transform hover:scale-110">
                  <FaUserAlt />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-[var(--background)] shadow-2xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out z-40`}>
        <div className="flex flex-col h-full">
          {session ? (
            <Link href="/profile" className="p-4 border-b border-[var(--divider)] hover:bg-[var(--container)] transition-all duration-300">
              <div className="flex items-center space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-[hsl(var(--primary))]"
                  src={session.user.image || '/images/default.png'}
                  alt="Profile"
                />
                <div>
                  <p className="font-medium text-[var(--foreground)]">{session.user.name}</p>
                  <p className="text-sm text-[var(--muted)]">{session.user.email}</p>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/signin" className="p-4 border-b border-[var(--divider)] hover:bg-[var(--container)] transition-all duration-300">
              <div className="flex items-center space-x-2">
                <FaSignInAlt className="text-[hsl(var(--primary))]" />
                <span>Sign In</span>
              </div>
            </Link>
          )}

          <nav className="flex-1 py-4">
            <Link href="/" className="flex items-center space-x-2 px-4 py-3 text-[var(--foreground)] hover:bg-[hsl(var(--primary))] hover:text-white transition-all duration-300">
              <FaHome />
              <span>Home</span>
            </Link>
            <Link href="/library" className="flex items-center space-x-2 px-4 py-3 text-[var(--foreground)] hover:bg-[hsl(var(--primary))] hover:text-white transition-all duration-300">
              <FaBook />
              <span>Library</span>
            </Link>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
