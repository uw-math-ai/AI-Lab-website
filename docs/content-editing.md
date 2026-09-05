# Editing website content

The website's project pages and repeated cards are rendered from YAML in `src/content/`.
Edit these files directly; the development server reloads them and production builds validate them.
No HTML source pages or conversion scripts are needed.

| What to change | File |
| --- | --- |
| Project teams, descriptions, mentors, and quarter summaries | `src/content/projects/<quarter>.yaml` |
| Seminar/event cards, dates, photos, and linked papers | `src/content/events.yaml` |
| Dated news on the homepage and Events page | `src/content/news.yaml` |
| Leadership, mentors, members, headshots, and lab photos | `src/content/people.yaml` |
| Publication cards, authors, abstracts, and featured work | `src/content/research.yaml` |
| Homepage tool cards, statistics, and links | `src/content/tools.yaml` |
| Course, seminar, and reading lists | `src/content/resources/*.yaml` |
| Page titles, SEO descriptions, and sitemap dates | `src/content/pages.yaml` |
| Floating mathematical notation, names, and source notes | `src/content/math-symbols.yaml` |

Layout, navigation, and reusable presentation styles remain in Svelte components.
The TypeScript modules in `src/lib/data/` load YAML and compute sorting/filtering/counts.

## Editing a project

Each quarter has metadata followed by an ordered `blocks` list. Keep the existing `slug` and `id`
values when renaming titles: these identify public URLs and bookmarks. Reordering blocks changes
their display order; there is no hidden quarter-specific HTML reordering.

```yaml
- type: project
  title: My research project
  id: my-research-project
  details:
    - label: "Project Leader:"
      content: Ada Example
    - label: "Members:"
      content: Alex Example, Sam Example
    - label: "Description:"
      content: >-
        A description of the research question, methods, and intended result.
        Link to the [repository](https://github.com/uw-math-ai/example).
    - label: "Prerequisites:"
      content: Linear algebra and some Python experience.
```

Labels are editable; preserve their punctuation. `content` fields support Markdown: links,
**bold**, _italics_, backtick code, paragraphs, and nested lists. Raw HTML is disabled.
Use `>-` to wrap one paragraph across source lines, or `|-` to preserve blank lines and lists:

```yaml
content: |-
  First paragraph, with **important text**.

  - First goal
  - Second goal
    - A supporting task
```

Other supported blocks:

```yaml
- type: heading
  title: Continuing Projects
  id: continuing-projects
  level: 2
- type: text
  content: An introduction or a Markdown list.
- type: quote
  content: The quoted text.
  attribution: "-- Author (year)"
- type: image
  src: /photos/example.jpg
  alt: Describe the image
  width: 500
```

Project blocks may also have `intro` before their details and `content` after them.
Older entries use `style: list` to retain their archive presentation; new entries default to headings.

## Adding a quarter

Copy a recent file into `src/content/projects/<term>-<year>.yaml`. Update its `slug` to match the
filename, `legacyFile` (for example `winter2027.html`), `label`, `term`, `year`, `status`, `lastmod`,
`summary`, and blocks. Dates are `YYYY-MM-DD`. The term is `Winter`, `Spring`, `Summer`, or `Fall`.
The quarter index, static page generation, search, and sitemap discover the new file automatically.

Set `projectsLaunched` only to the number of **new** projects that quarter, excluding returning
teams. The historical baseline is 59 projects through Spring 2026. Update the old current quarter's
status to `recent`. If an old `.html` URL has been publicized, add a small redirect in `static/`,
following the existing quarter redirect files.

## Cards, dates, and assets

For events, copy an existing entry and edit its title, speaker, date, times, location, and type.
Quote times such as `"09:00"`. Use the published abstract when available. Optional arrays include
`links`, `papers`, `photos`, and `details`. Events are sorted by date/time automatically.
For events outside Seattle, set `utcOffset` (for example `"-04:00"`) and `timeZoneLabel` (`EDT`)
for the event date. Times are shown in the venue's local time.

News entries have a unique `id`, a `date`, a short `title` and `summary`, and `links`.
Use the date of the news, not a future conference date. Keep retrospective news separate from
calendar entries so past announcements do not appear as upcoming events. Cite any inferred
backdating in a YAML comment and retain the source link.

For publications, keep each item in the appropriate section. `featured: true` includes a work in
the homepage's featured list; `countsAsPaper` controls whether a section contributes to the paper count.

For people, edit the appropriate roster and optional `image`/`url`. Participation totals use the
historical baseline plus people with `counterStartQuarter` and `studentLevel` set. Do not tag
already-counted participants as new.

Put local image/PDF assets under `static/`. Refer to them from YAML with site-root paths such as
`/photos/example.jpg`; the renderer adds the hosting prefix when necessary. In Markdown, surround
URLs containing spaces with angle brackets: `[Slides](</slides/example talk.pdf>)`. Ordinary external
links use full `https://…` URLs. Existing Google verification files must remain in `static/`.

When content changes, update the corresponding quarter's `lastmod`, or the page's date in
`pages.yaml`. These are content dates, not automatically generated build dates.

## Floating mathematical notation

`math-symbols.yaml` groups notation by field. Each entry has a unique `id`, a readable `name`,
and single-quoted `tex` (without `$` delimiters). `kind` is `object` by default; use `symbol`
for elementary glyphs and `formula` for equations. Optional `note` and `source` record context,
hypotheses, and joint work; they are editorial metadata, not floating captions or publication credits.

```yaml
- id: motivic-k-theory
  name: Motivic algebraic K-theory spectrum
  tex: '\mathrm{KGL}'
```

Prefer identifiable objects such as `\operatorname{Bun}_G` or `L_{K(n)}\mathbb S` over
context-free tuples and isolated operators. A Fields Medal connection does not imply that
the medalist invented the notation or worked alone. Keep source notes for such connections.

MathJax runs only at build/dev time and produces one self-contained SVG atlas. The browser
loads that local image and draws/tints it on the existing canvas; it does not load MathJax,
external math fonts, or a CDN. Invalid TeX fails with the entry ID. All atlas cells have padding
for superscripts and subscripts. The picker cycles through fields, avoids simultaneous duplicate
entries, and gives long formulas roughly one in fourteen particle slots. Expressions too wide
for readable mobile type are excluded on mobile. Reduced motion produces a still background;
theme changes recolor it without requiring an animation loop.

## Verify and publish

```sh
npm ci
npm run check
npm run build
npm run test:site
npm run verify:ai-lab
```

Validation reports the YAML filename and invalid field. It catches missing fields, misspelled
keys, wrong value types, duplicate YAML keys/anchors, invalid dates/times, and filenames that do not
match quarter slugs. The rendered-site tests check metadata and verify that YAML text and links
survive rendering. Review the local preview for visual changes.

Commit the edited YAML and any new assets. Do not commit `build/` or `.svelte-kit/`.
Pushing to `main` runs the checks and deploys the site through GitHub Pages.
