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

/** Drop trailing slashes, but never reduce the root path to an empty string. */
const normalise = (value: string): string => value.replace(/\/+$/, '') || '/';

/**
 * Join a site-root path onto a base path.
 *
 * Split out from `url` so the base can be supplied directly in tests: this is
 * what lets one build serve from a domain root and from a GitHub Pages project
 * path, and getting it wrong breaks every link on the site at once.
 */
export function joinBase(base: string, path: string): string {
  const prefix = base.replace(/\/+$/, '');
  return path === '/' ? `${prefix}/` : `${prefix}${path}`;
}

/** True when `href` is the current page, tolerating trailing slashes. */
export function isCurrentPath(base: string, href: string, pathname: string): boolean {
  return normalise(joinBase(base, href)) === normalise(pathname);
}

/** The configured base path, defaulting to the site root outside Astro. */
const siteBase = (): string => import.meta.env?.BASE_URL ?? '/';

export const url = (path: string): string => joinBase(siteBase(), path);

export const isCurrent = (href: string, pathname: string): boolean =>
  isCurrentPath(siteBase(), href, pathname);
