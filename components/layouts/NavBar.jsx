'use server'
import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'
import { IoIosLogIn } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

function NavLink({ href, children }) {
  return (
    <Link href={href}>
      <div className="relative group px-4 py-2 -top-3">
        <span className="relative z-10 text-[hsl(var(--primary))] group-hover:text-[hsl(var(--secondary))] transition-all duration-300">
          {children}
        </span>
        <div className="absolute inset-0 h-1 bg-[hsl(var(--accent))] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bottom-0 rounded-full shadow-lg opacity-75"></div>
      </div>
    </Link>
  );
}

export default async function NavBar() {
  const session = await getServerSession(options)

  return (
    <nav className="w-full bg-[var(--divider)] border-b border-[var(--divider)] backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 z-50">
          {/* Left side (logo) */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start z-50">
            <Link href='/'>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 z-50">
                PATHY
              </h1>
            </Link>
          </div>

          {/* Right side (nav links) */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavLink href="/">Home</NavLink>
            {session ? (
              <NavLink href="api/auth/signout?callbackUrl=/">
                <span className="flex items-center space-x-2 hover:scale-105 transition-transform">
                  <IoLogOut className="text-[hsl(var(--destructive))]" />
                  <span>ออกจากระบบ</span>
                </span>
              </NavLink>
            ) : (
              <>
                <NavLink href="/signin">
                  <span className="flex items-center space-x-2 hover:scale-105 transition-transform">
                    <IoIosLogIn className="text-[hsl(var(--primary))]" />
                    <span>เข้าสู่ระบบ</span>
                  </span>
                </NavLink>
                <NavLink href="/signup">
                  <span className="relative inline-flex items-center px-6 py-2 overflow-hidden font-medium transition-all bg-[hsl(var(--primary))] rounded-lg hover:bg-[hsl(var(--secondary))] text-white">
                    ลงทะเบียน
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform rotate-12 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  </span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
