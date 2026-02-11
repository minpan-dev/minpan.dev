import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPath } from '@/utils/getPath';
import getSortedPosts from '@/utils/getSortedPosts';
import { SITE } from '@/config';
import { useTranslations, getStaticLocales, getCurrentLocale } from '@/utils/i18n';
import type { APIContext } from 'astro';
import { getRelativeLocaleUrl } from 'astro:i18n';

export async function getStaticPaths() {
  return getStaticLocales().map((lang) => ({ params: { lang } }));
}

export async function GET({ params }: APIContext) {
  const { lang } = params;
  // Normalize to standard locale case
  const locale = getCurrentLocale({ currentLocale: lang });
  const t = useTranslations(locale);

  const posts = await getCollection('blog', ({ id }) => {
    // 过滤出当前语言的文章，或者在该语言下有 fallback 的文章
    return id.toLowerCase().startsWith(locale.toLowerCase() + '/');
  });

  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: t(SITE.title),
    description: t(SITE.desc),
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getRelativeLocaleUrl(locale, getPath(id, filePath)),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
