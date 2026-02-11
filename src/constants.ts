import IconMail from './assets/icons/IconMail.svg';
import IconGitHub from './assets/icons/IconGitHub.svg';
import IconBrandX from './assets/icons/IconBrandX.svg';
import IconWhatsapp from './assets/icons/IconWhatsapp.svg';
import IconFacebook from './assets/icons/IconFacebook.svg';
import IconTelegram from './assets/icons/IconTelegram.svg';
import IconPinterest from './assets/icons/IconPinterest.svg';
import IconInstagram from './assets/icons/IconInstagram.svg';

import type { Locale, LocaleConfig } from './types/i18n';
import type { Social } from './types/config';

export const DEFAULT_LOCALE: Locale = 'zh-CN';

export const LOCALE_OPTIONS: readonly LocaleConfig[] = [
  { locale: 'zh-CN', label: '简体中文', dir: 'ltr' },
  { locale: 'en-US', label: 'English', dir: 'ltr' },
];

export const LOCALE_LIST: Locale[] = ['zh-CN', 'en-US'];

export const SOCIALS: Social[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/minpan1206',
    icon: IconInstagram,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/minpan-dev',
    icon: IconGitHub,
  },
  {
    name: 'X',
    href: 'https://x.com/minpan1206',
    icon: IconBrandX,
  },
  {
    name: 'Mail',
    href: 'mailto:minpan1206@gmail.com',
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/?text=',
    icon: IconWhatsapp,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/sharer.php?u=',
    icon: IconFacebook,
  },
  {
    name: 'X',
    href: 'https://x.com/intent/post?url=',
    icon: IconBrandX,
  },
  {
    name: 'Telegram',
    href: 'https://t.me/share/url?url=',
    icon: IconTelegram,
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com/pin/create/button/?url=',
    icon: IconPinterest,
  },
  {
    name: 'Mail',
    href: 'mailto:?subject=See%20this%20post&body=',
    icon: IconMail,
  },
] as const;
