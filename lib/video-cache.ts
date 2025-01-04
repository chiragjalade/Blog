const VIDEO_CACHE_KEY = 'video-cache-v1';

export async function preloadAndCacheVideo(url: string): Promise<void> {
  try {
    // Check if the video is already in the cache
    const cache = await caches.open(VIDEO_CACHE_KEY);
    const cachedResponse = await cache.match(url);
    
    if (!cachedResponse) {
      // If not in cache, fetch and store it
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response.clone());
      }
    }
  } catch (error) {
    console.error('Error caching video:', error);
  }
}

export async function preloadAllVideos(urls: string[]): Promise<void> {
  try {
    await Promise.all(urls.map(url => preloadAndCacheVideo(url)));
  } catch (error) {
    console.error('Error preloading videos:', error);
  }
}