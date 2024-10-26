'use server'
import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'
import { FaHome } from 'react-icons/fa'
import { FaShoppingCart } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoIosLogIn } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import SearchBar from './SearchBar';

function Wrapper({ children }) {
  return (
    <div className='hover:ring-1 hover:ring-blue-400 text-blue-600 rounded-sm py-2 px-3 m-2 text-center'>
      {children}
    </div>
  );
}

export default async function NavBar() {
  const session = await getServerSession(options)

  return (
    <nav className=" fixed top-0 w-full flex flex-col lg:flex-row bg-gray-200 p-0 shadow-gray-200 shadow-sm">
      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:justify-between">
        {/* โลโก้ทางซ้าย */}
        <div className=" top-0 flex items-center ">
          <h1 className="hidden md:block text-3xl font-bold text-blue-800">PATHY</h1>
          <h1 className='block md:hidden text-3xl font-bold text-gray-800'>PATHY</h1>
        </div>


        
        {/* เมนูหลัก */}

          <div className=" md:flex lg:flex space-x-4">
          <div className="top-0 md:flex lg:flex lg:space-x-4 lg:w-full md:w-auto align-top ">

          <Wrapper><Link href='/' className={` hidden lg:block`}>Home</Link></Wrapper>
          
          {/* แสดงเมนู Sign Out เมื่อเข้าสู่ระบบแล้ว */}
          {session && <Wrapper><Link href='api/auth/signout?callbackUrl=/' className={`hidden lg:flex items-center`}>
            <IoLogOut className='mr-2'/>ออกจากระบบ
          </Link></Wrapper>}

          {/* แสดงเมนู Sign In เมื่อยังไม่ได้เข้าสู่ระบบ */}
          {!session && <Wrapper><Link href='/api/auth/signin' className={` hidden lg:flex items-center`}>
            <IoIosLogIn className='mr-2'/>เข้าสู่ระบบ
            </Link></Wrapper>}
          {!session && <Wrapper><Link href='/signup' className={` hidden lg:flex items-center`}>
            ลงทะเบียน
            </Link></Wrapper>}

        </div> 
        </div>
      </div>
    </nav>
  );
}