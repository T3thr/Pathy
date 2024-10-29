"use client";

import { SessionProvider } from "next-auth/react";
import { NovelProvider } from '@/context/NovelContext';
import { AuthProvider } from "@/context/AuthContext";

export function GlobalProvider({ children }) {
  return (
    <>
      <NovelProvider>
      <AuthProvider>
      <SessionProvider>{children}</SessionProvider>
      </AuthProvider>
      </NovelProvider>
    </>
  );
}