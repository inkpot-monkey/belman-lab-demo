/**
 * The three design directions being compared.
 *
 * Each is a token set here — fonts, colours, a type and space scale, a few
 * shape values — and each also has its own stylesheet in `styles/themes/`,
 * where its arrangement and its component variants live. What all three share
 * is the content, the routes and the markup: that is what makes the runtime
 * switcher honest — Sophie is comparing designs, not three different sites.
 *
 * Design language is our own; the content model and some structural ideas are
 * adapted from MIT-licensed projects listed in CREDITS.md.
 */

export interface ThemeSpec {
  id: string;
  name: string;
  /** One word, for the switcher on a screen too narrow for the full name. */
  shortName: string;
  /** One line shown in the switcher explaining the intent. */
  description: string;
  fonts: { display: string; body: string };
  /** Utopia type scale, in px at each end of the viewport range. */
  type: { minBase: number; maxBase: number; minRatio: number; maxRatio: number };
  /** Base space step in px at each end. */
  space: { minBase: number; maxBase: number };
  /**
   * Colour tokens. Light only: `data-theme` selects which of the three designs
   * is showing, so it cannot also carry a colour mode, and a design that only
   * half-exists in the dark is not a design anyone can judge.
   */
  colors: Record<string, string>;
  /** Non-colour, non-type structural choices. */
  shape: { radius: string; rule: string; measure: string };
  /**
   * The identity statement, written when the direction gets one and surfaced
   * on /how-this-works. Optional because a theme has none until its own run
   * lands; three sales pitches would not help her choose, so `cost` — what she
   * gives up by picking this one — is the field that earns the page.
   */
  thesis?: string;
  saysAboutYou?: string;
  cost?: string;
  precedent?: string;
}

/*
 * Archivo, self-hosted and variable, for the design that uses one family
 * strictly. The fallbacks are grotesques of a similar width, so the page does
 * not reflow noticeably while the face loads.
 */
const GROTESQUE = "'Archivo Variable', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/*
 * Fraunces over Instrument Sans, for the design that sets a headline against a
 * body face. Fraunces is loaded from its optical-size build, so one file
 * covers a 110px cover line and a 13px caption and each is drawn for the size
 * it is set at - `font-optical-sizing: auto` does that on its own, with no
 * `font-variation-settings` anywhere.
 *
 * The fallbacks matter more here than in a one-family design: a display serif
 * that falls back to a sans changes the page's whole argument, so the chain
 * stays serif the whole way down.
 */
const DISPLAY_SERIF = "'Fraunces Variable', 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
const EDITORIAL_SANS = "'Instrument Sans Variable', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const SERIF = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

export const THEMES: ThemeSpec[] = [
  {
    id: 'a',
    name: 'Record',
    shortName: 'Record',
    description: 'Achromatic, gridded, one grotesque. The design stands behind the work.',
    fonts: { display: GROTESQUE, body: GROTESQUE },
    /*
     * One family, so the scale has to carry the hierarchy a second family
     * would otherwise carry: a wider ratio at the large end than the other two
     * designs use, against a body size that stays put.
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
     * ways - as link text on the page, and as the ground under white in the
     * demo banner and the preprint tag.
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
    shape: { radius: '0', rule: '1px', measure: '60ch' },
    thesis:
      'The site is a record of the work, not an argument for it. One grotesque, a grid you can see, and colour used only where it carries information.',
    saysAboutYou:
      'That the science is the point and the reader’s time matters more than the lab’s personality. It reads as an institution rather than as a person.',
    cost:
      'Warmth, and memorability. Nothing here is recognisably yours: a visitor remembers the papers and not the page, and this is not a design anyone shares for its own sake. It is also the safe answer, so it has to be executed exactly right or it reads as a template.',
    precedent:
      'EMBL-EBI and Wellcome Sanger group pages; Müller-Brockmann’s grid systems, where rules and alignment do the work that decoration does elsewhere.',
  },
  {
    id: 'b',
    name: 'Feature',
    shortName: 'Feature',
    description: 'A display serif over an editorial sans, her lavender kept. The science gets told, not listed.',
    fonts: { display: DISPLAY_SERIF, body: EDITORIAL_SANS },
    /*
     * The widest scale of the three. A magazine's argument is made by the
     * distance between a cover line and the body text under it, so the large
     * end runs to a 110px step-5 while step-0 stays at a comfortable reading
     * size - about six times the body, against Record's three.
     */
    type: { minBase: 17, maxBase: 19, minRatio: 1.2, maxRatio: 1.42 },
    /* Margins are the other half of it: the most generous space base here. */
    space: { minBase: 16, maxBase: 30 },
    /*
     * Warm off-white rather than white, and her existing lavender carried
     * forward - this is the one direction that keeps continuity with the site
     * she has, so that continuity is something she chooses rather than
     * something she loses. `#7b4b8a` is her accent, unchanged.
     *
     * Two tints, not one: `surface` is the quiet panel, `wash` the stronger
     * lavender that mounts a figure and backs an annotation. Both are warm -
     * neutral greys next to this ground read as dirty.
     */
    colors: {
      bg: '#faf6f1',
      surface: '#f4ecf2',
      wash: '#eddfe9',
      text: '#3a3038',
      muted: '#6b5f68',
      heading: '#1f151f',
      accent: '#7b4b8a',
      accentText: '#ffffff',
      border: '#cbb8c6',
    },
    /*
     * Square, like print. Rounding is the one shape choice all three designs
     * happen to agree on, and inventing a radius here to look different from
     * Record would be a difference nobody asked for: this design separates
     * itself by type, colour and column, not by corners.
     */
    shape: { radius: '0', rule: '1px', measure: '64ch' },
    thesis:
      'The site tells the science rather than listing it. A question in display type carries the page, a published figure carries the evidence, and every image says where it came from.',
    saysAboutYou:
      'That you can explain what you work on to someone who does not already know, and that you think that is worth the space. It reads as a person with an argument rather than as a department.',
    cost:
      'Editing time, forever. A question has to be written and rewritten as the work moves, figures have to be chosen and captioned, and a stale feature looks worse than a stale list. It is also the least neutral of the three: a design with a voice can be disagreed with, and it dates faster than a record does.',
    precedent:
      'Quanta and Nautilus; the front of a journal issue, where the contents page ranks the work and the figure is the argument.',
  },
  {
    id: 'c',
    name: 'Editorial scientific',
    shortName: 'Editorial',
    description: 'Serif display against sans body, with her lavender carried forward.',
    fonts: { display: SERIF, body: SANS },
    type: { minBase: 16, maxBase: 20, minRatio: 1.25, maxRatio: 1.414 },
    space: { minBase: 16, maxBase: 26 },
    colors: {
      bg: '#fdfcfe',
      surface: '#f6f1f8',
      text: '#3a3440',
      muted: '#6b6375',
      heading: '#1d1823',
      accent: '#7b4b8a',
      accentText: '#ffffff',
      border: '#e7dfeb',
    },
    shape: { radius: '4px', rule: '2px', measure: '66ch' },
  },
];

export const DEFAULT_THEME = THEMES[0]!.id;

export const FONT_STACKS = { serif: SERIF, sans: SANS, mono: MONO };

/** Viewport range every fluid value interpolates across. */
export const VIEWPORT = { minViewport: 320, maxViewport: 1240 };

/**
 * Type scale steps: -1 for fine print up to 5 for a page title.
 *
 * There is deliberately no -2. It resolves to between 10px and 12px depending
 * on the theme, which is too small to read on a phone.
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
