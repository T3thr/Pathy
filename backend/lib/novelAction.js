// backend/lib/novelAction.js
import useSWR from 'swr';
import axios from 'axios';

// Optimized fetcher with caching
const fetcher = async (url) => {
  const response = await axios.get(url, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

// Global SWR configuration for view counts
const viewCountConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 10000, // Increased to reduce server load
  dedupingInterval: 5000,
  errorRetryCount: 2
};

// Optimized view count fetching
export function useNovelViewCounts() {
  const { data, error, mutate } = useSWR('/api/novels/${encodeURIComponent(novel.title)}/viewCount', fetcher, viewCountConfig);
  
  return {
    data: data || {},
    isLoading: !data && !error,
    error,
    mutate // Expose mutate for manual updates
  };
}

// Optimized novel details fetching with caching
export function useNovelDetails(title) {
  const { data, error } = useSWR(
    title ? `/api/novels/${encodeURIComponent(title)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60000 // Cache for 1 minute
    }
  );

  return {
    data: data || {},
    isLoading: !data && !error,
    error
  };
}

// Optimized episode adding with background sync
export async function addNovelEpisodes(novelTitle, episodes) {
  try {
    const response = await axios.post(
      `/api/novels/${encodeURIComponent(novelTitle)}/episodes`,
      { episodes },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000 // Add timeout
      }
    );
    return response.status === 201;
  } catch (error) {
    console.error(`Error adding episodes for ${novelTitle}:`, error);
    return false;
  }
}