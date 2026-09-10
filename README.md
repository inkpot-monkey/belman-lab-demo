# Belman Lab site — design demo

Three candidate designs for a research group site, rendered over one content
model and real content, with a runtime switcher so they can be compared without
losing your place.

This is a **demo repository**. It exists to choose a design. The winning design
moves into `sophbel/sophbel.github.io`; this repo then gets archived.

## Running it

```sh
direnv allow      # or: nix develop
pnpm install
pnpm dev
```

Then open <http://localhost:4321>. The design switcher is a collapsible panel
in the bottom-right corner of every page. It holds the three candidates and,
under a second heading, the three token-only designs the demo started from, so
what the identity work bought is one click away rather than an argument.

| Command | Does |
| --- | --- |
| `pnpm dev` | Regenerate the CMS config, vendor Sveltia, start the dev server |
| `pnpm build` | Same, then build to `dist/` |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm sync:orcid` | Re-fetch the ORCID snapshot |
| `pnpm check:responsive` | Drive a real browser over every page, viewport and theme (needs `pnpm preview` running) |

## How it fits together

**One content spec, two derivations.** `src/schema/collections.ts` describes
every collection once. `src/content.config.ts` turns it into Zod schemas that
fail the build on a bad entry, and `scripts/generate-cms-config.ts` turns it
into `public/admin/config.yml`, which decides what the CMS form offers. The CMS
cannot offer a field the build would reject.

**Six designs, one markup.** `src/lib/themes.ts` holds each design's tokens —
fonts, colours, a Utopia type and space scale, a few shape values — and
`src/components/Tokens.astro` emits all of them, scoped to a `data-theme`
attribute. Beyond tokens, each of the three candidates has its own stylesheet in
`src/styles/themes/`, extending the same cascade layers `base.css` declares, so
a design can change arrangement and component detail rather than only tint. The
three starting points have no stylesheet, which is the comparison: tokens over
one shared arrangement against tokens plus a grammar of their own.
What stays shared is the content, the routes and the markup, which is what the
switcher relies on: it swaps an attribute, never a page.

Navigation, the identity block and `<main>` are each emitted exactly once, in
`BaseLayout`. `test/single-emission.test.ts` pins that, because a per-design copy of one of them would put two "Primary"
landmarks and every link twice into every page. Where a design needs markup the
others do not have, it comes from `src/components/Themed.astro`, which ships
every variant and lets the active design's stylesheet reveal its own. Hidden by
default and revealed by name: the three starting points have no stylesheet, and
shown-unless-hidden would give them every variant at once.

`docs/theme-architecture.md` is the fuller version: the five levers a design
has, in the order you would reach for them, and the invariants that hold across
all six.

**Publications come from ORCID.** `pnpm sync:orcid` writes
`src/data/orcid-snapshot.json`; the build reads only that file, so builds are
reproducible and work offline. `src/lib/orcid.ts` handles presentation —
repairing titles that Crossref mangled, and linking preprints to their published
versions.

**Events and gallery are fixtures.** `src/data/fixtures/` holds data shaped
exactly like `@palebluebytes/cms` returns, so wiring the real Google Calendar
and Drive folder later is a one-line swap for `fetchEvents()` / `fetchPhotos()`.

## What is real and what is not

| Real | Placeholder |
| --- | --- |
| Home and Research prose | Everyone on the team except Sophie |
| Publications (live ORCID record) | News, Projects |
| Site details, footer, links | Events, Gallery |

The publications page deliberately shows the ORCID record **as it currently
stands**, which is missing at least six papers including a Lancet Microbe
article. That gap is visible on purpose.

## Deployment

GitHub Actions builds and deploys to GitHub Pages. There is no server, no
Cloudflare Worker, and no platform-specific code — `dist/` is plain static
files. See `.github/workflows/deploy.yml`.

## Editing

See [docs/cms-access.md](docs/cms-access.md).
