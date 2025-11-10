import { describe, it, expect, vi, afterEach } from 'vitest';
import blobshape from 'blobshape';

import { randomInt, uniqueName, generateBlob, cacheHeaders } from './utils';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('randomInt', () => {
  it('returns the minimum value when Math.random produces 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(randomInt(5, 10)).toBe(5);
  });

  it('returns the maximum value when Math.random produces a value close to 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999999999);

    expect(randomInt(5, 10)).toBe(10);
  });
});

describe('uniqueName', () => {
  it('creates a name with adjective, animal, and three digit suffix', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    const name = uniqueName();

    expect(name).toMatch(/^[a-z-]+-[a-z-]+-\d{3}$/i);
  });
});

describe('generateBlob', () => {
  it('honors provided parameters and seed', () => {
    const parameters = {
      seed: 'unit-test-seed',
      size: 128,
      edges: 6,
      growth: 4,
      name: 'custom-name',
      colors: ['#000000', '#ffffff']
    } as const;

    const result = generateBlob(parameters);
    const expected = blobshape(parameters);

    expect(result.svgPath).toEqual(expected.path);
    expect(result.parameters).toEqual({
      ...parameters,
      seed: expected.seedValue
    });
  });
});

describe('cacheHeaders', () => {
  it('produces cache headers with computed durations', () => {
    const headers = cacheHeaders(2);

    expect(headers).toEqual({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': 'public, max-age=172800, must-revalidate'
    });
  });

  it('includes cache tags when provided', () => {
    const headers = cacheHeaders(1, ['tag-one', 'tag-two']);

    expect(headers['Cache-Tag']).toBe('tag-one,tag-two');
  });
});
