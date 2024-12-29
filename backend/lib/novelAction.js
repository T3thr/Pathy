import useSWR from 'swr';
import axios from 'axios';

// Optimize fetcher with caching headers and timeout
const fetcher = url => axios.get(url, {
  timeout: 5000,
  headers: {
    'Cache-Control': 'max-age=3600'
  }
}).then(res => res.data);

// Add cache configuration and optimizations
export function useNovelViewCounts() {
  const { data, error } = useSWR(
    '/api/novels/${encodeURIComponent(novel.title)}/viewCount', 
    fetcher, 
    {
      refreshInterval: 5000,
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      keepPreviousData: true
    }
  );

  return {
    data: data || {},
    isLoading: !data && !error,
    error
  };
}

// Optimize novel details fetching
export function useNovelDetails(title) {
  const { data, error } = useSWR(
    title ? `/api/novels/${encodeURIComponent(title)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // Cache for 1 hour
      keepPreviousData: true
    }
  );

  return {
    data: data || {},
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
