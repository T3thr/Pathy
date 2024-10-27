import React from 'react';
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'
import NavBar from './NavBar';
import Menu from './Menu'
import { GlobalProvider } from "@/app/GlobalProvider";

export default async function Header() {
  const session = await getServerSession(options)

  return (
    <GlobalProvider>
    <header className='fixed top-0 w-full flex flex-col lg:flex-row p-0 bg-white py-0 border-b z-50'>

    <div className='top-0 flex '>   
    <NavBar />
    </div>
    <div  className="  w-full flex lg:flex-row shadow-gray-200 shadow-sm bg-gray-200 z-50"
        style={{ marginTop: '2.5rem' }}
  >
    <Menu/>
    </div>
    </header></GlobalProvider>

  );
};