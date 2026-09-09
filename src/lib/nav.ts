/** Routes that come from collections rather than from the Pages collection. */
export interface NavItem {
  label: string;
  href: string;
  order: number;
  /** Marks a section whose content is placeholder in this demo. */
  demo?: boolean;
}

export const COLLECTION_NAV: NavItem[] = [
  { label: 'Publications', href: '/publications', order: 3 },
  { label: 'Team', href: '/team', order: 4 },
  { label: 'Projects', href: '/projects', order: 5, demo: true },
  { label: 'News', href: '/news', order: 6, demo: true },
  { label: 'Events', href: '/events', order: 7, demo: true },
  { label: 'Gallery', href: '/gallery', order: 8, demo: true },
  { label: 'How this works', href: '/how-this-works', order: 10 },
];

export { url, isCurrent } from './paths.ts';
