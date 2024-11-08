// อิมพอร์ต options ออบเจ็กต์ ซึ่งใช้กำหนดรูปแบบการยืนยันตัวตน
import { options } from '@/app/api/auth/[...nextauth]/options'
// อิมพอร์ตฟังก์ชัน getServerSession เพื่อรับค่า session มาใช้งานในคอมโพเนนต์
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function SideBar(){
  const session = await getServerSession(options)


  return (
    <aside className="md:w-1/3 lg:w-1/4 px-4">
      <ul className="sidebar">
        {/* Check if user is authenticated and has admin role */}
        {session?.user?.role === 'admin' && (
          <>
            <li>
              <Link
                href="/admin/novel/addnovel"
                className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
              >
                Add Novel <span className="text-red-500">(Admin)</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/allnovel"
                className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
              >
                All Novel <span className="text-red-500">(Admin)</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/manage"
                className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
              >
                Manage Novel <span className="text-red-500">(Admin)</span>
              </Link>
            </li>
            <hr />
          </>
        )}

        {/* Regular user links */}
        <li>
          <Link
            href="/profile"
            className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
          >
            Your Profile
          </Link>
        </li>
        <li>
          <Link
            href="/History"
            className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
          >
            History
          </Link>
        </li>

        {/* Sign out */}
        {session && session.user && (
          <li>
            <Link 
              href={'api/auth/signout?callbackUrl=/profile'}
              className="block px-3 py-2 text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer"
            >
              Sign Out
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
};
