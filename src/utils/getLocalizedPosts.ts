import type { CollectionEntry } from 'astro:content';
import { LOCALES_SETTING, DEFAULT_LOCALE } from '@/constants';

const LOCALE_LIST = Object.keys(LOCALES_SETTING);

export const getLocalizedPosts = (allPosts: CollectionEntry<'blog'>[], locale: string) => {
  if (locale === DEFAULT_LOCALE) {
    return allPosts.filter((post) =>
      post.id.toLowerCase().startsWith(`${DEFAULT_LOCALE.toLowerCase()}/`),
    );
  }

  const postsMap = new Map<string, CollectionEntry<'blog'>>();
  allPosts.forEach((post) => {
    const baseId = post.id.replace(new RegExp(`^(${LOCALE_LIST.join('|')})\\/`, 'i'), '');
    if (!postsMap.has(baseId) || post.id.toLowerCase().startsWith(`${locale.toLowerCase()}/`)) {
      postsMap.set(baseId, post);
    }
  });

  return Array.from(postsMap.values());
};
