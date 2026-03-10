import type zh_CN from '../i18n/zh-CN';

import { LOCALES_SETTING } from '../constants';

export type Locale = keyof typeof LOCALES_SETTING;

export type LocalePath = {
  locale: Locale;
  path: string;
};

export type TranslationDict = typeof zh_CN;

type Leaves<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? `${K}.${Leaves<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type TranslationKey = Leaves<TranslationDict>;
