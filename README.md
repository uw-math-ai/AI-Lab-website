# UW Math AI Lab Website

SvelteKit site for the University of Washington Math AI Lab. The canonical source repo is
`uw-math-ai/AI-Lab-website`.

## Development

```sh
npm install
npm run dev
```

Local preview for the GitHub Pages subpath:

```sh
npm run build:ai-lab
npm run preview
```

## Build

```sh
npm run check
npm run build
npm run build:ai-lab
```

`npm run build` builds for domain-root hosting. `npm run build:ai-lab` builds for
`https://uw-math-ai.github.io/AI-Lab-website/`.

Pushing to `main` runs `.github/workflows/pages.yml`, which builds the Svelte app and deploys the
generated `build/` directory through GitHub Pages. Do not commit generated `build/` files.

GitHub Pages must be configured with **Source: GitHub Actions** in the repository Pages settings.
If it is left on branch/root publishing, GitHub will render this README instead of the Svelte app.

The Lean Hackathon site is maintained separately at `https://uw2026leanhackathon.github.io/`; this
repo links to it but does not build that app.

## Events

The event calendar is repo-owned data in `src/lib/data/events.ts`. To add an event, append one object with:

- `title`
- `speaker`
- `date` as `YYYY-MM-DD`
- `startTime` and `endTime` as 24-hour `HH:mm`
- `location`
- `type`
- `sourceUrl`
- optional `abstract`

Use UW Math event pages as the source URL whenever possible.

## Static Redirects

Public quarter URLs such as `spring2026.html` are lightweight redirect shims in `static/` so existing links keep working after the SvelteKit migration.
