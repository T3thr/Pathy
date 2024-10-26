import Link from 'next/link'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'

// กำหนดคอมโพเนนต์เพื่อปรับแต่งหน้าตาแต่ละเมนู
function Wrapper({children}) {
  return (
    <div className='hover:ring-1 hover:ring-blue-400 text-blue-600 rounded-sm py-2 px-3 m-2 text-center'>
      {children}
    </div>
  )
}
// กำหนด NavBar คอมโพเนนต์
export default async function NavBar() {
  const session = await getServerSession(options)
  return (
    <div className='flex flex-row justify-center items-start mx-auto w-4/5 h-16 bg-gray-100'>
        <Wrapper><Link href='/'>Home</Link></Wrapper>
        <Wrapper><Link href='/profile'>Profile</Link></Wrapper>
        <Wrapper><Link href='/downloads'>Downloads</Link></Wrapper>
        {/* แสดงเมนู Sign Out เมื่อเข้าสู่ระบบแล้ว */}
        {session && <Wrapper><Link href='/api/auth/signout'>Sign Out</Link></Wrapper>}
        {/* แสดงเมนู Sign In เมื่อยังไม่ได้เข้าสู่ระบบ */}
        {!session && <Wrapper><Link href='/api/auth/signin'>Sign In</Link></Wrapper>}
    </div>
  )
}
