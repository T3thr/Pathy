// app/api/novels/[title]/episodes/[episodeTitle]/route.js
import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import NovelEpisode from '@/backend/models/NovelEpisode';

export async function GET(req, { params }) {
  const { title, episodeTitle } = params; // Get the novel's title and episode title from the URL params

  try {
    await mongodbConnect(); // Ensure we're connected to MongoDB

    // Find the specific episode by novelTitle and episodeTitle
    const episode = await NovelEpisode.findOne({ novelTitle: title, title: episodeTitle });
    if (episode) {
      return NextResponse.json(episode, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Episode not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching episode:', error);
    return NextResponse.json({ message: 'Error fetching episode', error }, { status: 500 });
  }
}
