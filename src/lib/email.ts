/**
 * How an email address is shown.
 *
 * Writing `name[at]example.edu` instead of a real address is a long-standing
 * academic convention against address-harvesting robots. Its practical value in
 * 2026 is doubtful - `[at]` is the most common pattern there is, and any
 * harvester worth worrying about normalises it - and it costs a clickable link
 * and a clean reading for screen readers.
 *
 * It stays a setting rather than a decision made here, because it is somebody's
 * own contact details and they had already chosen.
 */

export interface DisplayedEmail {
  /** What the reader sees. */
  text: string;
  /** A mailto target, or null when there should not be a link. */
  href: string | null;
}

const looksLikeAddress = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function displayEmail(address: string, obfuscate: boolean): DisplayedEmail {
  if (!looksLikeAddress(address)) return { text: address, href: null };
  if (!obfuscate) return { text: address, href: `mailto:${address}` };
  // Only the first @: an address has exactly one, and replacing later ones
  // would corrupt anything unusual rather than protect it.
  return { text: address.replace('@', '[at]'), href: null };
}
