import { getServerSession } from 'next-auth/next'
import { options } from '@/app/api/auth/[...nextauth]/options'
import NavBar from './NavBar'
import Menu from './Menu'
import { GlobalProvider } from "@/app/GlobalProvider"

export default async function Header() {
  const session = await getServerSession(options)

  return (
    <GlobalProvider>
      <header className="fixed top-0 left-0 right-0 z-50 -space-y-5">
        <NavBar />
        <Menu session={session} />
      </header>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="lg:max-h-20 h-6 lg:mt-14 md:mt-[4.4rem] mt-10" />
    </GlobalProvider>
  );
}
