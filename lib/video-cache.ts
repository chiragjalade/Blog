const VIDEO_CACHE_KEY = 'video-cache-v1';

export async function preloadAndCacheVideo(url: string): Promise<void> {
  try {
    // Check if the video is already in the cache
    const cache = await caches.open(VIDEO_CACHE_KEY);
    const cachedResponse = await cache.match(url);
    
    if (!cachedResponse) {
      // If not in cache, fetch and store it
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        await cache.put(url, response.clone());
      }
    }
  } catch (error) {
    console.error('Error caching video:', error);
  }
}

export async function preloadAndCacheImage(url: string): Promise<void> {
  try {
    const cache = await caches.open(VIDEO_CACHE_KEY);
    const cachedResponse = await cache.match(url);
    
    if (!cachedResponse) {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        await cache.put(url, response.clone());
      }
    }
  } catch (error) {
    console.error('Error caching image:', error);
  }
}

export async function preloadAllVideos(items: { src: string, poster: string }[]): Promise<void> {
  try {
    await Promise.all(items.flatMap(item => [
      preloadAndCacheVideo(item.src),
      preloadAndCacheImage(item.poster)
    ]));
  } catch (error) {
    console.error('Error preloading videos and images:', error);
  }
}

