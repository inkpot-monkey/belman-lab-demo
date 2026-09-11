/**
 * The design, as tokens.
 *
 * Fonts, colours, a type and space scale, a few shape values. Everything else
 * the design does — its arrangement and its component variants — lives in
 * `styles/themes/a.css`. What stays out of both is content, routes and markup:
 * the design is a layer over the site, not a version of it.
 *
 * Design language is our own; the content model and some structural ideas are
 * adapted from MIT-licensed projects listed in CREDITS.md.
 */

export interface ThemeSpec {
  id: string;
  name: string;
  /** One line describing the intent. */
  description: string;
  /**
   * `mono` is optional: this design gives monospace no job beyond `<code>`, so
   * it says nothing and keeps the system stack.
   */
  fonts: { display: string; body: string; mono?: string };
  /** Utopia type scale, in px at each end of the viewport range. */
  type: { minBase: number; maxBase: number; minRatio: number; maxRatio: number };
  /** Base space step in px at each end. */
  space: { minBase: number; maxBase: number };
  /**
   * Colour tokens. Light only: the site has no dark palette, and a design that
   * only half-exists in the dark is not a design anyone can judge.
   */
  colors: Record<string, string>;
  /**
   * Non-colour, non-type structural choices.
   *
   * Three rule weights, not one. A design that draws structure with rules
   * needs to say which rule is which - `rule` divides rows inside a list,
   * `ruleStrong` opens a section, `ruleHeavy` closes a masthead. Written here
   * rather than as literal pixels in the stylesheet, because a weight repeated
   * twenty times in one file is a decision nobody can find to change.
   */
  shape: { radius: string; rule: string; ruleStrong: string; ruleHeavy: string; measure: string };
  /** What the design argues, and what it gives up. Surfaced on /how-this-works. */
  thesis?: string;
  saysAboutYou?: string;
  cost?: string;
  precedent?: string;
}

/*
 * Archivo, self-hosted and variable. One family does all the work here, so the
 * fallbacks are grotesques of a similar width and the page does not reflow
 * noticeably while the face loads.
 */
const GROTESQUE = "'Archivo Variable', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

export const THEMES: ThemeSpec[] = [
  {
    id: 'a',
    name: 'Record',
    description: 'Achromatic, gridded, one grotesque. The design stands behind the work.',
    fonts: { display: GROTESQUE, body: GROTESQUE },
    /*
     * One family, so the scale has to carry the hierarchy a second family
     * would otherwise carry: a wide ratio at the large end, against a body
     * size that stays put.
     */
    type: { minBase: 17, maxBase: 18, minRatio: 1.2, maxRatio: 1.333 },
    space: { minBase: 16, maxBase: 22 },
    /*
     * Achromatic, plus one vermilion. Every grey here is neutral - red, green
     * and blue equal - so the accent is the only hue on the page and therefore
     * always means something. `grid` is the gutter rule: quieter than `border`,
     * because it draws the structure rather than separating content.
     *
     * Vermilion is #d6320f rather than a brighter one so it clears 4.5:1 both
     * ways - as link text on the page, and as the ground under white.
     */
    colors: {
      bg: '#fafafa',
      surface: '#f0f0f0',
      text: '#171717',
      muted: '#5a5a5a',
      heading: '#000000',
      accent: '#d6320f',
      accentText: '#ffffff',
      border: '#c2c2c2',
      grid: '#e4e4e4',
    },
    shape: { radius: '0', rule: '1px', ruleStrong: '2px', ruleHeavy: '3px', measure: '60ch' },
    thesis:
      'The site is a record of the work, not an argument for it. One grotesque, a grid you can see, and colour used only where it carries information.',
    saysAboutYou:
      'That the science is the point and the reader’s time matters more than the lab’s personality. It reads as an institution rather than as a person.',
    cost:
      'Warmth, and memorability. Nothing here is recognisably yours: a visitor remembers the papers and not the page, and this is not a design anyone shares for its own sake. It is also the safe answer, so it has to be executed exactly right or it reads as a template.',
    precedent:
      'EMBL-EBI and Wellcome Sanger group pages; Müller-Brockmann’s grid systems, where rules and alignment do the work that decoration does elsewhere.',
  },
];

export const DEFAULT_THEME = THEMES[0]!.id;

/** Fallbacks for anything the design does not name a face for. */
export const FONT_STACKS = { mono: MONO };

/** Viewport range every fluid value interpolates across. */
export const VIEWPORT = { minViewport: 320, maxViewport: 1240 };

/**
 * Type scale steps: -1 for fine print up to 5 for a page title.
 *
 * There is deliberately no -2. It resolves to between 10px and 12px, which is
 * too small to read on a phone.
 */
export const TYPE_STEPS = [-1, 0, 1, 2, 3, 4, 5];

/** Named space multipliers of the base step. */
export const SPACE_STEPS: Record<string, number> = {
  '3xs': 0.25,
  '2xs': 0.5,
  xs: 0.75,
  s: 1,
  m: 1.5,
  l: 2,
  xl: 3,
  '2xl': 4,
  '3xl': 6,
};
