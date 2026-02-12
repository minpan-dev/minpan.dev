import { DEFAULT_LOCALE } from './constants';

export const SITE = {
  website: 'https://minpan.dev',
  author: 'Min Pan',
  profile: 'https://minpan.dev',
  desc: 'Personal blog of Min Pan, sharing technology, life and thoughts.',
  title: 'Min Pan',
  ogImage: 'astropaper-og.jpg',
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: 'Edit this page',
    url: 'https://github.com/minpan-dev/blog/edit/main/',
  },
  dynamicOgImage: true,
  dir: 'ltr',
  locale: DEFAULT_LOCALE,
  timezone: 'Asia/Shanghai',
} as const;
