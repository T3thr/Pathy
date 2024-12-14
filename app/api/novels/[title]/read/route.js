import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

export async function POST(req: Request, { params }: { params: { title: string } }) {
  const { title } = params;

  try {
    await mongodbConnect();

    const { episodeIndex } = await req.json(); // Get the episodeIndex from the request body

    // Optionally update view count for the specific episode if it's stored in the document
    const updatedNovel = await Novel.findOneAndUpdate(
      { title },
      {
        $inc: { viewCount: 1, [`episodes.${episodeIndex}.viewCount`]: 1 }, // Increment both novel and episode view count
      },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    return NextResponse.json(
      { 
        viewCount: updatedNovel.viewCount,
        message: 'View count updated successfully for the novel and episode' 
      }, 
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
