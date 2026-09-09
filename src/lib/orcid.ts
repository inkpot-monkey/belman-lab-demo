/**
 * Turn a committed ORCID snapshot into a publication list fit to render.
 *
 * Everything here is pure: the network call lives in `scripts/fetch-orcid.ts`,
 * so the rendering rules can be tested without touching ORCID.
 */

export interface SnapshotWork {
  putCode: number;
  title: string;
  type: string | null;
  year: string | null;
  journal: string | null;
  doi: string | null;
  url: string | null;
  authors: string[];
}

export interface Snapshot {
  orcid: string;
  fetchedAt: string;
  works: SnapshotWork[];
}

export interface Publication {
  /** DOI where there is one, else the ORCID put-code. Stable across syncs. */
  id: string;
  title: string;
  year: number | null;
  journal: string | null;
  doi: string | null;
  url: string | null;
  authors: string[];
  isPreprint: boolean;
  /**
   * Id of the published article that carries the same title, when this is a
   * preprint. Lets a page hide the preprint without discarding the record.
   */
  supersededBy: string | null;
}

export interface PublicationList {
  /** When the snapshot was taken, so the page can show its own staleness. */
  syncedAt: string;
  publications: Publication[];
}

/**
 * Crossref strips italic markup from titles without replacing the surrounding
 * space, so `<i>Streptococcus pneumoniae</i>` leaves the species name fused to
 * its neighbours. Re-split on a lowercase-to-uppercase boundary, but only when
 * the capital starts a word — `SARS-CoV-2` and `PCV13` must survive untouched.
 */
export function repairTitle(title: string): string {
  return title
    .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface FormatAuthorsOptions {
  /** How many authors to show before truncating. */
  max: number;
  /** An author to keep visible even if the list is truncated before reaching them. */
  emphasise?: string;
}

export function formatAuthors(
  authors: string[],
  { max, emphasise }: FormatAuthorsOptions,
): { shown: string[]; truncated: boolean } {
  if (authors.length <= max) return { shown: [...authors], truncated: false };

  const shown = authors.slice(0, max);
  if (emphasise && authors.includes(emphasise) && !shown.includes(emphasise)) {
    shown.push(emphasise);
  }
  return { shown, truncated: true };
}

/** Comparison key for matching a preprint to its published version. */
const titleKey = (title: string): string => title.toLowerCase().replace(/[^a-z0-9]/g, '');

export function normalisePublications(snapshot: Snapshot): PublicationList {
  const seen = new Set<string>();
  const publications: Publication[] = [];

  for (const work of snapshot.works) {
    const id = work.doi ?? String(work.putCode);
    if (seen.has(id)) continue;
    seen.add(id);

    const year = work.year === null ? null : Number.parseInt(work.year, 10);
    publications.push({
      id,
      title: repairTitle(work.title),
      year: year === null || Number.isNaN(year) ? null : year,
      journal: work.journal,
      doi: work.doi,
      url: work.url,
      authors: work.authors,
      isPreprint: work.type === 'preprint',
      supersededBy: null,
    });
  }

  // A preprint whose title matches a published article is the same work twice.
  // Record the link rather than dropping it, so the page decides what to show.
  const publishedByTitle = new Map(
    publications.filter((p) => !p.isPreprint).map((p) => [titleKey(p.title), p.id]),
  );
  for (const publication of publications) {
    if (!publication.isPreprint) continue;
    publication.supersededBy = publishedByTitle.get(titleKey(publication.title)) ?? null;
  }

  publications.sort(
    (a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity) || a.title.localeCompare(b.title),
  );

  return { syncedAt: snapshot.fetchedAt, publications };
}
