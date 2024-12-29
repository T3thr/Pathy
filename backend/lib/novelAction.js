// backend/lib/novelAction.js
import useSWR from 'swr';
import axios from 'axios';

// Fetcher function
const fetcher = url => axios.get(url).then(res => res.data);

export function useNovelViewCounts() {
  const { data, error } = useSWR('/api/novels/${encodeURIComponent(novel.title)}/viewCount', fetcher, {
    revalidateOnMount: false,  // Don't fetch on mount
    revalidateOnFocus: false,  // Don't fetch on window focus
    refreshInterval: 5000,     // Keep the 5s refresh interval
    fallbackData: {},          // Provide initial data immediately
  });

  return {
    data: data || {},
    isLoading: !data && !error,
    error
  };
}

export function useNovelDetails(title) {
  const { data, error } = useSWR(
    title ? `/api/novels/${encodeURIComponent(title)}` : null, 
    fetcher,
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      fallbackData: {},        // Provide initial data immediately
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
