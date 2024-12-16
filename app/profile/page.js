// อิมพอร์ต options ออบเจ็กต์ ซึ่งใช้กำหนดรูปแบบการยืนยันตัวตน
import { options } from '@/app/api/auth/[...nextauth]/options'
// อิมพอร์ตฟังก์ชัน getServerSession เพื่อรับค่า session มาใช้งานในคอมโพเนนต์
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getServerSession(options)

  // ตรวจสอบว่าได้เข้าสู่ระบบแล้ว และมีข้อมูลผู้ใช้ 
  if(session && session.user) {
    return (
      <div className="flex flex-col items-center mx-auto h-auto my-10 gap-8 px-6">
        {/* Profile Image */}
        <img
          className="w-32 h-32 border-4 border-white shadow-xl rounded-full"
          src={'/images/default.png'}
          alt="User Profile"
        />
        {/* User Name */}
        <div className="text-3xl font-semibold text-center text-var-foreground dark:text-white">
          {session.user?.name}
        </div>
        {/* User Email */}
        <div className="text-xl text-center text-var-muted dark:text-white/70">
          {session.user?.email}
        </div>

        {/* Add more profile-related info here */}
        <div className="mt-6 text-lg text-var-muted dark:text-white/60">สวัสดีจ้า!</div>

        {/* Optional Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 w-full lg:w-1/2">
          <Link
            href="/profile/settings"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition-all duration-300 text-center"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center mx-auto h-screen my-10 px-4">
      <div className="text-3xl font-semibold text-center text-var-foreground dark:text-white">
        Please Sign In
      </div>
      <Link
        href={'/signin?callbackUrl=/profile'}
        className="mt-6 ring-blue-400 ring-1 text-blue-500 rounded-sm shadow-sm py-2 px-6 transition-all duration-300"
      >
        Sign In
      </Link>
    </div>
  )
}
