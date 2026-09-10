/**
 * Drive a real browser over every page, viewport and theme.
 *
 * Written because static review missed three genuine bugs: a media query that
 * lost to a more specific selector, text resolving to under 12px on a phone,
 * and a fixed control covering nearly half a small screen. None of them are
 * visible in the source.
 *
 * The type floors are split: fine print may go to 12px, body text on a phone
 * may not go under 16px, and anything landing between the two is reported as
 * well, because that is where a design shrinks running text by hand.
 *
 * Needs a running preview server and a chromium binary:
 *   pnpm build && pnpm preview &
 *   pnpm check:responsive
 *
 * `nix develop` provides chromium; CHROMIUM overrides the path.
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
// The designs, read from the one place they are declared. A fourth direction
// added to `themes.ts` is a fourth direction this checker drives, without
// anyone remembering to widen a list here.
import { THEMES as THEME_SPECS } from '../src/lib/themes.ts';

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
const THEMES = THEME_SPECS.map((theme) => theme.id);

/*
 * Three floors, not one.
 *
 * 12px is the floor for fine print - captions, credits, publication metadata -
 * and it was never meant as a licence to set body text at 13. On a phone,
 * running text under 16px is text people pinch to read, so body text gets its
 * own floor and anything that lands between the two is flagged as an ad-hoc
 * shrink rather than a deliberate step on the scale.
 *
 * Touch targets go to 44px, which is the size a thumb actually hits; 40 was a
 * guess, and the switcher was already sized past it.
 */
const MIN_FINE_PX = 12;
const MIN_BODY_PX = 16;
const MIN_TOUCH_PX = 44;
/** Under this width the visitor is holding the page, and the floors apply. */
const MOBILE_MAX_PX = 700;

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const problems = [];

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await ctx.addInitScript((t) => localStorage.setItem('demo-theme', t), theme);
    /*
      The switcher is a disclosure that remembers whether it was left open, and
      the target pass below opens it. Clearing the key on every navigation puts
      each page back to the state a first-time visitor sees, which is the state
      the covered-area check is about.
    */
    await ctx.addInitScript(() => localStorage.removeItem('demo-switcher'));
    const page = await ctx.newPage();

    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      const r = await page.evaluate(
        ({ minFine, minBody }) => {
          const de = document.documentElement;
          /*
            Resolve a type step for the design that is showing. The custom
            property computes to an unresolved `clamp()`, so it has to be
            measured on a real element rather than read off :root.
          */
          const stepPx = (token) => {
            const probe = document.createElement('span');
            probe.style.cssText = `position:absolute;visibility:hidden;font-size:var(${token})`;
            document.body.append(probe);
            const px = parseFloat(getComputedStyle(probe).fontSize);
            probe.remove();
            return px;
          };
          const finePx = stepPx('--step--1');
          const bodyPx = stepPx('--step-0');
          const offenders = [...document.querySelectorAll('body *')]
            .filter((el) => {
              const b = el.getBoundingClientRect();
              return b.width > 0 && (b.right > de.clientWidth + 1 || b.left < -1);
            })
            .slice(0, 4)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0] || '-'}`);
          const sw = document.querySelector('.switcher')?.getBoundingClientRect();
          const sizes = [...document.querySelectorAll('p, li, td, dd, span')]
            .map((el) => parseFloat(getComputedStyle(el).fontSize))
            .filter((size) => size > 0);
          return {
            overflow: de.scrollWidth > de.clientWidth + 1,
            offenders,
            h1: document.querySelectorAll('h1').length,
            finePx,
            bodyPx,
            tiny: sizes.filter((size) => size < minFine).length,
            // Neither body text nor the fine-print step, but under the body
            // floor: something shrank text by hand rather than by scale.
            shrunk: sizes.filter((size) => size < minBody && size > finePx + 0.5).length,
            switcherFraction: sw ? sw.width * sw.height / (de.clientWidth * innerHeight) : 0,
          };
        },
        { minFine: MIN_FINE_PX, minBody: MIN_BODY_PX },
      );

      /*
        The switcher's two states answer two different questions. How much of
        the screen it covers is about the state it is left in, which is what the
        pass above measured. Whether its controls are thumb-sized is about the
        state it is opened to, so this pass opens it first - a control that is
        too small to hit is no less too small for being hidden a moment ago.
      */
      const smallTargets = await page.evaluate(
        ({ minTouch }) => {
          const panel = document.querySelector('.switcher__panel');
          if (panel) panel.open = true;
          // An input wrapped in a label is not the target - the label is, and
          // it is what a thumb actually hits.
          return [...document.querySelectorAll('.switcher :is(a, button, label, input, summary)')]
            .filter((el) => !(el.tagName === 'INPUT' && el.closest('label')))
            .filter((el) => {
              const b = el.getBoundingClientRect();
              return b.width > 0 && b.height > 0 && b.height < minTouch;
            })
            .map((el) => `${el.tagName.toLowerCase()} ${Math.round(el.getBoundingClientRect().height)}px`);
        },
        { minTouch: MIN_TOUCH_PX },
      );

      const where = `${vp.name}/${theme}${path}`;
      const mobile = vp.width < MOBILE_MAX_PX;
      if (r.overflow) problems.push(`${where}: scrolls sideways (${r.offenders.join(', ')})`);
      if (r.h1 !== 1) problems.push(`${where}: ${r.h1} h1 elements`);
      if (r.tiny > 0) problems.push(`${where}: ${r.tiny} elements under ${MIN_FINE_PX}px`);
      if (mobile && r.bodyPx < MIN_BODY_PX) {
        problems.push(`${where}: body text resolves to ${r.bodyPx.toFixed(1)}px, under the ${MIN_BODY_PX}px floor`);
      }
      if (mobile && r.shrunk > 0) {
        problems.push(`${where}: ${r.shrunk} elements between the fine-print step (${r.finePx.toFixed(1)}px) and the ${MIN_BODY_PX}px body floor`);
      }
      if (r.switcherFraction > 0.25) problems.push(`${where}: switcher covers ${Math.round(r.switcherFraction * 100)}%`);
      if (mobile && smallTargets.length > 0) problems.push(`${where}: small touch targets (${smallTargets.join(', ')})`);
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
