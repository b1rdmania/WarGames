import { GIF_LIBRARY_BY_ALIAS } from '@/lib/gif-library';

export function getGifPath(alias: string, fallback: string): string {
  return GIF_LIBRARY_BY_ALIAS[alias]?.path ?? fallback;
}

