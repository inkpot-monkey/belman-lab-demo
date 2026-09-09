/**
 * The three design directions being compared.
 *
 * All three render the same markup and the same content: only tokens change.
 * That is what makes the runtime switcher honest — Sophie is comparing designs,
 * not three different sites.
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

const SERIF = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

export const THEMES: ThemeSpec[] = [
  {
    id: 'a',
    name: 'Classic academic',
    shortName: 'Classic',
    description: 'Serif, dense, restrained. Conservative and unmistakably scholarly.',
    fonts: { display: SERIF, body: SERIF },
    type: { minBase: 17, maxBase: 19, minRatio: 1.2, maxRatio: 1.25 },
    space: { minBase: 16, maxBase: 20 },
    colors: {
      bg: '#fffefb',
      surface: '#f7f5ef',
      text: '#23262d',
      muted: '#5d626e',
      heading: '#11131a',
      accent: '#7a2e2e',
      accentText: '#ffffff',
      border: '#e2ded2',
    },
    shape: { radius: '2px', rule: '1px', measure: '68ch' },
  },
  {
    id: 'b',
    name: 'Modern lab',
    shortName: 'Modern',
    description: 'Sans-serif, open, photo-forward. Reads as a contemporary research group.',
    fonts: { display: SANS, body: SANS },
    type: { minBase: 16, maxBase: 19, minRatio: 1.25, maxRatio: 1.333 },
    space: { minBase: 18, maxBase: 28 },
    colors: {
      bg: '#ffffff',
      surface: '#f2f6f8',
      text: '#2b333d',
      muted: '#5f6b78',
      heading: '#101820',
      accent: '#0d7d8c',
      accentText: '#ffffff',
      border: '#dde5ea',
    },
    shape: { radius: '12px', rule: '1px', measure: '72ch' },
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
