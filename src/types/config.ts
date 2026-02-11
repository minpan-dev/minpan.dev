import type { Props } from 'astro';

export interface Social {
  name: string;
  href: string;
  icon: (_props: Props) => Element;
}
