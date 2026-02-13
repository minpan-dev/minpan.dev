import IconMail from './assets/icons/IconMail.svg';
import IconGitHub from './assets/icons/IconGitHub.svg';
import IconBrandX from './assets/icons/IconBrandX.svg';
import IconWhatsapp from './assets/icons/IconWhatsapp.svg';
import IconFacebook from './assets/icons/IconFacebook.svg';
import IconTelegram from './assets/icons/IconTelegram.svg';
import IconPinterest from './assets/icons/IconPinterest.svg';
import IconInstagram from './assets/icons/IconInstagram.svg';

import type { Social } from './types/config';

export const LOCALES_SETTING = {
  'zh-CN': '中文（简体）',
  'en-US': 'English (US)',
} as const;

export const DEFAULT_LOCALE = 'zh-CN';

export const LOCALE_LIST = Object.keys(LOCALES_SETTING) as (keyof typeof LOCALES_SETTING)[];

export const SOCIALS: Social[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/minpandev',
    icon: IconInstagram,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/minpan-dev',
    icon: IconGitHub,
  },
  {
    name: 'X',
    href: 'https://x.com/minpandev',
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
