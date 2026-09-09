import { describe, it, expect } from 'vitest';
import { repairTitle, formatAuthors, normalisePublications } from '../src/lib/orcid.ts';
import snapshot from '../src/data/orcid-snapshot.json' with { type: 'json' };

describe('repairTitle', () => {
  it('restores spaces lost when Crossref strips italic markup', () => {
    // Real value from the live ORCID record: <i>Streptococcus pneumoniae</i> was
    // stripped without replacing the surrounding spaces.
    expect(repairTitle('CharacterisingStreptococcus pneumoniaeTransmission Patterns in Malawi')).toBe(
      'Characterising Streptococcus pneumoniae Transmission Patterns in Malawi',
    );
  });

  it('leaves acronyms alone', () => {
    expect(repairTitle('SARS-CoV-2 genomics as a springboard for future disease mitigation in LMICs')).toBe(
      'SARS-CoV-2 genomics as a springboard for future disease mitigation in LMICs',
    );
    expect(repairTitle('Genetic background of isolates following PCV13')).toBe(
      'Genetic background of isolates following PCV13',
    );
  });

  it('collapses runs of whitespace and trims', () => {
    expect(repairTitle('  A  title\twith   gaps ')).toBe('A title with gaps');
  });

  it('is a no-op for an already clean title', () => {
    const clean = 'A new perspective on ancient Mitis group streptococcal genetics';
    expect(repairTitle(clean)).toBe(clean);
  });

  it('returns an empty string unchanged', () => {
    expect(repairTitle('')).toBe('');
  });
});

describe('formatAuthors', () => {
  it('lists every author when under the limit', () => {
    expect(formatAuthors(['A One', 'B Two'], { max: 5 })).toEqual({
      shown: ['A One', 'B Two'],
      truncated: false,
    });
  });

  it('truncates a long author list', () => {
    expect(formatAuthors(['A', 'B', 'C', 'D'], { max: 2 })).toEqual({
      shown: ['A', 'B'],
      truncated: true,
    });
  });

  it('always keeps the emphasised author visible, even past the limit', () => {
    expect(formatAuthors(['A', 'B', 'C', 'Sophie Belman'], { max: 2, emphasise: 'Sophie Belman' })).toEqual({
      shown: ['A', 'B', 'Sophie Belman'],
      truncated: true,
    });
  });

  it('does not duplicate the emphasised author when already shown', () => {
    expect(formatAuthors(['Sophie Belman', 'B', 'C'], { max: 2, emphasise: 'Sophie Belman' })).toEqual({
      shown: ['Sophie Belman', 'B'],
      truncated: true,
    });
  });

  it('handles an empty author list', () => {
    expect(formatAuthors([], { max: 3 })).toEqual({ shown: [], truncated: false });
  });
});

describe('normalisePublications', () => {
  const result = normalisePublications(snapshot);

  it('carries the sync date through so staleness is visible', () => {
    expect(result.syncedAt).toBe(snapshot.fetchedAt);
  });

  it('repairs mangled titles from the real record', () => {
    const malawi = result.publications.find((p) => p.title.includes('Malawi'));
    expect(malawi?.title).toBe(
      'Characterising Streptococcus pneumoniae Transmission Patterns in Malawi Through Genomic and Statistical Modelling',
    );
  });

  it('sorts newest first', () => {
    const years = result.publications.map((p) => p.year).filter((y): y is number => y !== null);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('coerces the year to a number', () => {
    expect(result.publications.every((p) => p.year === null || typeof p.year === 'number')).toBe(true);
  });

  it('flags preprints', () => {
    const nature = result.publications.find((p) => p.journal === 'Nature');
    expect(nature?.isPreprint).toBe(false);
    expect(result.publications.some((p) => p.isPreprint)).toBe(true);
  });

  it('marks a preprint as superseded when a published version shares its title', () => {
    // The record holds both the 2023 preprint and the 2024 G3 article of
    // "Estimating between-country migration in pneumococcal populations".
    const superseded = result.publications.filter((p) => p.supersededBy !== null);
    expect(superseded).toHaveLength(1);
    expect(superseded[0]!.isPreprint).toBe(true);
    expect(superseded[0]!.supersededBy).toBe(
      result.publications.find((p) => p.journal === 'G3: Genes, Genomes, Genetics')?.id,
    );
  });

  it('never marks a published article as superseded', () => {
    expect(result.publications.filter((p) => !p.isPreprint).every((p) => p.supersededBy === null)).toBe(true);
  });

  it('deduplicates repeated DOIs', () => {
    const doubled = {
      ...snapshot,
      works: [...snapshot.works, snapshot.works[0]!],
    };
    expect(normalisePublications(doubled).publications).toHaveLength(result.publications.length);
  });

  it('gives every publication a stable id', () => {
    const ids = result.publications.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.length > 0)).toBe(true);
  });

  it('survives a work with no DOI, year or authors', () => {
    const sparse = {
      ...snapshot,
      works: [{ putCode: 999, title: 'Untitled work', type: null, year: null, journal: null, doi: null, url: null, authors: [] }],
    };
    const [only] = normalisePublications(sparse).publications;
    expect(only).toMatchObject({ id: '999', year: null, doi: null, authors: [] });
  });
});
