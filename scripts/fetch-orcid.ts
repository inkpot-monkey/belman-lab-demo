/**
 * Fetch an ORCID record into a committed snapshot.
 *
 * The snapshot is committed so builds are reproducible and offline: CI never
 * calls ORCID, and a publication list cannot change because someone else's
 * service had a bad day. Re-run this deliberately to pick up new work.
 *
 * Usage: npm run sync:orcid
 */
import { writeFile } from 'node:fs/promises';

const ORCID = process.env.ORCID_ID ?? '0000-0002-9778-7174';
const API = 'https://pub.orcid.org/v3.0';
const OUT = new URL('../src/data/orcid-snapshot.json', import.meta.url);

const json = async (path: string): Promise<any> => {
  const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`ORCID ${path} responded ${response.status}`);
  return response.json();
};

const summaries = (await json(`/${ORCID}/works`)).group.map((g: any) => g['work-summary'][0]);

// Author lists live only on the per-work endpoint, not the summary, so each
// work needs its own request. Sequential: 13 works, and ORCID is not ours to hammer.
const works = [];
for (const summary of summaries) {
  const detail = await json(`/${ORCID}/work/${summary['put-code']}`);
  works.push({
    putCode: summary['put-code'],
    title: summary.title?.title?.value ?? '',
    type: summary.type ?? null,
    year: summary['publication-date']?.year?.value ?? null,
    journal: summary['journal-title']?.value ?? null,
    doi:
      summary['external-ids']?.['external-id']?.find((id: any) => id['external-id-type'] === 'doi')?.[
        'external-id-value'
      ] ?? null,
    url: summary.url?.value ?? null,
    authors: (detail.contributors?.contributor ?? [])
      .map((c: any) => c['credit-name']?.value)
      .filter((name: unknown): name is string => typeof name === 'string' && name.length > 0),
  });
}

const snapshot = { orcid: ORCID, fetchedAt: new Date().toISOString(), works };
await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${works.length} works to ${OUT.pathname}`);
