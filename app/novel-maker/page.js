// app/novel-maker/page.js
'use client';
import { useSession } from 'next-auth/react';
import NovelMakerLayout from '@/components/novel-maker/NovelMakerLayout';


export default function NovelMakerPage() {
    const { data: session, status } = useSession();

    if (!session || session.user.role !== 'admin') {
        return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='text-xl text-red-600'>Access Denied, Addmin Only!!</div>
        </div>
    )}
    return (
        <div>
            {/* Render the NovelMakerLayout component to display the UI */}
            <NovelMakerLayout />
        </div>
    );
}