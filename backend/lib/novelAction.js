// backend/lib/novelAction.js
import useSWR from 'swr';
import axios from 'axios';

// Cached fetcher with deduplication
const fetcher = async (url) => {
  const response = await axios.get(url, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

// Optimized cache configuration
const cacheConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 2000, // Dedupe requests within 2s window
  errorRetryCount: 2
};

// Batch fetch view counts for all novels
export function useNovelViewCounts() {
  const { data, error, mutate } = useSWR(
    '/api/novels/${encodeURIComponent(novel.title)}/viewCount',
    fetcher,
    {
      ...cacheConfig,
      refreshInterval: 1000, // Reduced polling interval
      fallbackData: {}, // Immediate render with empty data
      suspense: false // Disable suspense for faster initial load
    }
  );

  return {
    data: data || {},
    isLoading: !data && !error,
    error,
    mutate // Expose mutate function for manual updates
  };
}

// Optimized novel details fetch with caching
export function useNovelDetails(title) {
  const { data, error, mutate } = useSWR(
    title ? `/api/novels/${encodeURIComponent(title)}` : null,
    fetcher,
    {
      ...cacheConfig,
      revalidateIfStale: false,
      fallbackData: {} // Enable immediate render
    }
  );

  return {
    data: data || {},
    isLoading: !data && !error,
    error,
    mutate
  };
}

// Optimized episode addition with background sync
export async function addNovelEpisodes(novelTitle, episodes) {
  const endpoint = `/api/novels/${encodeURIComponent(novelTitle)}/episodes`;
  
  try {
    const response = await axios.post(endpoint, 
      { episodes },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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