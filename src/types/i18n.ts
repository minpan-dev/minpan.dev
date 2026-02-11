import type { zh_CN } from '../i18n/zh-CN';

import { LOCALES_SETTING } from '../constants';

export type Locale = keyof typeof LOCALES_SETTING;

export type LocalePath = {
  locale: Locale;
  path: string;
};

export type TranslationDict = typeof zh_CN;
export type TranslationKey = keyof TranslationDict;
