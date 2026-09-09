# AGENTS.md

A demo repository. It exists so one person can choose between three candidate
designs for her lab site; the winner moves to `sophbel/sophbel.github.io` and
this repo is archived. `README.md` describes how the pieces fit together.

## Working here

- **Run commands through `nix develop -c <command>`.** The devShell pins pnpm,
  Node and the chromium that `pnpm check:responsive` drives.
- **Commit straight onto `main`, one self-contained change per commit.** This
  overrides the usual branch-first default. Every push touching `src/**`
  deploys, which is the point: each step goes live as it lands.
- **Verify with `pnpm build`, `pnpm test` and `pnpm typecheck`**, plus
  `pnpm check:responsive`, which needs `pnpm preview` already running.

## Facts you cannot read off the code

- **`data-theme` names which of the three designs is showing, not a colour
  mode.** The site is light-only and has no dark palette. `src/admin/` is the
  exception: the CMS shell is a tool surface and keeps its own `light-dark()`
  pairs.
- **`src/schema/collections.ts` is the single source for the content model.**
  It generates both the Zod schema and `public/admin/config.yml`; commit the
  regenerated config alongside any change to it.
- **Publications come from `src/data/orcid-snapshot.json`**, a committed
  snapshot. Only `pnpm sync:orcid` talks to ORCID, so builds are reproducible
  and work offline.
- **Placeholder content stays visibly fake.** Stand-in people are named "PhD
  Student Name" and carry a `placeholder` flag so the site can label them.
  Real content is real: it comes from her ORCID record, her GitHub account or
  her own words.

## The design work

`docs/theme-identity-brief.md` is the plan for giving each of the three
designs an identity of its own — typography, palette, layout grammar, hero
treatment, motif and publications dialect, none of them shared. Read it before
any theme work: a run ("run A", "run B", "run C"), the identity statements on
`/how-this-works`, or the design-review gate. It carries the shared constraint
block every run is prefixed with, and the six-axis non-overlap matrix that
stops the three converging on the same safe answers.
