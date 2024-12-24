import mongodbConnect from '@/backend/lib/mongodb';
import NovelEpisode from '@/backend/models/NovelEpisode';
import { NextResponse } from 'next/server'; 

export async function GET(req, { params }) {
  const { title, episodeTitle } = params;

  await mongodbConnect();

  try {

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

    return NextResponse.json({ episode }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching episode', error },
      { status: 500 }
    );
  }
}
