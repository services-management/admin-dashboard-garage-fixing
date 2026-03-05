/**
 * Converts API image URLs to use the Vite proxy to bypass SSL certificate issues
 * in development. In production, returns the original URL.
 */
export function getProxiedImageUrl(url: string | undefined | null): string {
  if (!url) {
    return '';
  }

  // If it's already a proxy URL or external URL (not from our API), return as-is
  if (url.startsWith('/uploads/') || url.startsWith('/images/')) {
    return url;
  }

  // If it's an external URL (not from our API), return as-is
  if (url.startsWith('http') && !url.includes('garas-api.domrey.online')) {
    return url;
  }

  // In development, rewrite API URLs to use the Vite proxy
  if (import.meta.env.DEV) {
    // Extract the path after the domain
    // This routes the image through Vite's dev server proxy
    const apiPattern = /https?:\/\/garas-api\.domrey\.online\/(.*)/;
    const match = url.match(apiPattern);
    if (match && match[1]) {
      // Route through the proxy (keeps the /uploads or /images prefix)
      return `/${match[1]}`;
    }
  }

  return url;
}
