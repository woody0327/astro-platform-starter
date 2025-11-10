# Code Review

## Security
- `src/pages/api/revalidate.ts` exposes the `purgeCache` functionality to any visitor without any authentication or authorization checks. Because the endpoint is called directly from client-side JavaScript in `src/pages/revalidation.astro`, any site visitor (or malicious script embedded on the page) can trigger full cache invalidations by posting arbitrary tag lists. That enables trivial denial-of-service against the site's CDN cache and can incur unnecessary rebuild costs. The handler should require a shared secret or other auth mechanism and validate the caller before forwarding requests to Netlify's purge API.

## Reliability
- The revalidation button in `src/pages/revalidation.astro` does not check the response from `/api/revalidate` (the `fetch` call is neither awaited nor wrapped in a try/catch). As written, the UI always displays a success alert even if the network request fails, which can mislead users during outages. Awaiting the request and surfacing failures to the user would make the demo more trustworthy.
