// The single source of truth for Freehold's colours and logo mark.
// CSS gets these as custom properties (see Base.astro), and the favicon and
// social image are generated from them, so changing a colour is one edit here.
// Contrast notes are against --ink unless stated; see DESIGN.md.

export const COLOURS = {
  clay: '#d4734a', // ink on clay 5.22:1
  'clay-soft': '#d98a63', // ink 6.38:1
  sun: '#e8b04a', // ink 8.82:1
  sage: '#aebf9c', // ink 8.81:1
  ink: '#1f1a16',
  soil: '#2b2420', // chalk on soil 13.36:1
  chalk: '#f6efe4',
  moss: '#3f5a3a', // chalk on moss 6.72:1
  'sun-light': '#f3cf80', // small labels on moss, soil and ink
  positive: '#b9dfa8', // "developer preview" tags and "proven" in the walkthrough
  negative: '#f0a483', // "not shared" in the walkthrough
} as const;

export type Colour = keyof typeof COLOURS;

/** CSS custom properties for :root, one per colour. */
export function colourVars(): string {
  return Object.entries(COLOURS)
    .map(([name, value]) => `--${name}:${value}`)
    .join(';');
}

/**
 * The breakout plot mark: an ink frame around a clay field, with your plot
 * (chalk) breaking out of the bottom-right corner. Returns the SVG's inner
 * shapes on a 22x22 grid.
 */
export function markShapes(): string {
  const { ink, clay, chalk } = COLOURS;
  return (
    `<rect width="22" height="22" fill="${ink}"/>` +
    `<rect x="4" y="4" width="14" height="14" fill="${clay}"/>` +
    `<rect x="11" y="11" width="11" height="11" fill="${chalk}"/>`
  );
}

/** A standalone SVG of the mark, used for the favicon. */
export function markSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">${markShapes()}</svg>\n`;
}
