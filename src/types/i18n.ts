import type { zh_cn } from '../i18n/zh-cn';

import { LOCALES_SETTING } from '../constants';

export type Locale = keyof typeof LOCALES_SETTING;

export interface LocaleConfig {
  label: string;
  lang: string;
}

export type LocalePath = {
  locale: Locale;
  path: string;
};

export type TranslationDict = typeof zh_cn;
export type TranslationKey = keyof TranslationDict;
