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

`npm run build` builds for domain-root hosting such as `https://ai.math.uw.edu/`.
`npm run build:ai-lab` builds for `https://uw-math-ai.github.io/AI-Lab-website/`.

Pushing to `main` runs `.github/workflows/pages.yml`, which builds the Svelte app and deploys the
generated `build/` directory through GitHub Pages. Do not commit generated `build/` files.

GitHub Pages must be configured with **Source: GitHub Actions** in the repository Pages settings.
If it is left on branch/root publishing, GitHub will render this README instead of the Svelte app.

The Pages workflow automatically builds for the current GitHub project URL until GitHub Pages reports
`ai.math.uw.edu` as the configured custom domain. After that, it builds for root-domain hosting. For
the coordinated DNS cutover, the manual workflow dispatch includes a `force_root_domain` input so an
admin can build root-domain output immediately after GitHub Pages is configured. See
`docs/custom-domain-checklist.md` for the DNS, GitHub Pages, redirect, rollback, and Google Search
Console checklist.

The Lean Hackathon site is maintained separately at `https://uw2026leanhackathon.github.io/`; this
repo links to it but does not build that app.

## Editing content

Edit YAML in `src/content/` to update project quarters, events, news, people, publications, homepage tool
cards, resources, and page metadata. Project descriptions support Markdown, so no HTML editing is
needed. New quarter files are discovered automatically, and invalid YAML fails validation before deployment.

See [the content editing guide](docs/content-editing.md) for file locations, examples, and publishing
instructions. Run `npm run check && npm run build && npm run test:site` after editing.

## Home page hero data

The point field behind the home page hero, and the braille maps on subpage
heroes, both read `static/data/open-problems-hero.json`. It is a generated
subset of [The Growing Map of Open Problems](https://open-problems-map.pages.dev/),
whose source data lives outside this repo in
`TheoremSearch/experiments/unsolved_math_pilot/galaxy_data.json`.

To regenerate it after the map's data changes:

```sh
node scripts/build-hero-data.mjs /path/to/galaxy_data.json
```

The script keeps every Lean-linked and every titled problem, then samples the
rest with a fixed seed, so the map is identical on every build. Problem data is
[ulamai/UnsolvedMath](https://huggingface.co/datasets/ulamai/UnsolvedMath),
CC BY 4.0.

## Static Redirects

Public quarter URLs such as `spring2026.html` are lightweight redirect shims in `static/` so existing links keep working after the SvelteKit migration.
