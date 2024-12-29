// backend/lib/novelAction.js
import useSWR from 'swr';
import axios from 'axios';

// Fetcher function
const fetcher = url => axios.get(url).then(res => res.data);

// Fetch view counts for all novels
export function useNovelViewCounts() {
  const { data, error } = useSWR('/api/novels/${encodeURIComponent(novel.title)}/viewCount', fetcher, { refreshInterval: 5000 });

  return {
    data: data || {},  // Default to an empty object if no data
    isLoading: !data && !error,
    error
  };
}

// Fetch individual novel details (You can extend this as needed)
export function useNovelDetails(title) {
  const { data, error } = useSWR(title ? `/api/novels/${encodeURIComponent(title)}` : null, fetcher);

  return {
    data: data || {},  // Default to an empty object if no data
    isLoading: !data && !error,
    error
  };
}

// You can create additional actions here for other novel-related operations
export async function addNovelEpisodes(novelTitle, episodes) {
  try {
    const response = await axios.post(`/api/novels/${encodeURIComponent(novelTitle)}/episodes`, {
      episodes,
    });
    return response.status === 201;
  } catch (error) {
    console.error(`Error adding episodes for ${novelTitle}:`, error);
    return false;
  }
}
