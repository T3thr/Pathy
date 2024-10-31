'use server';

import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { IoIosLogIn } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import SearchBar from './SearchBar';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';

function Wrapper({ children }) {
  return (
    <div className='hover:ring-1 hover:ring-blue-400 text-blue-600 rounded-sm py-2 px-3 m-2 text-center'>
      {children}
    </div>
  );
}

export default async function NavBar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 w-full flex flex-row bg-gray-200 p-0 shadow-gray-200 shadow-sm">
      <div className="container mx-auto flex flex-row items-center justify-center lg:justify-between">
        <div className="top-0 flex items-center">
            <Link href='/'>
                <h1 className="text-3xl font-bold text-blue-800">PATHY</h1>
            </Link>
        </div>

        <div className="hidden lg:flex space-x-4">
          <div className="top-0 md:flex lg:flex lg:space-x-4 lg:w-full md:w-auto align-middle">
            <Wrapper><Link href='/' className={`hidden lg:block`}>Home</Link></Wrapper>

            {user ? (
              <Wrapper><Link href='/api/auth/signout?callbackUrl=/' className={`hidden lg:flex items-center`}>
                <IoLogOut className='mr-2'/>Sign Out
              </Link></Wrapper>
            ) : (
              <>
                <Wrapper><Link href='/signin' className={`hidden lg:flex items-center`}>
                  <IoIosLogIn className='mr-2'/>Sign In
                </Link></Wrapper>
                <Wrapper><Link href='/signup' className={`hidden lg:flex items-center`}>
                  Sign Up
                </Link></Wrapper>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
