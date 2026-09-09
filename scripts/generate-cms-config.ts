/**
 * Write public/admin/config.yml and public/admin/index.html.
 *
 * Both are generated from one repo name so the CMS cannot be pointed at one
 * repository while the sign-in instructions name another - a mismatch that
 * would have an editor unwittingly committing to somebody else's site.
 *
 * Runs as part of `pnpm build`, so a schema change cannot ship without the CMS
 * form changing to match.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { collections, fileCollections } from '../src/schema/collections.ts';
import { generateCmsConfig } from '../src/schema/generate.ts';

// Defaults to THIS repository. The real site sets CMS_REPO to
// sophbel/sophbel.github.io; defaulting to that instead would mean a
// mis-configured demo writes to her live site.
const repo = process.env.CMS_REPO ?? 'inkpot-monkey/belman-lab-demo';
const branch = process.env.CMS_BRANCH ?? 'main';

const configOut = new URL('../public/admin/config.yml', import.meta.url);
const pageOut = new URL('../public/admin/index.html', import.meta.url);
const template = new URL('../src/admin/index.template.html', import.meta.url);

await writeFile(
  configOut,
  generateCmsConfig({
    repo,
    branch,
    mediaFolder: 'public/uploads',
    publicFolder: '/uploads',
    collections,
    fileCollections,
  }),
);

const page = (await readFile(template, 'utf8'))
  .replaceAll('{{REPO}}', repo)
  .replaceAll('{{REPO_NAME}}', repo.split('/')[1] ?? repo);

await writeFile(pageOut, page);
console.log(`Wrote public/admin/{config.yml,index.html} for ${repo}`);
