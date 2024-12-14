// อิมพอร์ต options ออบเจ็กต์ ซึ่งใช้กำหนดรูปแบบการยืนยันตัวตน
import { options } from '@/app/api/auth/[...nextauth]/options'
// อิมพอร์ตฟังก์ชัน getServerSession เพื่อรับค่า session มาใช้งานในคอมโพเนนต์
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function NavBar() {
  const session = await getServerSession(options)

  // ตรวจสอบว่าได้เข้าสู่ระบบแล้ว และมีข้อมูลผู้ใช้ 
  if(session && session.user) {
    return (
        <div className='flex flex-col items-center mx-auto h-screen my-5 gap-6 px-4'>
            <img
              className='w-24 h-24 border shadow-md rounded-full'
              src={'/images/default.png'}
            />
            <div className='text-3xl font-semibold text-center text-var-foreground'>
              {session.user?.name}
            </div>
            <div className='text-2xl text-center text-var-muted'>
              {session.user?.email}
            </div>

            {/* Add more profile-related info here */}
            <div className="mt-4 text-lg text-var-muted">สวัสดีจ้า</div>

        </div>
    )
  }

  // กำหนดปุ่ม Sign In เมื่อยังไม่ได้เข้าสู่ระบบ
  return (
    <div className='flex flex-col justify-center items-center mx-auto h-screen my-5 px-4'>
        <div className='text-3xl font-semibold text-center text-var-foreground'>
          Please Sign In!!!
        </div>
        <Link 
          href={'/signin?callbackUrl=/profile'}
          className='mt-4 ring-blue-400 ring-1 text-blue-500 rounded-sm shadow-sm py-2 px-4 transition-all duration-300'
        >
            Sign In
        </Link>
    </div>
  )
}
