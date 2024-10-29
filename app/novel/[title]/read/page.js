// novel/[title]/read/page.js
import React from 'react';
import ReadNovel from '@/components/contents/read/ReadNovel'; // Adjust the import path as necessary
import { novels } from '@/data/novels'; // Import the novels data

export default function ReadPage({ params }) {
  // Decode the title from the URL
  const title = decodeURIComponent(params.title);
  
  // Find the corresponding novel details based on the title
  const novelDetails = novels.find(novel => novel.title === title);

  // Mock content for the novel; you can replace this with actual content
  const content = novelDetails ? `นี่คือเรื่อง ${novelDetails.title}.` : 'Novel not found.';

  return (
    <ReadNovel title={title} content={content} />
  );
}
