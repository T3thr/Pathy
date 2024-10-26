import './globals.css'
import { Inter } from 'next/font/google'
import mongodbConnect from '@/backend/lib/mongodb'
import NavBar from '@/components/layouts/NavBar'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'PATHY',
  description: 'นิยายออนไลน์',
};

export default async function RootLayout({ children }) {
  await mongodbConnect()

  return (
    
    <html lang="en">
      <title>PATHY</title>
      <body className={inter.className}>
        <div className='xl:pt-16 md:pt-18 pt-32'>
          <NavBar />
        </div>
        <div className='xl:pt-16 md:pt-18 pt-32'>
          {children}
        </div>
      </body>
    </html>
  )
}