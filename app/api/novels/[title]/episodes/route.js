// app/api/novels/[title]/episodes/route.js
import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import NovelEpisode from '@/backend/models/NovelEpisode';

export async function POST(req, { params }) {
  const { title } = params; // Get the novel's title from the URL params
  try {
    await mongodbConnect(); // Ensure we're connected to MongoDB

    const episodeData = await req.json(); // Get the request body (episode data)
    const { episodes } = episodeData; // Expecting an array of episodes

    // Loop through episodes and save each one
    for (const episode of episodes) {
      const { title: episodeTitle, content, choices } = episode;

      // Check if the episode already exists for this novel
      const existingEpisode = await NovelEpisode.findOne({ novelTitle: title, title: episodeTitle });

      if (!existingEpisode) {
        // If episode doesn't exist, create a new one
        const newEpisode = new NovelEpisode({
          novelTitle: title,
          title: episodeTitle,
          content,
          choices,
        });
        await newEpisode.save(); // Save the new episode
      }
    }

    return NextResponse.json({ message: 'Episodes added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding episodes:', error);
    return NextResponse.json({ message: 'Error adding episodes', error }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { title } = params; // Get the novel's title from the URL params
  try {
    await mongodbConnect(); // Ensure we're connected to MongoDB

    const episodes = await NovelEpisode.find({ novelTitle: title }); // Fetch all episodes for the novel

    return NextResponse.json({ episodes });
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json({ message: 'Error fetching episodes', error }, { status: 500 });
  }
}