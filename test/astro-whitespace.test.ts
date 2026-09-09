import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Astro strips the whitespace before an inline element or expression that
 * begins a line, so
 *
 *   press
 *   <b>Publish changes</b>
 *
 * renders as "pressPublish changes". It looks perfectly reasonable in the
 * source, produces no error, and is only visible by reading the rendered page,
 * which is exactly how five of them shipped onto one page at once.
 */
const SRC = new URL('../src/', import.meta.url).pathname;
const INLINE_START = /^(?:<(?:a|b|i|em|strong|code|cite|time|span|abbr|kbd|small|sup|sub)[\s>]|\{)/;
const ENDS_MID_SENTENCE = /[\p{L}\p{N},;:]['’]?$/u;

function astroFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return path.endsWith('.astro') ? [path] : [];
  });
}

describe('astro templates', () => {
  it('never starts a line with an inline element that needs a space before it', () => {
    const offences: string[] = [];

    for (const file of astroFiles(SRC)) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        const previous = lines[index - 1]?.trim() ?? '';
        if (INLINE_START.test(trimmed) && ENDS_MID_SENTENCE.test(previous)) {
          offences.push(`${relative(SRC, file)}:${index + 1}  "${previous.slice(-30)}" + "${trimmed.slice(0, 30)}"`);
        }
      });
    }

    expect(offences).toEqual([]);
  });
});
