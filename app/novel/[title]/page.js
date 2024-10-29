'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { novels } from '@/data/novels'; // Adjust the path to where your novels.js file is located
import NovelDetail from '@/components/contents/NovelDetail'; // Adjust the path to your NovelDetail component

const NovelPage = () => {
  const params = useParams();
  const titleFromParams = decodeURIComponent(params.title.replace(/-/g, ' ')); // Decode URL-encoded title

  // Find the novel details using the title
  const novelDetails = novels.find(novel => novel.title === titleFromParams);

  return (
    <div>
      <NovelDetail novelDetails={novelDetails} />
    </div>
  );
};

export default NovelPage;
