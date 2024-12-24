import mongodbConnect from '@/backend/lib/mongodb';
import Novel from '@/backend/models/Novel';
import { novels } from '@/data/novels';

export async function POST() {
  try {
    await mongodbConnect();

    // Upsert novels into the database
    const operations = novels.map((novel) => ({
      updateOne: {
        filter: { title: novel.title }, // Match by title
        update: { $set: novel },       // Update the document with new data
        upsert: true,                  // Insert if not found
      },
    }));

    await Novel.bulkWrite(operations);

    return new Response(JSON.stringify({ message: 'Novels updated successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to update novels', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
