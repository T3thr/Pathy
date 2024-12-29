// app/api/novels/viewCount/route.js
import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

// Add response caching
const CACHE_CONTROL = 'public, s-maxage=10, stale-while-revalidate=59';

export async function GET() {
  try {
    await mongodbConnect();

    // Optimize query by selecting only needed fields
    const novels = await Novel.find({}, 'title viewCount')
      .lean()
      .select('-_id');
    
    const viewCounts = novels.reduce((acc, novel) => {
      acc[novel.title] = novel.viewCount;
      return acc;
    }, {});

    return new NextResponse(JSON.stringify(viewCounts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': CACHE_CONTROL
      }
    });
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
    
    const novel = await Novel.findOneAndUpdate(
      { title },
      { $inc: { viewCount: 1 } },
      { 
        new: true,
        upsert: true,
        select: 'title viewCount -_id'
      }
    );

    return new NextResponse(JSON.stringify({
      title: novel.title,
      viewCount: novel.viewCount
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    );
  }
}