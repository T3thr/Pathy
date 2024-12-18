// app/novel-maker/layout.js
import TopToolbar from "@/components/novel-maker/TopToolbar";
import { GlobalProvider } from "../GlobalProvider";
import { ThemeProvider } from '@/context/Theme';
import ChangeTheme from '@/components/layouts/ChangeTheme';
import { cookies } from 'next/headers';

// This layout will be applied only to the `/novel-maker` page
export default function NovelMakerLayout({ children }) {
  const themeCookie = cookies().get('theme')?.value || 'light';
  return (
    <html lang="en" className={themeCookie === 'dark' ? 'dark' : 'light'}>
      <title>PATHY - Novel Maker</title>
      <body>

        {/* No Header component here */}
        <ThemeProvider initialTheme={themeCookie}>
        <GlobalProvider>

            {children}
        <ChangeTheme className='z-50' />
        </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
