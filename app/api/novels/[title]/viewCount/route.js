// app/api/novels/viewCounts/route.js
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

export async function GET(req) {
  try {
    await mongodbConnect();

    // Retrieve only titles and viewCounts for all novels
    const novels = await Novel.find({}, 'title viewCount');
    const viewCounts = {};

    novels.forEach(novel => {
      viewCounts[novel.title] = novel.viewCount;
    });

    return new Response(JSON.stringify(viewCounts), { status: 200 });
  } catch (error) {
    console.error('Error fetching view counts:', error);
    return new Response(JSON.stringify({ message: 'Error fetching view counts', error }), { status: 500 });
  }
}
