// app/api/novels/viewCounts/route.js
import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

export async function GET() {
  try {
    await mongodbConnect();
    const novels = await Novel.find({}, { title: 1, viewCount: 1 });
    const viewCounts = novels.reduce((acc, novel) => {
      acc[novel.title] = novel.viewCount;
      return acc;
    }, {});

    return NextResponse.json(viewCounts, { status: 200 });
  } catch (error) {
    console.error('Error fetching view counts:', error);
    return NextResponse.json({ message: 'Error fetching view counts', error }, { status: 500 });
  }
}
