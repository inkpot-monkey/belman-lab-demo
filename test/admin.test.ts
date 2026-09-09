import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * The admin page is the one surface with no build-time type checking and no
 * runtime test, and its failure mode is silent: a blank page that logs nothing.
 * These assertions cover the two ways it has actually broken.
 */
const template = readFileSync(new URL('../src/admin/index.template.html', import.meta.url), 'utf8');

describe('the admin page template', () => {
  it('initialises the CMS explicitly, because the vendored module build does not self-mount', () => {
    expect(template).toMatch(/window\.CMS\.init\(\)/);
  });

  it('loads the bundle that vendor-cms.ts actually writes', () => {
    expect(template).toContain("import './sveltia-cms.mjs'");
  });

  it('points at the generated config beside it', () => {
    expect(template).toMatch(/rel="cms-config-url"/);
    expect(template).toContain('href="./config.yml"');
  });

  it('keeps the access-token guide outside the CMS, reachable when signed out', () => {
    // A guide rendered inside the CMS is unreachable exactly when it is needed.
    const guide = template.slice(template.indexOf('<details'));
    expect(guide).toMatch(/personal-access-tokens\/new/);
    expect(guide).toMatch(/Read and write/);
  });

  it('templates the repository rather than naming one, so it cannot drift from config.yml', () => {
    expect(template).toContain('{{REPO}}');
    expect(template).toContain('{{REPO_NAME}}');
    expect(template).not.toMatch(/sophbel\/sophbel\.github\.io/);
  });
});
