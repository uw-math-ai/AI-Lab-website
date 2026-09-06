# Visitor analytics

Umami Cloud tracks page views through one deferred script in `src/app.html`.
The website ID is a public tracking identifier, not an API key.

- Only `ai.math.uw.edu` sends visits; localhost and GitHub Pages preview domains are excluded.
- `Analytics.svelte` sends one view per page through SvelteKit's navigation hook, including
  Back/Forward. Built-in automatic tracking is disabled to avoid duplicates. A script-load
  listener handles slow connections; consecutive query/hash-only changes are ignored.
- URL query strings and fragments are excluded, and browser Do Not Track is respected.
- No custom events, visitor identifiers, session replay, or heatmaps are configured by this site.

After deployment, visit the live site and navigate between pages, then check the website's
Realtime view in Umami Cloud. Ad blockers and Do Not Track can prevent visits from appearing.
Counts start when the tracker is deployed; they do not reconstruct past traffic.

For setup and supported options, see the official [installation](https://docs.umami.is/docs/collect-data)
and [tracker configuration](https://docs.umami.is/docs/tracker-configuration) documentation.
