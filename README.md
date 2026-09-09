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

Then open <http://localhost:4321>. The design switcher is fixed to the bottom
right of every page.

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

**Three themes, one markup.** `src/lib/themes.ts` holds the three designs as
token sets — fonts, colours, a Utopia type and space scale, and a few
structural choices. `src/components/Tokens.astro` emits all three, scoped to a
`data-theme` attribute. No theme has its own stylesheet, which is what keeps the
switcher cheap.

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
