"use client";

import { SessionProvider } from "next-auth/react";


import "react-toastify/dist/ReactToastify.css";

export function GlobalProvider({ children }) {
  return (
    <>

      <SessionProvider>{children}</SessionProvider>

    </>
  );
}