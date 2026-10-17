export const SITE_URL = 'https://freehold.earth';
export const REPO_URL = 'https://github.com/freehold-earth/freehold';
/** Where people can talk to the project: GitHub Discussions on the freehold repo. */
export const TALK_URL = `${REPO_URL}/discussions`;

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
