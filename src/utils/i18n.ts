import { getRelativeLocaleUrl } from 'astro:i18n';
import { DEFAULT_LOCALE, LOCALE_OPTIONS } from '@/constants';
import type {
  Locale,
  LocaleConfig,
  LocalePath,
  TranslationDict,
  TranslationKey,
} from '@/types/i18n';
import { zh_CN } from '../i18n/zh-CN';
import { en_US } from '../i18n/en-US';

const dictionaries: Record<string, TranslationDict> = {
  'zh-CN': zh_CN,
  'en-US': en_US as TranslationDict,
};

/**
 * Helper to get the translation dictionary based on the language code
 * @param locale
 * @returns
 */
function getDictionary(locale: string): TranslationDict {
  const normalizedLocale =
    LOCALE_OPTIONS.find((opt) => opt.locale.toLowerCase() === locale.toLowerCase())?.locale ||
    DEFAULT_LOCALE;

  return dictionaries[normalizedLocale] || dictionaries[DEFAULT_LOCALE];
}

/**
 * Helper to get the locale configuration based on the language code
 * @param locale
 * @returns
 */
export const getLocaleConfig = (locale: string): LocaleConfig => {
  return (
    LOCALE_OPTIONS.find((option) => option.locale.toLowerCase() === locale.toLowerCase()) ??
    LOCALE_OPTIONS[0]
  );
};

/**
 * Helper to get the locale label based on the language code
 * @param locale
 * @returns
 */
export const getLocaleLabel = (locale: string): string => {
  return (
    LOCALE_OPTIONS.find((option) => option.locale.toLowerCase() === locale.toLowerCase())?.label ??
    locale
  );
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

  // 3. Always normalize to the standard case from LOCALE_OPTIONS
  const matchedLocale = LOCALE_OPTIONS.find(
    (opt) => opt.locale.toLowerCase() === rawLocale!.toLowerCase(),
  );

  return matchedLocale ? matchedLocale.locale : DEFAULT_LOCALE;
}

/**
 * Get all possible locale strings for static paths (ONLY lowercase for URLs)
 */
export function getStaticLocales(): string[] {
  return LOCALE_OPTIONS.map((option) => option.locale.toLowerCase());
}

/**
 * Get static paths for simple i18n routes that only need the lang parameter
 * @returns Array of path objects
 */
export function getLangStaticPaths() {
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
      const key = Object.keys(multilingual).find((k) => k.toLowerCase() === locale.toLowerCase());
      return key ? multilingual[key] : multilingual[DEFAULT_LOCALE] || '';
    }
  };
}

/**
 * Remove locale prefix from pathname
 */
export function stripLocalePrefix(pathname: string): string {
  const langs = LOCALE_OPTIONS.map((option) => option.locale);
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
  return getRelativeLocaleUrl(locale.toLowerCase(), path);
}

/**
 * Get corresponding path list for all locales
 */
export function getLocalePaths(url: URL): LocalePath[] {
  const pathWithoutLocale = stripLocalePrefix(url.pathname);
  // Ensure we don't pass a leading slash if it's not the root
  const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale.replace(/^\/+/, '');

  return LOCALE_OPTIONS.map(({ locale }) => ({
    locale,
    path: getLocalizedHref(locale, cleanPath),
  }));
}
