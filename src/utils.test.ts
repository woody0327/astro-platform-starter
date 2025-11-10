import { describe, expect, it } from 'vitest';

import { cacheHeaders } from './utils';

describe('cacheHeaders', () => {
    it('returns the default cache headers when no arguments are provided', () => {
        const headers = cacheHeaders();

        expect(headers).toEqual({
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'Netlify-CDN-Cache-Control': 'public, max-age=31536000, must-revalidate'
        });
    });

    it('does not include Cache-Tag header when tags are not provided', () => {
        const headers = cacheHeaders(10);

        expect(headers).not.toHaveProperty('Cache-Tag');
    });

    it('includes Cache-Tag header only when tags are provided', () => {
        const headers = cacheHeaders(2, ['foo', 'bar']);

        expect(headers).toMatchObject({
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'Netlify-CDN-Cache-Control': 'public, max-age=172800, must-revalidate',
            'Cache-Tag': 'foo,bar'
        });
    });
});
