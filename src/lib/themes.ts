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
  /**
   * `mono` is optional: it is the one design that gives monospace a job beyond
   * `<code>` that needs a real face for it, and a theme that says nothing
   * keeps the system stack.
   */
  fonts: { display: string; body: string; mono?: string };
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
  /**
   * Non-colour, non-type structural choices.
   *
   * Three rule weights, not one. A design that draws structure with rules
   * needs to say which rule is which - `rule` divides rows inside a list,
   * `ruleStrong` opens a section, `ruleHeavy` closes a masthead - and a design
   * that draws structure some other way sets all three to the same hairline
   * and says that instead. Written here rather than as literal pixels in the
   * stylesheets, because a weight repeated twenty times in one file is a
   * decision nobody can find to change.
   */
  shape: { radius: string; rule: string; ruleStrong: string; ruleHeavy: string; measure: string };
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

const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

/*
 * IBM Plex Sans with Source Code Pro, for the design where monospace is not a
 * code style but the voice metadata is written in. The mono partner comes from
 * a different family because Plex Mono has no variable cut - which is a
 * mismatch worth knowing about: Source Code Pro is a little narrower and a
 * little larger on the body than Plex Mono, so the two faces are set at the
 * same step and left alone rather than optically corrected.
 *
 * The mono fallback chain keeps the system monospace stack behind it, because
 * a metadata rail that falls back to a proportional face stops being a rail.
 */
const PLEX_SANS = "'IBM Plex Sans Variable', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const SOURCE_MONO = `'Source Code Pro Variable', ${MONO}`;

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
    shape: { radius: '0', rule: '1px', ruleStrong: '2px', ruleHeavy: '3px', measure: '64ch' },
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
    name: 'Instrument',
    shortName: 'Instrument',
    description: 'Monospaced identifiers against a humanist sans, on a labelled panel. The site is something the lab keeps.',
    fonts: { display: PLEX_SANS, body: PLEX_SANS, mono: SOURCE_MONO },
    /*
     * The narrowest scale of the three, and deliberately so. Hierarchy here
     * comes from weight, case, colour and rules; a page title is about twice
     * the body rather than Record's four times or Feature's six, so nothing on
     * the page shouts and the data is the largest thing on it.
     */
    type: { minBase: 16.5, maxBase: 17.5, minRatio: 1.14, maxRatio: 1.19 },
    /* And the tightest spacing. Compression is the point: this is a panel. */
    space: { minBase: 14, maxBase: 16 },
    /*
     * Cool near-monochrome, and one accent lifted straight out of viridis - the
     * colormap this field plots its data in. That is the colour idea: the one
     * hue on the page is a hue the reader has already seen on a figure, so it
     * belongs to the work rather than being picked to look like something.
     *
     * `#365c8d` is the third stop of eight-class viridis. It clears 4.5:1 both
     * ways - as link text on the ground, and as the ground under white in the
     * demo banner - which the teal and green stops further along the ramp do
     * not, so the accent is the darkest stop that is still recognisably the
     * colormap.
     *
     * Three rule colours at one width, because the rules do all the dividing
     * here and a single weight flattens every list into every other one:
     * `heading` opens a block, `border` closes a heading, `hairline` separates
     * the rows inside. A page of uniformly pale rules reads as unfinished
     * rather than as restrained, which is the trap this design walks into if
     * every line on it is the same grey.
     */
    colors: {
      bg: '#f6f7f9',
      surface: '#eceef1',
      text: '#1b2024',
      muted: '#576068',
      heading: '#0b0f12',
      accent: '#365c8d',
      accentText: '#ffffff',
      border: '#98a2ab',
      hairline: '#ccd3d9',
    },
    /*
     * Nothing is rounded, and the rules are hairlines. The measure is the
     * widest of the three because this design's content column is the
     * narrowest: the page is held to 74rem rather than 78 and the rail takes
     * 15 of them, so 70ch fills the column instead of leaving a band of empty
     * width the section rules point into.
     */
    shape: { radius: '0', rule: '1px', ruleStrong: '1px', ruleHeavy: '1px', measure: '70ch' },
    thesis:
      'The site is an instrument the lab keeps, not a brochure about it. Monospace carries every identifier and every identifier is labelled with the field it came from, hairline rules do all the dividing, software and data sit in the menu beside publications, and each page says which file it is written in and which commit built it.',
    saysAboutYou:
      'That the work is reproducible and that you expect to be checked. It reads as a working group with an output rather than as a person with a profile — closer to a Nextstrain build page than to a university site.',
    cost:
      'Warmth, and the widest audience. Nothing on the page is large, so nothing reaches a visitor who is not already looking for you, and the machinery it puts on show — file paths, commit hashes, an ORCID iD — means nothing to a reader outside research and reads as cold to one inside it. The identity panel is also repeated at full height on every page, which is a plate on an instrument and a lot of chrome above the content on a phone.',
    precedent:
      'Nextstrain and bedford.io; Tufte on data-ink, where the ornament is removed until only the measurement is left.',
  },
];

export const DEFAULT_THEME = THEMES[0]!.id;

/** Fallbacks for anything a design does not name a face for. */
export const FONT_STACKS = { mono: MONO };

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
