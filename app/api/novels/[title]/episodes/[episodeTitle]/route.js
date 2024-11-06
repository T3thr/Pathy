import mongodbConnect from '@/backend/lib/mongodb';
import NovelEpisode from '@/backend/models/NovelEpisode';
import { NextResponse } from 'next/server'; // Import NextResponse for status handling

// Handle GET request to fetch episode details
export async function GET(req, { params }) {
  const { title, episodeTitle } = params;

  // Establish MongoDB connection
  await mongodbConnect();

  try {
    // Query MongoDB for the episode matching the title and episodeTitle
    const episode = await NovelEpisode.findOne({
      novelTitle: title,
      titles: episodeTitle,
    });

    if (!episode) {
      return NextResponse.json(
        { message: 'Episode not found' },
        { status: 404 }
      );
    }

    // Return episode data
    return NextResponse.json({ episode }, { status: 200 });
  } catch (error) {
    // Handle any errors
    return NextResponse.json(
      { message: 'Error fetching episode', error },
      { status: 500 }
    );
  }
}
