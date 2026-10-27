# Lab blog

- Read: https://ai.math.uw.edu/blog/
- Write and manage authors: https://ai.math.uw.edu/blog/write/

Sign in with GitHub. `zengrf` is the owner and can approve authors in the
**Authors** tab. Other accounts can sign in but cannot write until approved.
Authors manage their own posts; administrators manage all posts and approvals.
Removing an approval immediately blocks further editing by that account.

The Markdown editor has formatting controls, live math preview, image uploads,
autosave, local recovery, and a draft download. Title, summary, post URL, topics,
and cover description are editable. A post needs a title, summary, and body to
publish. Uploaded images require a description when used as the cover.

**Publish** makes a snapshot public. Editing a published post continues in a
private draft; click **Publish changes** to update the public version. URLs are
fixed after first publication. **Unpublish** removes a post from the blog;
**Delete draft** removes its saved text. Administrators can export a JSON backup.

## Implementation

The SvelteKit frontend lives in `src/routes/blog/`, with shared helpers in
`src/lib/blog/` and `BlogProse.svelte`. Its design uses the site's existing theme,
fonts, light/dark colors, header, and footer. KaTeX is bundled locally under
`static/vendor/katex/` with its license. Reader URLs use `/blog/post/?slug=...`
because this website remains statically hosted on GitHub Pages. Posts publish
immediately through the API without rebuilding the website. Post content is
loaded in the browser, so social preview crawlers may show the general blog
metadata rather than a post-specific preview.

`services/blog/` is the reviewed source mirror of the separately deployed Sites
Worker. Its README covers GitHub setup, permissions, storage, tests, backups,
and deployment. The Worker has its own source repository and deployment; the
website's Pages build does not deploy it. Update both copies when changing it.
Never put OAuth secrets or session tokens in this frontend repository.

For local development, run `npm run dev` inside `services/blog` (Node 20+ and
Python 3 / SQLite 3.35+). Run the frontend with:

```sh
VITE_BLOG_API=http://127.0.0.1:4318 npm run dev -- --host 127.0.0.1 --port 4317
```

See the service README for the disposable local test accounts. The default
production API is `https://uw-math-ai-blog-service.zengrf2000.chatgpt.site`.
Do not deploy a build with the localhost override.

## Verification

```sh
npm run check
npm run build
npm run test:site
npm --prefix services/blog test
```

Browser checks should cover owner/author/unapproved views, draft save/recovery,
publish/private revision/unpublish, optimistic conflicts, math and safe Markdown,
uploads, and 390/768/1024/1440-pixel light/dark layouts. GitHub authorization must
also be exercised after registering the production sign-in application.
