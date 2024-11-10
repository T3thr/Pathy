// app/api/novels/[title]/view/route.js
import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

export async function POST(req, { params }) {
  const { title } = params; // Get the novel's title from the URL params

  try {
    await mongodbConnect(); // Ensure we're connected to MongoDB

    const requestBody = await req.json(); // Get the request body
    const { genre, author, description, imageUrl } = requestBody;

    // Check if the novel already exists
    const existingNovel = await Novel.findOne({ title });

    if (existingNovel) {
      // Increment the view count by 1 for existing novel
      existingNovel.viewCount += 1;
      await existingNovel.save(); // Save the updated novel
      return NextResponse.json({ viewCount: existingNovel.viewCount }, { status: 200 });
    } else {
      // Create a new novel document if it doesn't exist
      const newNovel = new Novel({
        title,
        genre,
        author,
        description,
        imageUrl,
        viewCount: 1 // Initialize view count to 1
      });
      await newNovel.save(); // Save the new novel
      return NextResponse.json({ viewCount: newNovel.viewCount }, { status: 201 });
    }
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json({ message: 'Error updating view count', error }, { status: 500 });
  }
}
