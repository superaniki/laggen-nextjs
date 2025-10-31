import { useState, useEffect } from 'react';

// Global image cache to store loaded images
const imageCache: Record<string, HTMLImageElement> = {};

/**
 * Custom hook for loading and caching images
 * This hook will:
 * 1. Check if the image is already in the cache
 * 2. If not, load the image and store it in the cache
 * 3. Return the image and loading status
 */
export function useImageCache(src: string): [HTMLImageElement | undefined, 'loading' | 'loaded' | 'failed'] {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>(
    imageCache[src] ? 'loaded' : 'loading'
  );
  const [image, setImage] = useState<HTMLImageElement | undefined>(imageCache[src]);

  useEffect(() => {
    // If the image is already cached, use it
    if (imageCache[src]) {
      setStatus('loaded');
      setImage(imageCache[src]);
      return;
    }

    // Otherwise load the image
    const img = new Image();
    
    const handleLoad = () => {
      imageCache[src] = img;
      setStatus('loaded');
      setImage(img);
    };
    
    const handleError = () => {
      setStatus('failed');
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    // Cleanup function
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return [image, status];
}
