import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * The source order of the four grid areas is the order a reader meets them.
 *
 * `.page` places navigation, the identity block, the optional rail and
 * `<main>` by grid-area, which is what lets the layout rearrange without
 * changing the markup. The cost is that grid placement moves the picture and
 * not the document: anyone following the page by keyboard, by screen reader or
 * by switch gets the source order regardless of where the boxes landed.
 *
 * Below 62rem the visual order is navigation, identity, index, content: the
 * menu is the bar across the top of the page. The source used to be
 * navigation, identity, content, index — two separate disagreements, and on a
 * phone they read as one scramble: tab out of the menu and you are thrown back
 * up to the identity links, then fifteen hundred pixels down into the middle
 * of the article, then back up to the in-page index. Nothing on screen shows
 * it, and `pnpm check:responsive` measures boxes rather than sequence, so it
 * needs a test rather than a look.
 *
 * Above 62rem the menu sits under the identity inside the left column, so
 * those two swap on screen. That is the one place the order is not literal,
 * and it is the right way round for a reader who cannot see the column: the
 * site's navigation before the site's name. An index of a page belongs before
 * the page it indexes, wherever it is drawn.
 *
 * Matched on the source rather than on built HTML for the same reason as
 * test/single-emission.test.ts: no build step, and the failure is a line in
 * the file someone moved.
 */
const LAYOUT = new URL('../src/layouts/BaseLayout.astro', import.meta.url).pathname;
const source = readFileSync(LAYOUT, 'utf8');

/** The template only. Frontmatter mentions these names for other reasons. */
const template = source.slice(source.indexOf('---', 3) + 3);

/** Each grid area, and the first thing in the template that emits it. */
const AREAS = [
  { area: 'nav', pattern: /aria-label=["']Primary["']/ },
  { area: 'identity', pattern: /<Identity[\s/>]/ },
  { area: 'rail', pattern: /slot=["']rail["']|<slot name=["']rail["']/ },
  { area: 'main', pattern: /<main[\s/>]/ },
];

describe('BaseLayout emits the grid areas in reading order', () => {
  const found = AREAS.map(({ area, pattern }) => {
    const match = template.match(pattern);
    return { area, at: match?.index ?? -1 };
  });

  it.each(found)('emits $area', ({ area, at }) => {
    expect(at, `${area} is not emitted in the template`).toBeGreaterThanOrEqual(0);
  });

  it('orders them nav, identity, rail, main', () => {
    expect(found.map((entry) => entry.area)).toEqual(
      [...found].sort((a, b) => a.at - b.at).map((entry) => entry.area),
    );
  });
});

describe('BaseLayout names the identity block for what it is', () => {
  /*
    It was an <aside>, which is the complementary landmark - "tangentially
    related to the main content". This block is the site's identity on every
    page and on the home page it contains the <h1>, so a screen reader
    announced the page's only heading from inside a landmark that says to skip
    it. The rail beside the content is genuinely complementary and stays an
    <aside>.
  */
  it('does not wrap the identity in a complementary landmark', () => {
    const identity = template.slice(template.indexOf('<Identity') - 200, template.indexOf('<Identity'));
    expect(identity).not.toMatch(/<aside[^>]*$/);
  });

  it('wraps it in the banner landmark instead', () => {
    expect(template).toMatch(/<header[^>]*class=["']identity-column["']/);
  });
});

describe('the footer', () => {
  /*
    The address block is the only place the email appears, and it was plain
    text: on a phone the one action an academic site exists to support could
    not be tapped, only selected and copied out of fourteen-pixel grey type.
  */
  it('offers the email as a link rather than as characters to copy', () => {
    const footer = template.slice(template.indexOf('<footer'));
    expect(footer).toMatch(/href=\{`mailto:\$\{site\.email\}`\}/);
  });
});
