// app/novel-maker/page.js
'use client';
import { useSession } from 'next-auth/react';
import NovelMakerLayout from '@/components/novel-maker/NovelMakerLayout';
import Loading from '@/app/loading'

export default function NovelMakerPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <Loading/>
    }


    return (
        <div>
            {/* Render the NovelMakerLayout component to display the UI */}
            <NovelMakerLayout />
        </div>
    );
}