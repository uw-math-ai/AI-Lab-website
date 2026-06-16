# Custom Domain Cutover Runbook

Target domain: `ai.math.uw.edu`

Current safe DNS state: `ai.math.uw.edu` points to `sites.math.washington.edu`.

Do not point `ai.math.uw.edu` at GitHub again until the GitHub organization has verified the domain
and the `uw-math-ai/AI-Lab-website` repository has `ai.math.uw.edu` configured in Pages settings.
Otherwise a different GitHub Pages site can claim the hostname.

## Already handled in this repo

- `static/CNAME` records the intended custom domain.
- `src/routes/robots.txt/+server.ts` publishes crawl rules.
- `src/routes/sitemap.xml/+server.ts` publishes an official-domain sitemap from source data.
- Route-level canonical links point to `https://ai.math.uw.edu/`.
- The Google Search Console verification file is in `static/googlebe92fcf6c9d51831.html`.
- The Pages workflow keeps building for `/AI-Lab-website` until GitHub Pages reports
  `ai.math.uw.edu` as the configured custom domain.
- The Pages workflow also has a manual `force_root_domain` dispatch input for coordinated cutover
  if the GitHub Pages API lags behind the UI.

## Meeting roles

- GitHub organization owner/admin for `uw-math-ai`: verify the domain at the organization level,
  configure repository Pages settings, trigger the deploy workflow, and enable HTTPS.
- CAS IT: add the GitHub verification TXT record, switch the CNAME at cutover time, and update the
  old `sites.math.washington.edu/ai/` redirect.
- Site maintainer: verify build/deploy output and check live URLs.

## Safe cutover sequence

1. Keep `ai.math.uw.edu` pointing to `sites.math.washington.edu` while preparing.
2. In GitHub, an owner of the `uw-math-ai` organization should open:

   ```text
   Organization settings -> Pages -> Verified domains -> Add a domain
   Domain: ai.math.uw.edu
   ```

3. GitHub will show a DNS TXT challenge. CAS IT should add exactly that TXT record. It will look
   similar to this, but the value must be copied from GitHub:

   ```text
   Name: _github-pages-challenge-uw-math-ai.ai.math.uw.edu
   Type: TXT
   Value: <value from GitHub>
   ```

4. Confirm the TXT record is visible:

   ```sh
   dig _github-pages-challenge-uw-math-ai.ai.math.uw.edu +nostats +nocomments +nocmd TXT
   ```

5. Back in GitHub organization Pages settings, click Verify. If GitHub says the domain is already in
   use, the verified-domain flow should release it from other GitHub Pages sites. If it remains
   blocked, wait for GitHub Support to clear the malicious claim.
6. In `uw-math-ai/AI-Lab-website`, configure:

   ```text
   Repository settings -> Pages
   Source: GitHub Actions
   Custom domain: ai.math.uw.edu
   ```

7. Trigger the deploy workflow:

   ```text
   Actions -> Deploy to GitHub Pages -> Run workflow
   force_root_domain: true
   ```

   Use `force_root_domain` only during the coordinated cutover. Normal pushes should keep using the
   automatic detection logic.

8. Wait for the workflow to succeed.
9. CAS IT switches DNS:

   ```text
   Name: ai.math.uw.edu
   Type: CNAME
   Target: uw-math-ai.github.io
   ```

10. Verify DNS:

    ```sh
    dig ai.math.uw.edu +short CNAME
    ```

    Expected:

    ```text
    uw-math-ai.github.io.
    ```

11. Verify the site:

    ```sh
    curl -I https://ai.math.uw.edu/
    curl -I https://ai.math.uw.edu/projects/spring-2026/
    curl -I https://ai.math.uw.edu/robots.txt
    curl -I https://ai.math.uw.edu/sitemap.xml
    curl -I https://ai.math.uw.edu/googlebe92fcf6c9d51831.html
    ```

12. After GitHub provisions the certificate, enable `Enforce HTTPS` in repository Pages settings.
13. After the GitHub site works at `https://ai.math.uw.edu/`, CAS IT can replace the existing
    `sites.math.washington.edu/ai/.htaccess` with Asa's temporary redirect:

    ```apache
    RewriteEngine On

    RewriteRule ^.*$ https://ai.math.uw.edu/ [R=302,L]
    ```

14. After the redirect and HTTPS have been stable for a few days, consider changing the redirect from
    `302` to `301`.
15. Add `https://ai.math.uw.edu/` to Google Search Console and submit:

    ```text
    https://ai.math.uw.edu/sitemap.xml
    ```

## Rollback

If cutover fails before the old site redirect is changed:

1. CAS IT changes `ai.math.uw.edu` back to `sites.math.washington.edu`.
2. Keep the GitHub organization TXT verification record in place.
3. Leave the repository Pages custom domain in place only if GitHub support needs it for debugging;
   otherwise remove it before returning to regular `/AI-Lab-website/` deployment.
4. Rerun the deploy workflow without `force_root_domain` after the repository no longer reports
   `ai.math.uw.edu` as its custom domain.

If cutover fails after the old site redirect is changed:

1. CAS IT reverts or disables the `sites.math.washington.edu/ai/.htaccess` redirect.
2. CAS IT changes `ai.math.uw.edu` back to `sites.math.washington.edu`.
3. Follow the same GitHub rollback steps above.
