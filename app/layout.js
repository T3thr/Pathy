import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/layouts/Header'


const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'PATHY',
  description: 'นิยายออนไลน์',
};

export default function RootLayout({ children }) {

  return (
    
    <html lang="en">
      <title>PATHY</title>
      <body className={inter.className}>
        <div className='xl:pt-18 md:pt-16 pt-20'>
          <Header />
        </div>
        <div className='xl:pt-3 md:pt-1 pt-1'>
          {children}
        </div>
      </body>
    </html>
  )
}