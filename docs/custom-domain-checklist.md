# Custom Domain Checklist

Target domain: `ai.math.uw.edu`

## Already handled in this repo

- `static/CNAME` records the intended custom domain.
- `src/routes/robots.txt/+server.ts` publishes crawl rules.
- `src/routes/sitemap.xml/+server.ts` publishes an official-domain sitemap from source data.
- Route-level canonical links point to `https://ai.math.uw.edu/`.
- The Pages workflow keeps building for `/AI-Lab-website` until GitHub Pages reports `ai.math.uw.edu` as the configured custom domain; after that it builds for root `/`.
- The Google Search Console verification file is in `static/googlebe92fcf6c9d51831.html`.

## External TODOs

1. Jarod should authorize the technical handoff in the UW Connect ticket.
2. CAS IT should create a DNS `CNAME` record:

   ```text
   Name: ai.math.uw.edu
   Target: uw-math-ai.github.io
   ```

3. A GitHub repo admin should configure:

   ```text
   Repository: uw-math-ai/AI-Lab-website
   Settings -> Pages -> Source: GitHub Actions
   Settings -> Pages -> Custom domain: ai.math.uw.edu
   ```

4. After GitHub provisions TLS, enable `Enforce HTTPS`.
5. CAS IT should add a permanent redirect from `https://sites.math.washington.edu/ai/` to `https://ai.math.uw.edu/`.
6. Add `https://ai.math.uw.edu/` to Google Search Console and submit:

   ```text
   https://ai.math.uw.edu/sitemap.xml
   ```

## Verification URLs

After DNS and GitHub Pages are configured, verify:

```text
https://ai.math.uw.edu/
https://ai.math.uw.edu/projects/spring-2026/
https://ai.math.uw.edu/research/
https://ai.math.uw.edu/resources/
https://ai.math.uw.edu/robots.txt
https://ai.math.uw.edu/sitemap.xml
https://ai.math.uw.edu/googlebe92fcf6c9d51831.html
```
