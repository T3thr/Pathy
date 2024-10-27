'use client'
import React, { useEffect, useState , useContext } from 'react';
import { useSession } from "next-auth/react"
import Link from 'next/link';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { FaShoppingCart } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import AuthContext from "@/context/AuthContext";

// ฟังก์ชันนับตะกร้า
const countCartItems = (cart) => {
  return cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
};


export default function Menu() {

    return (
      <div className='container max-w-screen-xl w-full mx-auto px-4 lg:justify-between bg-gray-200'>
        <div className='flex flex-wrap items-center'>
          <div className='flex-shrink-0 mr-auto ml-auto mx-auto lg:mx-16 mb-4 lg:mb-0'>

          </div>
          
          <SearchBar />

          <div className='flex items-center space-x-16 ml-auto justify-start mx-auto'>

            {/* Sign In/Out Logic */}
            {/* Profile Display */}

          </div>

          <div className='md:hidden sm:flex flex-wrap items-center  ml-2 justify-end md:w-full mx-auto'>
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
    );
}
