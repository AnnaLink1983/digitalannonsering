/**
 * Stub for shared-utils/src/imageUtils
 * In production, replace Vite alias with the real shared-utils package.
 */

export const smallImageSize = 48;
export const mediumImageSize = 80;

export function handleImageLoadError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
}
