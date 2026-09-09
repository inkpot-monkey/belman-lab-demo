import { describe, it, expect } from 'vitest';
import { joinBase, isCurrentPath, COLLECTION_NAV } from '../src/lib/nav.ts';

describe('joinBase', () => {
  it('leaves paths alone at the site root', () => {
    expect(joinBase('/', '/team')).toBe('/team');
    expect(joinBase('/', '/')).toBe('/');
  });

  it('prefixes a project path', () => {
    expect(joinBase('/belman-lab-demo', '/team')).toBe('/belman-lab-demo/team');
  });

  it('does not double the slash when the base has a trailing one', () => {
    expect(joinBase('/belman-lab-demo/', '/team')).toBe('/belman-lab-demo/team');
  });

  it('keeps the root reachable under a project path', () => {
    expect(joinBase('/belman-lab-demo/', '/')).toBe('/belman-lab-demo/');
    expect(joinBase('/belman-lab-demo', '/')).toBe('/belman-lab-demo/');
  });
});

describe('isCurrentPath', () => {
  it('matches the current page at the site root', () => {
    expect(isCurrentPath('/', '/team', '/team')).toBe(true);
    expect(isCurrentPath('/', '/team', '/news')).toBe(false);
  });

  it('ignores a trailing slash on either side', () => {
    expect(isCurrentPath('/', '/team', '/team/')).toBe(true);
    expect(isCurrentPath('/', '/', '/')).toBe(true);
  });

  it('matches under a project base path', () => {
    expect(isCurrentPath('/belman-lab-demo', '/team', '/belman-lab-demo/team')).toBe(true);
    expect(isCurrentPath('/belman-lab-demo', '/team', '/team')).toBe(false);
  });

  it('matches the home page under a project base path', () => {
    expect(isCurrentPath('/belman-lab-demo', '/', '/belman-lab-demo/')).toBe(true);
    expect(isCurrentPath('/belman-lab-demo', '/', '/belman-lab-demo')).toBe(true);
  });

  it('does not treat a prefix as a match', () => {
    expect(isCurrentPath('/', '/team', '/team-photos')).toBe(false);
  });
});

describe('COLLECTION_NAV', () => {
  it('has a unique order for every entry, so the merged menu is deterministic', () => {
    const orders = COLLECTION_NAV.map((item) => item.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('points every entry at a site-root path', () => {
    expect(COLLECTION_NAV.every((item) => item.href.startsWith('/'))).toBe(true);
  });
});
