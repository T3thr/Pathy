// app/api/novels/viewCount/route.js
import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

// Initialize cache
let viewCountCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function updateCache() {
  await mongodbConnect();
  const novels = await Novel.find({}, 'title viewCount');
  viewCountCache = novels.reduce((acc, novel) => {
    acc[novel.title] = novel.viewCount;
    return acc;
  }, {});
  lastCacheUpdate = Date.now();
}

export async function GET() {
  try {
    // Return cached data if available and fresh
    if (viewCountCache && Date.now() - lastCacheUpdate < CACHE_DURATION) {
      return NextResponse.json(viewCountCache);
    }

    await updateCache();
    return NextResponse.json(viewCountCache);
  } catch (error) {
    console.error('Error fetching view counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch view counts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await mongodbConnect();
    const { title } = await request.json();
    
    // Update cache optimistically
    if (viewCountCache) {
      viewCountCache[title] = (viewCountCache[title] || 0) + 1;
    }
    
    // Update database
    const novel = await Novel.findOneAndUpdate(
      { title },
      { $inc: { viewCount: 1 } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      title: novel.title, 
      viewCount: novel.viewCount 
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    );
  }
}