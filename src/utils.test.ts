import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('blobshape', () => ({
  default: vi.fn(() => ({ path: 'mock-path', seedValue: 'derived-seed' })),
}));

import blobshape from 'blobshape';
import { generateBlob } from './utils';

describe('generateBlob', () => {
  it('preserves provided parameters while appending derived values', () => {
    const parameters = {
      seed: 'provided-seed',
      size: 256,
      colors: ['#111111', '#222222'] as [string, string],
    };

    const result = generateBlob(parameters);
    const mockedBlobshape = blobshape as unknown as Mock;

    expect(mockedBlobshape).toHaveBeenCalledWith(expect.objectContaining(parameters));
    expect(result.svgPath).toBe('mock-path');
    expect(result.parameters).toMatchObject({
      ...parameters,
      seed: 'derived-seed',
    });
  });
});
