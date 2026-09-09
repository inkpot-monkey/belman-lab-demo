/**
 * Write public/admin/config.yml from the shared content spec.
 *
 * Runs as part of `pnpm build`, so a schema change cannot ship without the CMS
 * form changing to match.
 */
import { writeFile } from 'node:fs/promises';
import { collections, fileCollections } from '../src/schema/collections.ts';
import { generateCmsConfig } from '../src/schema/generate.ts';

const OUT = new URL('../public/admin/config.yml', import.meta.url);

const yaml = generateCmsConfig({
  repo: process.env.CMS_REPO ?? 'sophbel/sophbel.github.io',
  branch: process.env.CMS_BRANCH ?? 'main',
  mediaFolder: 'public/uploads',
  publicFolder: '/uploads',
  collections,
  fileCollections,
});

await writeFile(OUT, yaml);
console.log(`Wrote ${OUT.pathname}`);
