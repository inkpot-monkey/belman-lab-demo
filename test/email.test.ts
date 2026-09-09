import { describe, it, expect } from 'vitest';
import { displayEmail } from '../src/lib/email.ts';

describe('displayEmail', () => {
  it('gives a clickable address when obfuscation is off', () => {
    expect(displayEmail('sophie.belman@yale.edu', false)).toEqual({
      text: 'sophie.belman@yale.edu',
      href: 'mailto:sophie.belman@yale.edu',
    });
  });

  it('matches the convention already used on the site', () => {
    // The previous site wrote it exactly this way, on every page.
    expect(displayEmail('sophie.belman@yale.edu', true).text).toBe('sophie.belman[at]yale.edu');
  });

  it('offers no link when obfuscated, since a mailto would defeat the point', () => {
    expect(displayEmail('sophie.belman@yale.edu', true).href).toBeNull();
  });

  it('leaves the domain dots alone', () => {
    expect(displayEmail('a.b@sub.example.ac.uk', true).text).toBe('a.b[at]sub.example.ac.uk');
  });

  it('leaves a malformed address alone rather than mangling it', () => {
    // Two @ signs is not an address, so there is nothing safe to rewrite.
    expect(displayEmail('a@b@c', true)).toEqual({ text: 'a@b@c', href: null });
  });

  it('passes through something that is not an address', () => {
    expect(displayEmail('not an address', true)).toEqual({ text: 'not an address', href: null });
    expect(displayEmail('not an address', false)).toEqual({ text: 'not an address', href: null });
  });

  it('handles an empty string', () => {
    expect(displayEmail('', false)).toEqual({ text: '', href: null });
  });
});
