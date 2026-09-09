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
  // Directly under Publications, and named rather than folded into a GitHub
  // link in a footer. Across the lab sites we looked at, code and data are
  // either absent from the menu or buried inside a project page; putting them
  // at the top level is the fastest thing that separates a research group's
  // site from a departmental template, and it is a claim about how the lab
  // works rather than a decoration, so every design carries it.
  { label: 'Software & data', href: '/software', order: 4 },
  { label: 'Team', href: '/team', order: 5 },
  { label: 'Projects', href: '/projects', order: 6, demo: true },
  { label: 'News', href: '/news', order: 7, demo: true },
  { label: 'Events', href: '/events', order: 8, demo: true },
  { label: 'Gallery', href: '/gallery', order: 9, demo: true },
];

// /how-this-works is deliberately absent: it is a manual for whoever edits the
// site, not something visitors should find in the menu. The page still builds
// and is reachable by URL.

export { url, isCurrent } from './paths.ts';
