// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layouts/Header';
import mongodbConnect from '@/backend/lib/mongodb';
import { GlobalProvider } from './GlobalProvider';
import { ThemeProvider } from '@/context/Theme';
import ChangeTheme from '@/components/layouts/ChangeTheme';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PATHY',
  description: 'นิยายออนไลน์',
};

export default async function RootLayout({ children }) {
  await mongodbConnect();

  // Read the theme preference from cookies
  const themeCookie = cookies().get('theme')?.value || 'light';

  return (
    <html lang="en" className={themeCookie === 'dark' ? 'dark' : 'light'}>
      <head>
        <title>PATHY</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider initialTheme={themeCookie}>
          <div className="xl:pt-18 md:pt-17 pt-20">
            <Header />
          </div>
          <GlobalProvider>
            <div className="xl:pt-3 md:pt-2 pt-1">{children}</div>
            <ChangeTheme />
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
