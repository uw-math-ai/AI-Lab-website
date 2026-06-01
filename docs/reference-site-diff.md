# Reference Site Diff

Compared against `uw-math-ai/AI-Lab-website` at the cloned `main` snapshot in `/tmp/AI-Lab-website`.

## Incorporated

- Added native Svelte routes for `/people` and `/research`.
- Ported the 2025-26 people roster:
  - Leadership: 2 co-directors.
  - Project leaders: 22 linked profile cards with reference-site profile photos.
  - Members: 89 undergraduate and graduate researchers with project areas.
- Ported reference lab photos into `static/photos`:
  - `fall2025.jpg`
  - `winter2025.jpg`
  - `lean-hackathon.jpg`
  - `lean-hackathon-team.jpg`
  - `iclr-2026.jpg`
- Ported reference profile photos into `static/photos/people`.
- Replaced the home page's compact arXiv-only preview with a broader Research preview.
- Added the full reference research content:
  - Conference and workshop papers.
  - Preprints.
  - Other publications.
- Added primary navigation links for People and Research.
- `people.html` and `research.html` are served by the native generated Svelte routes, so old direct links load the new pages.
- Added link rewriting for archived legacy content that points to `people.html` or `research.html`.

## Already Covered By The Svelte Site

- The reference site's project archive is covered by native `/projects` and `/projects/[quarter]` routes.
- The reference site's Courses and Seminars navigation is covered by the combined `/resources` route, ordered as Seminars, Courses, Resources.
- The Lean Hackathon callout and event calendar are covered by `/events`.
- Support link and Lean Hackathon external link are present in the Svelte navigation.

## Intentional Differences

- The Svelte site keeps the clean purple-white light theme and neon dark theme from the migration plan rather than copying the reference site's canvas-heavy visual system.
- People and Research are structured as Svelte-native data-driven pages instead of copied static HTML.
- Lab photo captions drop the literal leading `//` in data and render it as visual caption styling.

## Still Missing Or Worth Confirming

- The reference home page includes explicit links to LinkedIn, HuggingFace, Lab docs, and Mailing list. The Svelte home currently emphasizes Projects, Events, GitHub, and Support.
- The reference home page states support from UW eScience Institute, UW IT Research Computing, AWS, and Nebius. The Svelte site does not yet have a sponsor/support acknowledgments band.
- The reference site has People and Research as separate top-level pages now; old reference direct URLs under `/AI-Lab-website/` are not deployment-equivalent unless Pages is pointed at this Svelte build.
