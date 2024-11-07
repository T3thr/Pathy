// app/api/novels/viewCounts/route.js
import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';

export async function GET() {
  try {
    await mongodbConnect();
    
    // Fetch all novels with only the title and viewCount fields
    const novels = await Novel.find({}, 'title viewCount');
    
    // Map the data to a format suitable for the frontend
    const viewCounts = novels.reduce((acc, novel) => {
      acc[novel.title] = novel.viewCount;
      return acc;
    }, {});

    return new Response(JSON.stringify(viewCounts), { status: 200 });
  } catch (error) {
    console.error('Error fetching view counts:', error);
    return new Response(JSON.stringify({ message: 'Error fetching view counts', error }), { status: 500 });
  }
}
