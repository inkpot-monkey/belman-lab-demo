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
];

// /how-this-works is deliberately absent: it is a manual for whoever edits the
// site, not something visitors should find in the menu. The page still builds
// and is reachable by URL.

export { url, isCurrent } from './paths.ts';
