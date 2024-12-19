// app/api/novels/viewCount/route.js
import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

export async function GET() {
  try {
    await mongodbConnect();

    const novels = await Novel.find({}, 'title viewCount');
    
    const viewCounts = novels.reduce((acc, novel) => {
      acc[novel.title] = novel.viewCount ;
      return acc;
    }, {});

    return NextResponse.json(viewCounts);
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