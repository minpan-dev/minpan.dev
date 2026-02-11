import type { zh_CN } from '../i18n/zh-CN';

export type Locale = 'en-US' | 'zh-CN';

export interface LocaleConfig {
  locale: Locale;
  label: string;
  dir: 'ltr' | 'rtl';
}

export type LocalePath = {
  locale: Locale;
  path: string;
};

export type TranslationDict = typeof zh_CN;
export type TranslationKey = keyof TranslationDict;
