import type { APIRoute } from 'astro';
import { purgeCache } from '@netlify/functions';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const secret = import.meta.env.REVALIDATION_SECRET;
    const providedSecret = request.headers.get('x-revalidate-secret');

    if (!secret) {
        return new Response('Server misconfiguration: missing REVALIDATION_SECRET', { status: 500 });
    }

    if (providedSecret !== secret) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { tags } = await request.json();

    if (!Array.isArray(tags)) {
        return new Response(`Bad Request: expected tags attribute with array of strings in the body, got ${typeof tags}`, { status: 400 });
    }

    await purgeCache({ tags });
    return new Response(
        JSON.stringify({
            invalidated: tags
        })
    );
};
