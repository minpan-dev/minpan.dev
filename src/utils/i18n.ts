import { getRelativeLocaleUrl } from 'astro:i18n';
import { DEFAULT_LOCALE, LOCALES_SETTING } from '@/constants';
import type {
  Locale,
  LocaleConfig,
  LocalePath,
  TranslationDict,
  TranslationKey,
} from '@/types/i18n';
import { zh_cn } from '../i18n/zh-cn';
import { en_us } from '../i18n/en-us';

const dictionaries: Record<Locale, TranslationDict> = {
  'zh-cn': zh_cn,
  'en-us': en_us as TranslationDict,
};

/**
 * Helper to get the translation dictionary based on the language code
 * @param locale
 * @returns
 */
function getDictionary(locale: string): TranslationDict {
  const normalizedLocale = Object.keys(LOCALES_SETTING).includes(locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;

  return dictionaries[normalizedLocale] || dictionaries[DEFAULT_LOCALE];
}

/**
 * Helper to get the locale configuration based on the language code
 * @param locale
 * @returns
 */
export const getLocaleConfig = (locale: string): LocaleConfig => {
  if (Object.keys(LOCALES_SETTING).includes(locale)) {
    return LOCALES_SETTING[locale as Locale];
  }
  return LOCALES_SETTING[DEFAULT_LOCALE];
};

/**
 * Helper to get the locale label based on the language code
 * @param locale
 * @returns
 */
export const getLocaleLabel = (locale: string): string => {
  if (Object.keys(LOCALES_SETTING).includes(locale)) {
    return LOCALES_SETTING[locale as Locale].label;
  }
  return locale;
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
  const matchedLocale = Object.keys(LOCALES_SETTING).find(
    (l) => l.toLowerCase() === rawLocale!.toLowerCase(),
  );

  return matchedLocale ? (matchedLocale as Locale) : DEFAULT_LOCALE;
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
      const key = Object.keys(multilingual).find((k) => k.toLowerCase() === locale.toLowerCase());
      return key ? multilingual[key] : multilingual[DEFAULT_LOCALE] || '';
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
  return getRelativeLocaleUrl(locale.toLowerCase(), path);
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
