import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/layouts/Header'
import { GlobalProvider } from "./GlobalProvider"

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'PATHY',
  description: 'นิยายออนไลน์',
};

export default async function RootLayout({ children }) {

  return (
    
    <html lang="en">
      <title>PATHY</title>
      <body className={inter.className}>
      <GlobalProvider>
        <div className='xl:pt-16 md:pt-18 pt-32'>
          <Header />
        </div>
        
        <div className='xl:pt-16 md:pt-18 pt-32'>
          {children}
        </div></GlobalProvider>
      </body>
    </html>
  )
}