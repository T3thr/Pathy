// app/api/novels/[title]/route.js
import { novels } from '@/data/novels';

export async function GET(req, { params }) {
  const { title } = params;

  // Find the novel by title
  const novel = novels.find(n => n.title === decodeURIComponent(title));

  if (novel) {
    return new Response(JSON.stringify(novel), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ message: 'Novel not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
