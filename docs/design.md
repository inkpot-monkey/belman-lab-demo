# The design

The site is set in one design, called **Record**. It was chosen from three
candidates; the other two and the switcher that compared them are gone, and
this is the record of what was picked and why.

## What it argues

The site is a record of the work, not an argument for it. One grotesque, a grid
you can see, and colour used only where it carries information.

**What it says about the lab.** That the science is the point and the reader's
time matters more than the lab's personality. It reads as an institution rather
than as a person.

**What it costs.** Warmth, and memorability. Nothing here is recognisably hers:
a visitor remembers the papers and not the page, and this is not a design
anyone shares for its own sake. It is also the safe answer, so it has to be
executed exactly right or it reads as a template. Every rule below is part of
executing it right.

**Where it comes from.** EMBL-EBI and Wellcome Sanger group pages;
Müller-Brockmann's grid systems, where rules and alignment do the work that
decoration does elsewhere.

---

## 1. Tokens — `src/lib/design.ts`

`DESIGN` is one face, a Utopia type scale, a space scale, a colour set and five
shape values. `src/components/Tokens.astro` turns it into custom properties on
`:root`.

Nothing that belongs there belongs in a stylesheet. A literal `2px` or
`#f0f0f0` in `design.css` is a value that wants to be a token — that is what
happened to the rule weights, which lived as nineteen copies of `2px` and `3px`
before becoming `ruleStrong` and `ruleHeavy`.

| Token group | Emitted as | Notes |
| --- | --- | --- |
| `fonts` | `--font-display`, `--font-body`, `--font-mono` | One family, Archivo, doing both jobs; mono is the system stack, for `<code>` |
| `type` | `--step--1` … `--step-5` | Fluid, interpolating over 320–1240px. No `-2`: it resolves under 12px |
| `space` | `--space-3xs` … `--space-3xl` | Multiples of one fluid base step |
| `colors` | `--color-<name>` | Light only. Every grey is neutral, so the one hue always means something. Three draw lines, against different thresholds: `grid` is structure, `border` groups, `linkRule` identifies a control and so clears 3:1 |
| `shape` | `--radius`, `--rule`, `--rule-strong`, `--rule-heavy`, `--measure` | Three rule weights: divide a row, open a section, close a masthead |

The accent is `#7b4b8a` — the favicon's colour, and the colour of the site she
had before this one, so a tab strip and a browser history still recognise her.
It is also reserved. In prose it marks the one word in a sentence that goes
somewhere; in a list where every entry is a link, colouring them all would say
nothing, so those take the heading colour with a grey underline and turn
lavender only under the cursor.

## 2. Arrangement — `base.css` and `design.css`

`base.css` declares the layer order once, and the grid:

```css
@layer reset, base, layout, components, utilities;
```

`design.css` extends those same layers and is imported after it. The split is
by what a rule is about, not by which file got there first: `base.css` is the
reset, the shared components and the default single-column arrangement;
`design.css` is every choice this design made.

`.page` has four named areas — `nav`, `identity`, `main` and an optional
`rail`. Navigation, the identity block and `<main>` are emitted exactly once, in
`BaseLayout`, and placed by grid-area, so the layout changes where things sit
without changing the markup. They are emitted in the order a reader meets them
— nav, identity, rail, main — because grid placement moves the picture and not
the document, and a keyboard or a screen reader gets the source order at every
width. Above 62rem the menu sits under the identity inside the left column, so
those two swap on screen; that is the one place the order is not literal, and
the site's navigation before the site's name is the right way round for a
reader who cannot see the column.

Three arrangements, not two:

```
Below 40rem              40rem to 62rem            62rem and up

├───────────────┤        ┌──────────┬─────┐        ┌────────┬──────┬──────┐
│  nav (a bar)  │        │ identity │ nav │        │identity│ main │ rail │
├═══════════════┤        ├──────────┴─────┤        ├────────┤      │      │
│   identity    │        │  rail (strip)  │        │  nav   │      │      │
├───────────────┤        ├────────────────┤        └────────┴──────┴──────┘
│  rail (strip) │        │      main      │
├───────────────┤        └────────────────┘        14rem / 1fr / 13rem
│     main      │
└───────────────┘        1fr / auto
```

Narrow, the menu is a bar across the top and is drawn as one: it bleeds past
the page's margin to both edges of the screen and up over its top padding, its
items are spread across the full width, and a heavy rule closes it off from
everything under it. Stacked in the middle of the chrome it was a row of
tracked capitals directly under another row of tracked capitals — the identity
links — and nothing said which of them was the site's navigation. A rule that
stops where the text column stops divides two blocks of a page; a rule that
runs edge to edge is the floor of a band, and that is what a reader already
knows how to name. The tracking tightens to 0.04em there, because at 320px the
three items otherwise come to 289px inside 272px and wrap, and a bar whose last
item has dropped onto a line of its own is not a bar.

The middle one exists because the module needs 62rem and a second column needs
far less: a tablet held upright was drawing a full-width identity with half the
screen empty beside it and the page's own title most of a screen down. There
the identity keeps the fraction and the menu takes what it needs, so the rule
closing the strapline stops short of the menu — two rules of two lengths, which
is the module's argument arriving early. The home page opts out and keeps the
stack, because there the identity is the row rather than a label beside a menu.

**A band only owns its widths if the cascade lets it.** A media query does not
change specificity, so a rule qualified with `:has()` inside the 40rem block
goes on beating the plain `.page` at 62rem for as long as the page is wide. The
exceptions inside that block are therefore wrapped in `:where()`, which
contributes nothing, and source order does the rest. Getting this wrong is
silent: `grid-template-areas` named three columns while `grid-template-columns`
sized one, the browser invented the other two at 0px, and the home page drew a
99px-wide `<main>` on a desktop with every test still green.

Two things stop it reading as the default serious-website answer:

- **The module stays put across every page.** The third column exists whether
  or not there is an index to put in it, and a page with no index widens its
  content into it rather than moving the first two columns. The left edge of
  the text never shifts as you move around the site.
- **The home page spends its whole first row on a strapline** instead of a
  hero, so the first thing read is who this is and what she does. It is the one
  page whose subject is the person, which is also why its name is the `<h1>` —
  `identityIsHeading` in `BaseLayout`, and `:has(h1.identity__name)` is what
  the stylesheet reads to find it.

The gutters are drawn rather than implied: the hairline sits in the middle of
the gutter, so each column is pulled half a gutter left and pads the same amount
back, and the text lands exactly where the grid puts it. Below 62rem there is
one column and so no gutter to draw: the motif is a desktop one, and the narrow
arrangement says the same thing with the bar across its top and the rules that
open and close each block under it.

The `rail` slot is the one piece of page structure a page cannot write from
inside `<main>`, because it is a sibling of it in that grid. It is filled
through `BaseLayout`'s named slot and rendered only when a page fills it.

## 3. Naming — one element, one fact

Most of what the design does is not new markup. It is an element named
precisely enough to be styled for what it is: `.pub__year` is a paper's year
lifted out of its citation, and it is railed down a 4rem margin. `.dateline` is
the date on a dated page, and it is a tracked label over a rule.
`.person__placeholder` says an entry is not a real person, and it is set in
tracked capitals.

Emit the fact once, in real text, and style it. Reaching the same element
positionally instead — `p:first-of-type`, `p:last-of-type` — is how this goes
wrong, and it broke the moment a third paragraph appeared.

## Invariants

Anything here that a change would break is pinned by a test or a checker.

- **One `<nav>`, one identity block, one `<main>`, one `<h1>` per page** —
  `test/single-emission.test.ts` and `pnpm check:responsive`.
- **The measure constrains prose, not the column.** `--measure` applies to
  paragraphs and headings, never to a grid container: applying it to the
  container squeezes the card lists.
- **Every page works at 320px first.** `pnpm check:responsive` drives a real
  browser over every page and viewport: standing controls ≥44px, body text
  ≥16px on mobile, nothing under 12px, no sideways scroll, the first heading on
  the page is the `<h1>`, and `.page` sizes every column its areas name.
- **Light only.** There is no dark palette and no `light-dark()` outside
  `src/admin/`, which is a tool surface rather than part of this design.
- **No parallel stylesheet, no colour literals, no hardcoded type or space.**
