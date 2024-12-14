// context/NovelContext.js
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const NovelContext = createContext();

export const NovelProvider = ({ children }) => {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    const storedNovels = localStorage.getItem('categorizedNovels');
    if (storedNovels) {
      setNovels(JSON.parse(storedNovels)); // Parse and set the novels from localStorage
    }
  }, []);

  return (
    <NovelContext.Provider value={{ novels, setNovels }}>
      {children}
    </NovelContext.Provider>
  );
};

export const useNovels = () => {
  const context = useContext(NovelContext);
  if (!context) {
    throw new Error('useNovels must be used within a NovelProvider');
  }
  return context;
};
