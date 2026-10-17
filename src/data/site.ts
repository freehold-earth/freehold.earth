export const SITE_URL = 'https://freehold.earth';
export const REPO_URL = 'https://github.com/freehold-earth/freehold';
/** Set once Discussions is enabled on the freehold repo (launch step, owner approval). */
export const DISCUSSIONS_URL: string | null = null;
export const TALK_URL = DISCUSSIONS_URL ?? `${REPO_URL}/issues`;

export interface NavItem {
  href: string;
  label: string;
}

export const NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/communities/', label: 'Communities' },
  { href: '/build/', label: 'Build' },
  { href: '/manifesto/', label: 'Manifesto' },
  { href: REPO_URL, label: 'GitHub' },
];
