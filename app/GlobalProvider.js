"use client";

import { SessionProvider } from "next-auth/react";
import { NovelProvider } from '@/context/NovelContext';


export function GlobalProvider({ children }) {
  return (
    <>
      <NovelProvider>
      <SessionProvider>{children}</SessionProvider>
      </NovelProvider>
    </>
  );
}