import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

// Update viewCount for a specific novel
export async function POST(request) {
  try {
    // Connect to MongoDB
    await mongodbConnect();

    // Parse the request body
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    // Find the novel by title and increment the viewCount
    const updatedNovel = await Novel.findOneAndUpdate(
      { title },
      { $inc: { viewCount: 1 } },
      { new: true, upsert: false } // Return the updated document; do not create if missing
    );

    if (!updatedNovel) {
      return NextResponse.json(
        { message: `Novel with title "${title}" not found` },
        { status: 404 }
      );
    }

    // Return the updated viewCount
    return NextResponse.json(
      { title: updatedNovel.title, viewCount: updatedNovel.viewCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { 
        message: 'Error updating view count', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Fetch view counts for all novels (existing GET functionality)
export async function GET() {
  try {
    await mongodbConnect();

    const novels = await Novel.find({}, 'title viewCount');
    
    const viewCounts = novels.reduce((acc, novel) => {
      acc[novel.title] = novel.viewCount;
      return acc;
    }, {});

    return NextResponse.json(viewCounts, { status: 200 });
  } catch (error) {
    console.error('Error fetching view counts:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching view counts', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
