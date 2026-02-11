import { getRelativeLocaleUrl } from 'astro:i18n';
import { DEFAULT_LOCALE, LOCALES_SETTING } from '@/constants';
import type { Locale, LocalePath, TranslationDict, TranslationKey } from '@/types/i18n';
import { zh_CN } from '../i18n/zh-CN';
import { en_US } from '../i18n/en-US';

const dictionaries: Record<Locale, TranslationDict> = {
  'zh-CN': zh_CN,
  'en-US': en_US as TranslationDict,
};

/**
 * Helper to normalize locale code to the standard case (e.g., 'en-us' -> 'en-US')
 */
export function normalizeLocale(locale: string): Locale {
  const matchedLocale = Object.keys(LOCALES_SETTING).find(
    (l) => l.toLowerCase() === locale.toLowerCase(),
  );
  return matchedLocale ? (matchedLocale as Locale) : DEFAULT_LOCALE;
}

/**
 * Helper to get the translation dictionary based on the language code
 * @param locale
 * @returns
 */
function getDictionary(locale: string): TranslationDict {
  const normalizedLocale = normalizeLocale(locale);
  return dictionaries[normalizedLocale] || dictionaries[DEFAULT_LOCALE];
}

/**
 * Helper to get the locale label based on the language code
 * @param locale
 * @returns
 */
export const getLocaleLabel = (locale: string): string => {
  const normalizedLocale = normalizeLocale(locale);
  return LOCALES_SETTING[normalizedLocale];
};

/**
 * Get current locale from Astro object
 * @param astro - The Astro global object or a partial object with currentLocale and url
 * @returns The current locale (Always returns standard case like 'zh-CN')
 */
export function getCurrentLocale(astro: { currentLocale?: string; url?: URL }): Locale {
  // 1. Try Astro.currentLocale first
  let rawLocale = astro.currentLocale;

  // 2. If not found, try to extract from URL pathname
  if (!rawLocale && astro.url) {
    const segments = astro.url.pathname.split('/').filter(Boolean);
    rawLocale = segments[0];
  }

  if (!rawLocale) return DEFAULT_LOCALE;

  // 3. Always normalize to the standard case from LOCALES_SETTING
  return normalizeLocale(rawLocale);
}

/**
 * Get all possible locale strings for static paths (ONLY lowercase for URLs)
 */
export function getStaticLocales(): string[] {
  return Object.keys(LOCALES_SETTING);
}

/**
 * Get static paths for simple i18n routes that only need the lang parameter
 * @returns Array of path objects
 */
export function getLocaleStaticPaths() {
  return getStaticLocales().map((lang) => ({ params: { lang } }));
}

/**
 * Helper to get the translation function
 * @param locale - The current language
 * @returns - The translation function
 */
export function useTranslations(locale: string) {
  const dictionary = getDictionary(locale);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function t(multilingual: TranslationKey | Record<string, string> | string): any {
    if (typeof multilingual === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (dictionary as Record<string, any>)[multilingual] || multilingual;
    } else {
      // Find matching locale in the Record (case-insensitive)
      // Find matching locale in the Record (case-insensitive)
      const key = Object.keys(multilingual).find((k) => k.toLowerCase() === locale.toLowerCase());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return key ? (multilingual as any)[key] : (multilingual as any)[DEFAULT_LOCALE] || '';
    }
  };
}

/**
 * Remove locale prefix from pathname
 */
export function stripLocalePrefix(pathname: string): string {
  const langs = Object.keys(LOCALES_SETTING);
  const regex = new RegExp(`^/(${langs.join('|')})(/|$)`, 'i');

  return pathname.replace(regex, '/').replace(/\/+$/, '') || '/';
}

/**
 * Get breadcrumb list from pathname
 */
export function getBreadcrumbList(pathname: string): string[] {
  const pathWithoutLocale = stripLocalePrefix(pathname);
  return pathWithoutLocale.split('/').filter(Boolean);
}

/**
 * Get localized href with lowercase locale (for URL consistency)
 */
export function getLocalizedHref(locale: string, path: string): string {
  const url = getRelativeLocaleUrl(locale, path);
  return url.replace(new RegExp(`^/${locale.toLowerCase()}`), `/${locale}`);
}

/**
 * Get corresponding path list for all locales
 */
export function getLocalePaths(url: URL): LocalePath[] {
  const pathWithoutLocale = stripLocalePrefix(url.pathname);
  // Ensure we don't pass a leading slash if it's not the root
  const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale.replace(/^\/+/, '');

  return Object.keys(LOCALES_SETTING).map((locale) => ({
    locale: locale as Locale,
    path: getLocalizedHref(locale, cleanPath),
  }));
}
