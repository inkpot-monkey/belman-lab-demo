/**
 * Drive a real browser over every page, viewport and theme.
 *
 * Written because static review missed three genuine bugs: a media query that
 * lost to a more specific selector, text resolving to under 12px on a phone,
 * and a fixed control covering nearly half a small screen. None of them are
 * visible in the source.
 *
 * Needs a running preview server and a chromium binary:
 *   pnpm build && pnpm preview &
 *   pnpm check:responsive
 *
 * `nix develop` provides chromium; CHROMIUM overrides the path.
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:4321';
const EXEC = process.env.CHROMIUM ?? execSync('command -v chromium || true').toString().trim();
if (!EXEC) {
  console.error('No chromium found. Set CHROMIUM=/path/to/chromium, or run inside `nix develop`.');
  process.exit(1);
}

const VIEWPORTS = [
  { name: 'small-phone', width: 320, height: 568 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const PAGES = ['/', '/research/', '/team/', '/publications/', '/software/', '/projects/', '/news/', '/events/', '/gallery/', '/how-this-works/', '/404.html'];
const THEMES = ['a', 'b', 'c'];

/** Smallest comfortable body text, and the smallest comfortable touch target. */
const MIN_FONT_PX = 12;
const MIN_TOUCH_PX = 40;

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const problems = [];

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await ctx.addInitScript((t) => localStorage.setItem('demo-theme', t), theme);
    const page = await ctx.newPage();

    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      const r = await page.evaluate(
        ({ minFont, minTouch }) => {
          const de = document.documentElement;
          const offenders = [...document.querySelectorAll('body *')]
            .filter((el) => {
              const b = el.getBoundingClientRect();
              return b.width > 0 && (b.right > de.clientWidth + 1 || b.left < -1);
            })
            .slice(0, 4)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0] || '-'}`);
          const sw = document.querySelector('.switcher')?.getBoundingClientRect();
          // An input wrapped in a label is not the target - the label is, and
          // it is what a thumb actually hits.
          const smallTargets = [...document.querySelectorAll('a, button, label, input')]
            .filter((el) => el.closest('.switcher'))
            .filter((el) => !(el.tagName === 'INPUT' && el.closest('label')))
            .filter((el) => {
              const b = el.getBoundingClientRect();
              return b.width > 0 && b.height > 0 && b.height < minTouch;
            })
            .map((el) => `${el.tagName.toLowerCase()} ${Math.round(el.getBoundingClientRect().height)}px`);
          return {
            overflow: de.scrollWidth > de.clientWidth + 1,
            offenders,
            h1: document.querySelectorAll('h1').length,
            tiny: [...document.querySelectorAll('p, li, td, dd, span')]
              .map((el) => parseFloat(getComputedStyle(el).fontSize))
              .filter((s) => s > 0 && s < minFont).length,
            switcherFraction: sw ? sw.width * sw.height / (de.clientWidth * innerHeight) : 0,
            smallTargets,
          };
        },
        { minFont: MIN_FONT_PX, minTouch: MIN_TOUCH_PX },
      );

      const where = `${vp.name}/${theme}${path}`;
      if (r.overflow) problems.push(`${where}: scrolls sideways (${r.offenders.join(', ')})`);
      if (r.h1 !== 1) problems.push(`${where}: ${r.h1} h1 elements`);
      if (r.tiny > 0) problems.push(`${where}: ${r.tiny} elements under ${MIN_FONT_PX}px`);
      if (r.switcherFraction > 0.25) problems.push(`${where}: switcher covers ${Math.round(r.switcherFraction * 100)}%`);
      if (vp.width < 700 && r.smallTargets.length > 0) problems.push(`${where}: small touch targets (${r.smallTargets.join(', ')})`);
    }
    await ctx.close();
  }
}

await browser.close();

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`No problems across ${VIEWPORTS.length} viewports x ${THEMES.length} themes x ${PAGES.length} pages.`);
