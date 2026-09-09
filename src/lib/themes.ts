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
  /** One line shown in the switcher explaining the intent. */
  description: string;
  fonts: { display: string; body: string };
  /** Utopia type scale, in px at each end of the viewport range. */
  type: { minBase: number; maxBase: number; minRatio: number; maxRatio: number };
  /** Base space step in px at each end. */
  space: { minBase: number; maxBase: number };
  /**
   * Colour tokens. Each value is a `light-dark()` pair so the OS preference
   * drives the mode, exactly as her current site does.
   */
  colors: Record<string, [light: string, dark: string]>;
  /** Non-colour, non-type structural choices. */
  shape: { radius: string; rule: string; measure: string; navStyle: 'sidebar' | 'top' };
}

const SERIF = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

export const THEMES: ThemeSpec[] = [
  {
    id: 'a',
    name: 'Classic academic',
    description: 'Serif, dense, restrained. Conservative and unmistakably scholarly.',
    fonts: { display: SERIF, body: SERIF },
    type: { minBase: 17, maxBase: 19, minRatio: 1.2, maxRatio: 1.25 },
    space: { minBase: 16, maxBase: 20 },
    colors: {
      bg: ['#fffefb', '#14151a'],
      surface: ['#f7f5ef', '#1b1d23'],
      text: ['#23262d', '#d7d9de'],
      muted: ['#5d626e', '#9a9fab'],
      heading: ['#11131a', '#f2f3f6'],
      accent: ['#7a2e2e', '#e0a3a3'],
      accentText: ['#ffffff', '#14151a'],
      border: ['#e2ded2', '#2b2e37'],
    },
    shape: { radius: '2px', rule: '1px', measure: '68ch', navStyle: 'sidebar' },
  },
  {
    id: 'b',
    name: 'Modern lab',
    description: 'Sans-serif, open, photo-forward. Reads as a contemporary research group.',
    fonts: { display: SANS, body: SANS },
    type: { minBase: 16, maxBase: 19, minRatio: 1.25, maxRatio: 1.333 },
    space: { minBase: 18, maxBase: 28 },
    colors: {
      bg: ['#ffffff', '#0e1116'],
      surface: ['#f2f6f8', '#161b22'],
      text: ['#2b333d', '#c9d1d9'],
      muted: ['#5f6b78', '#8b949e'],
      heading: ['#101820', '#f0f6fc'],
      accent: ['#0d7d8c', '#4dd4e8'],
      accentText: ['#ffffff', '#0e1116'],
      border: ['#dde5ea', '#232a33'],
    },
    shape: { radius: '12px', rule: '1px', measure: '72ch', navStyle: 'top' },
  },
  {
    id: 'c',
    name: 'Editorial scientific',
    description: 'Serif display against sans body, with her lavender carried forward.',
    fonts: { display: SERIF, body: SANS },
    type: { minBase: 16, maxBase: 20, minRatio: 1.25, maxRatio: 1.414 },
    space: { minBase: 16, maxBase: 26 },
    colors: {
      bg: ['#fdfcfe', '#121016'],
      surface: ['#f6f1f8', '#1c1822'],
      text: ['#3a3440', '#d5cfda'],
      muted: ['#6b6375', '#9c93a6'],
      heading: ['#1d1823', '#f4f0f7'],
      accent: ['#7b4b8a', '#c7b1ce'],
      accentText: ['#ffffff', '#121016'],
      border: ['#e7dfeb', '#2a2433'],
    },
    shape: { radius: '4px', rule: '2px', measure: '66ch', navStyle: 'sidebar' },
  },
];

export const DEFAULT_THEME = THEMES[0]!.id;

export const FONT_STACKS = { serif: SERIF, sans: SANS, mono: MONO };

/** Viewport range every fluid value interpolates across. */
export const VIEWPORT = { minViewport: 320, maxViewport: 1240 };

/** Type scale steps: -1 for fine print up to 5 for a page title. */
export const TYPE_STEPS = [-2, -1, 0, 1, 2, 3, 4, 5];

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
