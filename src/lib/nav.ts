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

/**
 * Join a site-root path onto Astro's configured base, so the same build works
 * at a domain root and under a GitHub Pages project path.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path}`;
}

/** True when `href` is the current page, tolerating a trailing slash. */
export function isCurrent(href: string, pathname: string): boolean {
  const strip = (value: string) => value.replace(/\/+$/, '') || '/';
  return strip(url(href)) === strip(pathname);
}
