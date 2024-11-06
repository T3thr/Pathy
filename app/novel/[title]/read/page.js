// pages/novel/[title]/read/page.js
import React from 'react';
import ReadNovel from '@/components/contents/read/ReadNovel'; 

export default function ReadPage({ params }) {
  return <ReadNovel params={params} />;
}

