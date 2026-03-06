import type { CollectionEntry } from 'astro:content';
import { slugifyStr } from './slugify';
import postFilter from './postFilter';
import type { Tag } from '@/types/blog';

const getUniqueTags = (posts: CollectionEntry<'blog'>[]) => {
  const tagMap = new Map<string, Tag>();
  posts
    .filter(postFilter)
    .flatMap((post) => post.data.tags)
    .forEach((tag) => {
      const slug = slugifyStr(tag);
      if (!tagMap.has(slug)) {
        tagMap.set(slug, { tag: slug, tagName: tag });
      }
    });
  return [...tagMap.values()].sort((a, b) => a.tag.localeCompare(b.tag));
};

export default getUniqueTags;
