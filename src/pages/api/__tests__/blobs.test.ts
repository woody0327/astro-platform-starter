import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET } from '../blobs';
import { getStore } from '@netlify/blobs';

vi.mock('@netlify/blobs', () => ({
    getStore: vi.fn()
}));

describe('GET /api/blobs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 500 when listing blobs fails', async () => {
        const listMock = vi.fn(() => {
            throw new Error('Failed to list blobs');
        });
        const mockedGetStore = vi.mocked(getStore);
        mockedGetStore.mockReturnValue({
            list: listMock
        } as any);

        const response = await GET({
            request: new Request('http://localhost/api/blobs')
        } as any);

        expect(response.status).toBe(500);
        const payload = await response.json();
        expect(payload).toEqual({
            keys: [],
            error: 'Failed listing blobs'
        });
        expect(listMock).toHaveBeenCalled();
    });
});
