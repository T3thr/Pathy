import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function SideBar() {
  const session = await getServerSession(options)

  return (
    <aside className="md:w-1/3 lg:w-1/4 px-4 py-6 bg-var-container text-var-foreground rounded-lg shadow-light dark:bg-var-container dark:text-var-foreground">
      <ul className="space-y-4">
        {/* Check if user is authenticated and has admin role */}
        {session?.user?.role === 'admin' && (
          <>
            <li>
              <Link
                href="/novel-maker"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md transition duration-200 dark:text-gray-200 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                Add Novel <span className="text-red-500">(Admin)</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/allnovel"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md transition duration-200 dark:text-gray-200 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                All Novel <span className="text-red-500">(Admin)</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/manage"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md transition duration-200 dark:text-gray-200 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                Manage Novel <span className="text-red-500">(Admin)</span>
              </Link>
            </li>
            <hr className="border-t border-divider dark:border-divider" />
          </>
        )}

        {/* Regular user links */}
        <li>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md transition duration-200 dark:text-gray-200 dark:hover:bg-blue-600 dark:hover:text-white"
          >
            Your Profile
          </Link>
        </li>
        <li>
          <Link
            href="/History"
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md transition duration-200 dark:text-gray-200 dark:hover:bg-blue-600 dark:hover:text-white"
          >
            History
          </Link>
        </li>

        {/* Sign out */}
        {session && session.user && (
          <li>
            <Link
              href={'api/auth/signout?callbackUrl=/profile'}
              className="block px-4 py-2 text-sm text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer transition duration-200 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
            >
              Sign Out
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
}
