// app/api/novels/[title]/viewCount/route.js
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

export async function GET(req, { params }) {
  const { title } = params; // Get the novel's title from the URL params

  try {
    await mongodbConnect(); // Ensure we're connected to MongoDB

    // Find the novel by title and retrieve the viewCount
    const novel = await Novel.findOne({ title });

    // If the novel was not found, return an error
    if (!novel) {
      return new Response(JSON.stringify({ message: 'Novel not found' }), { status: 404 });
    }

    // Return the viewCount in the response
    return new Response(JSON.stringify({ viewCount: novel.viewCount }), { status: 200 });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return new Response(JSON.stringify({ message: 'Error fetching view count', error }), { status: 500 });
  }
}
