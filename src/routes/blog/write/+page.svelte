<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import Seo from '$lib/components/Seo.svelte';
  import BlogProse from '$lib/components/BlogProse.svelte';
  import { api, signIn, completeSignIn, signOut, uploadImage, postPath, formatDate, download, BlogError, type BlogUser, type Draft, type Author } from '$lib/blog/client';
  import { sitePath } from '$lib/paths';
  let user = $state<BlogUser | null>(null);
  let loading = $state(true), ready = $state(false), error = $state(''), notice = $state('');
  let posts: Draft[] = $state([]), post: Draft | null = $state(null), authors: Author[] = $state([]);
  let section = $state<'posts' | 'authors'>('posts'), filter = $state('all'), search = $state(''), mode = $state<'write'|'split'|'preview'>('split');
  let dirty = $state(false), saving = $state(false), busy = $state(false), uploading = $state(false), serial = 0, timer: ReturnType<typeof setTimeout>;
  let tagText = $state(''), authorLogin = $state(''), authorRole = $state('author');
  let textarea = $state<HTMLTextAreaElement>(), coverInput = $state<HTMLInputElement>(), imageInput = $state<HTMLInputElement>();
  let dialog: HTMLDialogElement;
  let confirmTitle = $state(''), confirmBody = $state(''), confirmAction: (() => Promise<void>) | null = null;
  let recovery: Draft | null = $state(null), queue = Promise.resolve();
  const allowed = $derived.by(() => user !== null && user.role !== 'reader');
  const visible = $derived(posts.filter(p => (filter === 'all' || (filter === 'published' ? p.published : !p.published)) && (p.title + p.author_name).toLowerCase().includes(search.toLowerCase())));
  const backupKey = (id: string) => `math-ai-blog-draft-${user?.id}-${id}`;
  const pendingApprovalKey = 'math-ai-blog-pending-approval';
  async function refresh() { posts = (await api<{ posts: Draft[] }>('/editor/posts')).posts; }
  async function boot() {
    loading = true; error = '';
    try { const returning = new URLSearchParams(location.hash.slice(1)).has('code'); await completeSignIn(); const data = await api<{ user: BlogUser | null; githubReady: boolean }>('/auth/session'); user = data.user; ready = data.githubReady;
      if (user && user.role !== 'reader') { await refresh(); const id = new URL(location.href).searchParams.get('post'); if (id) await openPost(id); }
      if (new URL(location.href).searchParams.get('signin') === 'cancelled') { sessionStorage.removeItem(pendingApprovalKey); notice = 'Sign-in was cancelled. No author access was changed.'; }
      if (returning) {
        const pending = JSON.parse(sessionStorage.getItem(pendingApprovalKey) || 'null'); sessionStorage.removeItem(pendingApprovalKey);
        if (pending) {
          if (!user || user.id !== pending.administrator || user.role !== 'admin' || Date.now() - pending.createdAt > 600000) throw new Error('Please approve the author again using the administrator account you started with.');
          await showAuthors(); authorLogin = pending.login; authorRole = pending.role;
          await api('/admin/authors','POST',{login:pending.login,role:pending.role});
          authorLogin = ''; await showAuthors(); notice = `@${pending.login} is approved to post.`;
        }
      }
    } catch (e) { error = (e as Error).message; } finally { loading = false; }
  }
  onMount(() => { void boot(); return () => clearTimeout(timer); });
  beforeNavigate(({ cancel }) => { if (dirty || saving) { cancel(); error = 'Save your changes before leaving the editor, or download a copy if saving is unavailable.'; } });
  function guard(event: BeforeUnloadEvent) { if (dirty || saving) { event.preventDefault(); event.returnValue = ''; } }
  function changed() {
    if (!post) return; dirty = true; serial++; clearTimeout(timer);
    queueMicrotask(() => { if (post) { post.tags = tagText.split(',').map(t => t.trim()).filter(Boolean); try { sessionStorage.setItem(backupKey(post.id), JSON.stringify(post)); } catch { /* server saving remains available */ } } });
    timer = setTimeout(() => { void save().catch(() => {}); }, 1500);
  }
  function save(): Promise<void> {
    clearTimeout(timer);
    const task = async () => {
      if (!post || !dirty) return;
      const id = post.id, savedSerial = serial, content = JSON.parse(JSON.stringify(post)); saving = true; error = '';
      try { const result = await api<{ post: Draft }>('/editor/posts/' + id, 'PUT', content);
        if (post?.id === id) { post.version = result.post.version; post.updated_at = result.post.updated_at; if (serial === savedSerial) { dirty = false; sessionStorage.removeItem(backupKey(id)); } }
      } catch (e) { error = (e as Error).message; throw e; } finally { saving = false; }
    };
    const pending = queue.then(task); queue = pending.catch(() => {}); return pending;
  }
  async function openPost(id: string) {
    try { await save(); const data = await api<{ post: Draft }>('/editor/posts/' + id); post = data.post; tagText = post.tags.join(', '); dirty = false; error = ''; notice = ''; serial++;
      try { recovery = JSON.parse(sessionStorage.getItem(backupKey(id)) || 'null'); } catch { recovery = null; }
      history.replaceState(null, '', sitePath('/blog/write/') + '?post=' + id);
    } catch (e) { error = (e as Error).message; }
  }
  async function createPost() { busy = true; error = ''; try { await save(); const data = await api<{ post: Draft }>('/editor/posts', 'POST', {}); await openPost(data.post.id); } catch(e) { error = (e as Error).message; } finally { busy = false; } }
  async function back() { try { await save(); post = null; recovery = null; history.replaceState(null, '', sitePath('/blog/write/')); await refresh(); } catch { /* retain unsaved editor */ } }
  async function logout() { try { await save(); sessionStorage.removeItem(pendingApprovalKey); await signOut(); user = null; post = null; posts = []; history.replaceState(null, '', sitePath('/blog/write/')); } catch(e) { error = (e as Error).message; } }
  async function login() { try { await signIn(); } catch(e) { error = (e as Error).message; } }
  function restore() { if (!post || !recovery) return; const { title, summary, body, tags, cover, cover_alt } = recovery; post = { ...post, title, summary, body, tags, cover, cover_alt, slug: post.published_at ? post.slug : recovery.slug }; tagText = post.tags.join(', '); recovery = null; changed(); }
  function discardRecovery() { if (post) sessionStorage.removeItem(backupKey(post.id)); recovery = null; }
  async function publish() {
    busy = true; error = ''; notice = '';
    try { await save(); if (dirty) await save(); if (!post) return; const result = await api<{ post: Draft }>('/editor/posts/' + post.id + '/publish', 'POST', { version: post.version }); post = result.post; dirty = false; notice = 'Published. Your post is now available on the blog.'; }
    catch(e) { error = (e as Error).message; } finally { busy = false; }
  }
  function ask(title: string, body: string, action: () => Promise<void>) { confirmTitle = title; confirmBody = body; confirmAction = action; dialog.showModal(); }
  async function confirm() { dialog.close(); busy = true; error = ''; try { await confirmAction?.(); } catch(e) { error = (e as Error).message; } finally { busy = false; confirmAction = null; } }
  function unpublish() { ask('Unpublish this post?', 'It will be removed from the public blog. Your draft will stay in the editor.', async () => { await save(); if (!post) return; post = (await api<{ post: Draft }>('/editor/posts/' + post.id + '/unpublish', 'POST', { version: post.version })).post; notice = 'Unpublished. You can continue editing or publish again.'; }); }
  function removePost() { ask('Delete this draft?', 'This permanently removes the saved draft. Download a copy first if you want to keep it.', async () => { if (!post) return; clearTimeout(timer); await queue; await api('/editor/posts/' + post.id, 'DELETE', { version: post.version }); sessionStorage.removeItem(backupKey(post.id)); dirty = false; post = null; await back(); }); }
  function exportPost() { if (post) download(post.slug + '.md', `---\ntitle: ${JSON.stringify(post.title)}\nsummary: ${JSON.stringify(post.summary)}\ntags: ${JSON.stringify(post.tags)}\n---\n\n${post.body}`); }
  async function insert(before: string, after = '', placeholder = 'text') {
    if (!post) return; mode = mode === 'preview' ? 'write' : mode; await tick();
    const start = textarea?.selectionStart ?? post.body.length, end = textarea?.selectionEnd ?? start;
    const selected = post.body.slice(start, end) || placeholder;
    post.body = post.body.slice(0,start) + before + selected + after + post.body.slice(end); changed(); await tick(); textarea?.focus(); textarea?.setSelectionRange(start + before.length, start + before.length + selected.length);
  }
  async function upload(event: Event, cover = false) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]; if (!file || !post) return;
    uploading = true; error = '';
    try { const url = await uploadImage(file); if (cover) { post.cover = url; changed(); } else await insert('![', `](${url})`, 'Describe the image'); }
    catch(e) { error = (e as Error).message; } finally { uploading = false; input.value = ''; }
  }
  function keydown(event: KeyboardEvent) { if (!(event.metaKey || event.ctrlKey)) return; if (event.key.toLowerCase() === 's') { event.preventDefault(); void save().catch(() => {}); } if (event.target === textarea && event.key.toLowerCase() === 'b') { event.preventDefault(); void insert('**','**'); } if (event.target === textarea && event.key.toLowerCase() === 'i') { event.preventDefault(); void insert('*','*'); } }
  async function showAuthors() { error = ''; try { authors = (await api<{ authors: Author[] }>('/admin/authors')).authors; section = 'authors'; } catch(e) { error = (e as Error).message; } }
  async function approve() {
    busy = true; error = ''; const login = authorLogin.trim().replace(/^@/,''), role = authorRole;
    try { await api('/admin/authors','POST',{login,role}); authorLogin = ''; await showAuthors(); notice = `@${login} is approved to post.`; }
    catch(e) {
      if (e instanceof BlogError && e.status === 428 && user) {
        sessionStorage.setItem(pendingApprovalKey, JSON.stringify({login,role,administrator:user.id,createdAt:Date.now()}));
        notice = 'Refreshing your GitHub sign-in. This approval will finish when you return.';
        try { await signIn(); } catch (loginError) { sessionStorage.removeItem(pendingApprovalKey); error = (loginError as Error).message; }
      } else error = (e as Error).message;
    } finally { busy = false; }
  }
  function revoke(author: Author) { ask(`Remove @${author.login}?`, 'They will no longer be able to write or publish. Existing published posts will stay on the blog.', async () => { await api('/admin/authors/'+author.github_id,'DELETE',{}); await showAuthors(); }); }
  async function exportAll() { try { download('math-ai-blog-backup.json',JSON.stringify(await api('/admin/export'),null,2),'application/json'); } catch(e) { error = (e as Error).message; } }
</script>

<svelte:window onbeforeunload={guard} onkeydown={keydown} />
<Seo title="Blog editor — UW Math AI Lab" description="Write and publish on the UW Math AI Lab blog." path="/blog/write/" />
<svelte:head><meta name="robots" content="noindex,nofollow" /></svelte:head>
<dialog bind:this={dialog}><h2>{confirmTitle}</h2><p>{confirmBody}</p><div class="dialog-actions"><button class="button" onclick={() => dialog.close()}>Cancel</button><button class="button primary" onclick={confirm}>Confirm</button></div></dialog>
<section class="page-shell workspace">
  <div class="workspace-top"><a href={sitePath('/news/?view=blog')}>← Blog</a>{#if user}<div class="account"><span>@{user.login}</span><button onclick={logout} disabled={busy || saving}>Sign out</button></div>{/if}</div>
  {#if error}<div class="banner error" role="alert"><span>{error}</span><button aria-label="Dismiss error" onclick={() => error = ''}>×</button></div>{/if}
  {#if notice}<div class="banner" role="status">{notice}</div>{/if}
  {#if loading}<div class="waiting" aria-live="polite">Opening the editor…</div>
  {:else if !user}<div class="sign-in"><div class="sign-in-copy"><span class="eyebrow">THE LAB NOTEBOOK</span><h1>Share your work.</h1><p>Write about a result, an experiment,<br />or something you’re figuring out.</p><button class="button primary github" onclick={login} disabled={!ready}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.6 2.1 3.3 1.2.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.2 5 18.2 5.3 18.2 5.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.1c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .7z" /></svg>Sign in with GitHub</button><p class="fine">Posting is open to approved lab authors.</p>{#if !ready}<p class="setup-note">GitHub sign-in is being connected. Please check back shortly.</p>{/if}</div><div class="writing-card" aria-hidden="true"><span>UW MATH AI LAB</span><div class="sample-heading">Notes from<br />the work.</div><div class="sample-line"></div><div class="sample-line short"></div><div class="sample-math">∀ &nbsp; ∃</div><div class="sample-line"></div><div class="sample-line short"></div><div class="card-foot">DRAFT → PREVIEW → PUBLISH</div></div></div>
  {:else if !allowed}<div class="waiting"><span class="eyebrow">SIGNED IN AS @{user.login}</span><h1>You’re signed in.</h1><p>Your account hasn’t been approved to post yet. Contact Michael with your GitHub username to request author access.</p><button class="button" onclick={boot}>Check access again</button><a href={sitePath('/news/?view=blog')}>Read the blog →</a></div>
  {:else if !post}<header class="dashboard-head"><div><span class="eyebrow">BLOG EDITOR</span><h1>{section === 'authors' ? 'Authors' : 'Your writing'}</h1><p>{section === 'authors' ? 'Choose who can write for the lab.' : 'Draft, revise, and publish in one place.'}</p></div>{#if section === 'posts'}<button class="button primary" onclick={createPost} disabled={busy}>＋ New post</button>{/if}</header>
    <div class="dashboard-tabs"><button class:active={section === 'posts'} onclick={() => { section = 'posts'; void refresh(); }}>Posts <span>{posts.length}</span></button>{#if user.role === 'admin'}<button class:active={section === 'authors'} onclick={showAuthors}>Authors</button><button class="export" onclick={exportAll}>Export backup ↓</button>{/if}</div>
    {#if section === 'authors'}<form class="approve-form" onsubmit={(e) => { e.preventDefault(); void approve(); }}><label>GitHub username<input bind:value={authorLogin} placeholder="username" required autocomplete="off" maxlength="39" /></label><label>Access<select bind:value={authorRole}><option value="author">Author — own posts</option><option value="admin">Administrator — all posts and authors</option></select></label><button class="button primary" disabled={busy}>Approve author</button></form><div class="author-list"><div class="author-row"><div><strong>Michael R. Zeng</strong><span>@zengrf</span></div><span class="badge">Owner</span></div>{#each authors as a}<div class="author-row"><div><strong>{a.name}</strong><a href={'https://github.com/'+a.login}>@{a.login}</a></div><span class="badge">{a.role}</span><button class="text-button" onclick={() => revoke(a)} disabled={busy || a.github_id === user.id}>Remove</button></div>{/each}</div><p class="fine">Authors can edit their own posts. Administrators can manage all posts and author access.</p>
    {:else}<div class="dashboard-filter"><div><button class:active={filter === 'all'} onclick={() => filter = 'all'}>All</button><button class:active={filter === 'drafts'} onclick={() => filter = 'drafts'}>Drafts</button><button class:active={filter === 'published'} onclick={() => filter = 'published'}>Published</button></div><label><span class="sr-only">Search your posts</span><input type="search" bind:value={search} placeholder="Find a post…" /></label></div>
      {#if !visible.length}<div class="no-posts"><span aria-hidden="true">✎</span><h2>{posts.length ? 'No matching posts.' : 'Start with a thought.'}</h2><p>{posts.length ? 'Try another filter or search.' : 'Your drafts stay private until you publish.'}</p>{#if !posts.length}<button class="button" onclick={createPost} disabled={busy}>Write your first post →</button>{/if}</div>{:else}<div class="draft-list">{#each visible as p}<button class="draft-row" onclick={() => openPost(p.id)}><div><span class="badge" class:published={p.published}>{p.published ? 'Published' : 'Draft'}</span><h2>{p.title || 'Untitled post'}</h2><p>{p.summary || 'Add a summary to introduce this post.'}</p></div><div class="draft-meta"><span>{p.author_name}</span><span>{formatDate(p.updated_at)}</span><span aria-hidden="true">↗</span></div></button>{/each}</div>{/if}
    {/if}
  {:else}
    <div class="editor-actions"><button class="text-button" onclick={back} disabled={busy}>← All posts</button><span class="save-status" aria-live="polite">{saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'Saved to the lab'}</span><button class="button" onclick={() => save().catch(() => {})} disabled={saving || busy || !dirty}>Save draft</button><button class="button primary" onclick={publish} disabled={busy || uploading}>{busy ? 'Working…' : post.published ? 'Publish changes' : 'Publish'}</button></div>
    {#if recovery}<div class="banner"><div>There are unsaved changes from your previous session.{#if recovery.version < post.version} The server also has a newer version; restoring will replace the editor text.{/if}</div><button onclick={restore}>Restore</button><button onclick={discardRecovery}>Discard</button></div>{/if}
    {#if post.published}<div class="live-note">This post is published. Edits stay in draft until you publish changes. <a href={postPath(post.slug)} target="_blank" rel="noreferrer">View post ↗</a></div>{/if}
    <fieldset disabled={busy} class="editor-fields">
      <label class="title-label"><span class="sr-only">Post title</span><textarea class="title-input" rows="2" maxlength="180" bind:value={post.title} oninput={changed} placeholder="Your post title"></textarea></label>
      <label class="summary-label">Summary<textarea rows="2" maxlength="420" bind:value={post.summary} oninput={changed} placeholder="A few sentences to introduce the post."></textarea></label>
      <div class="details-grid"><label>Post URL<input bind:value={post.slug} oninput={changed} readonly={!!post.published_at} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxlength="100" /><small>{post.published_at ? 'Fixed after first publication.' : 'Lowercase letters, numbers, and hyphens.'}</small></label><label>Topics<input bind:value={tagText} oninput={changed} placeholder="Lean, interpretability, algebra" /><small>Up to five, separated by commas.</small></label></div>
      <div class="cover-editor">{#if post.cover}<img src={post.cover} alt={post.cover_alt || 'Cover preview'} /><div><label>Image description<input bind:value={post.cover_alt} oninput={changed} placeholder="Describe the cover image" maxlength="300" /></label><button class="text-button" onclick={() => { if(post) post.cover = ''; changed(); }}>Remove cover</button></div>{:else}<button class="button" onclick={() => coverInput?.click()} disabled={uploading}>＋ Cover image</button><span class="fine">Optional · JPEG, PNG, or WebP · up to 5 MB</span>{/if}</div>
      <input hidden aria-label="Upload cover image" type="file" accept="image/jpeg,image/png,image/webp" bind:this={coverInput} onchange={(e) => upload(e,true)} />
      <input hidden aria-label="Upload post image" type="file" accept="image/jpeg,image/png,image/webp" bind:this={imageInput} onchange={(e) => upload(e)} />
      <div class="composition-tools"><div class="format-tools" aria-label="Formatting"><button title="Heading" onclick={() => insert('\n## ','','Heading')}>H₂</button><button title="Bold (⌘/Ctrl B)" onclick={() => insert('**','**')}>B</button><button title="Italic (⌘/Ctrl I)" onclick={() => insert('*','*')}><i>I</i></button><button title="Link" onclick={() => insert('[','](https://example.com)','link text')}>Link</button><button title="Bullet list" onclick={() => insert('\n- ','','List item')}>List</button><button title="Quote" onclick={() => insert('\n> ','','Quote')}>Quote</button><button title="Code block" onclick={() => insert('\n```\n','\n```\n','code')}>Code</button><button title="Math equation" onclick={() => insert('\n$$\n','\n$$\n','E = mc^2')}>∑</button><button title="Upload image" disabled={uploading} onclick={() => imageInput?.click()}>{uploading ? 'Uploading…' : 'Image'}</button></div><div class="mode-tabs" aria-label="Editor view"><button class:active={mode === 'write'} onclick={() => mode = 'write'}>Write</button><button class="split-tab" class:active={mode === 'split'} onclick={() => mode = 'split'}>Split</button><button class:active={mode === 'preview'} onclick={() => mode = 'preview'}>Preview</button></div></div>
      <div class="composition" class:split={mode === 'split'} class:preview-only={mode === 'preview'}>{#if mode !== 'preview'}<div class="write-pane"><label class="sr-only" for="blog-body">Post text in Markdown</label><textarea id="blog-body" bind:this={textarea} bind:value={post.body} oninput={changed} spellcheck="true" placeholder={'Start writing…\n\nUse Markdown for headings, links, lists, and code. Math works with $…$ and $$…$$.'}></textarea></div>{/if}{#if mode !== 'write'}<div class="preview-pane"><span class="pane-label">PREVIEW</span>{#if post.body}<BlogProse body={post.body} />{:else}<p class="preview-placeholder">Your writing will appear here.</p>{/if}</div>{/if}</div>
    </fieldset>
    <div class="editor-bottom"><span>{post.body.trim() ? post.body.trim().split(/\s+/).length : 0} words · Markdown</span><button class="text-button" onclick={exportPost}>Download draft ↓</button>{#if post.published}<button class="text-button" onclick={unpublish} disabled={busy}>Unpublish</button>{:else}<button class="text-button danger" onclick={removePost} disabled={busy}>Delete draft</button>{/if}</div>
    <details class="writing-help"><summary>Writing help</summary><p>Use <code>## Heading</code>, <code>**bold**</code>, <code>*italic*</code>, <code>[label](https://…)</code>, and <code>- list item</code>. Put code between triple backticks.</p><p>Use <code>$…$</code> for inline mathematics and <code>$$…$$</code> for a displayed equation. Raw HTML is displayed as text. Uploaded images are accessible to anyone with their link.</p><p>Changes save automatically after a short pause. Press ⌘S or Ctrl+S to save immediately.</p></details>
  {/if}
</section>

<style>
  .workspace { padding-top: 2rem; }
  .workspace-top { display: flex; justify-content: space-between; align-items: center; gap: 1rem; font: .9rem var(--font-sans); margin-bottom: 2rem; }
  .workspace-top a { text-decoration: none; color: var(--muted); }
  .account { display: flex; align-items: center; gap: 1.3rem; }
  .account button,.text-button { border: 0; background: none; color: var(--purple); padding: .5rem 0; cursor: pointer; font: .9rem var(--font-sans); }
  .eyebrow { font: 600 .8rem var(--font-sans); letter-spacing: .12em; color: var(--purple); }
  .sign-in { display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; gap: 5rem; padding: 3rem 0 4rem; }
  .sign-in h1 { font-size: clamp(3rem,5vw,4.5rem); line-height: 1.1; margin: 1rem 0; }
  .sign-in-copy>p { font-size: 1.3rem; color: var(--muted); }
  .github { gap: .7rem; margin-top: 1rem; } .github svg { width: 1.15rem; height: 1.15rem; }
  .fine,.sign-in-copy>.fine { font: .85rem/1.6 var(--font-sans); color: var(--muted); }
  .setup-note { font-size: 1rem !important; }
  .writing-card { padding: 2rem; background: var(--surface); border: 1px solid var(--line-strong); box-shadow: 8px 8px 0 var(--soft-purple); transform: rotate(2deg); }
  .writing-card>span,.card-foot { font: .7rem var(--font-sans); letter-spacing: .12em; color: var(--muted); }
  .sample-heading { font-size: 2.7rem; line-height: 1.2; margin: 1.5rem 0; }
  .sample-line { height: 1px; background: var(--line); margin: .85rem 0; } .sample-line.short { width: 72%; }
  .sample-math { text-align: center; font-size: 2.5rem; color: var(--purple); margin: 1.5rem; }
  .card-foot { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--line); }
  .waiting { max-width: 650px; margin: 4rem auto; } .waiting h1 { font-size: 3rem; margin-top: 1rem; } .waiting p { font-size: 1.2rem; } .waiting a { margin-left: 1.5rem; }
  .banner { display: flex; align-items: center; gap: 1rem; justify-content: space-between; background: var(--soft-purple); border-left: 3px solid var(--purple); padding: .9rem 1rem; margin: 1rem 0; font: .95rem/1.5 var(--font-sans); }
  .banner.error { border-color: #b54732; background: color-mix(in srgb,#b54732 9%,var(--surface)); }
  .banner button { border: 0; background: none; color: inherit; cursor: pointer; white-space: nowrap; }
  .dashboard-head { display: flex; justify-content: space-between; align-items: center; gap: 2rem; margin: 3rem 0 2rem; }
  .dashboard-head h1 { font-size: clamp(2.5rem,5vw,3.8rem); margin: .5rem 0; }
  .dashboard-head p { margin: 0; color: var(--muted); font-size: 1.2rem; }
  .dashboard-tabs { display: flex; gap: 2rem; border-bottom: 1px solid var(--line-strong); }
  .dashboard-tabs button { padding: .8rem 0; border: 0; border-bottom: 2px solid transparent; background: none; color: var(--muted); font: .95rem var(--font-sans); cursor: pointer; }
  .dashboard-tabs button.active { border-color: var(--purple); color: var(--purple); }
  .dashboard-tabs span { margin-left: .6rem; } .dashboard-tabs .export { margin-left: auto; font-size: .8rem; }
  .dashboard-filter { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.2rem 0; }
  .dashboard-filter>div { display: flex; gap: .3rem; } .dashboard-filter button { padding: .5rem .7rem; border: 1px solid transparent; background: none; color: var(--muted); font: .85rem var(--font-sans); cursor: pointer; }
  .dashboard-filter button.active { border-color: var(--line); color: var(--text); background: var(--soft); }
  input, select { width: 100%; background: var(--surface); border: 1px solid var(--line-strong); padding: .7rem; color: var(--text); font: .95rem var(--font-sans); min-height: 42px; border-radius: 0; }
  .dashboard-filter input { max-width: 240px; }
  .no-posts { text-align: center; padding: 4rem 1rem; border-bottom: 1px solid var(--line); } .no-posts>span { color: var(--purple); font-size: 3rem; } .no-posts h2 { font-size: 2rem; } .no-posts p { color: var(--muted); }
  .draft-row { text-align: left; width: 100%; padding: 1.5rem 0; background: transparent; color: var(--text); border: 0; border-top: 1px solid var(--line); display: grid; grid-template-columns: 1fr auto; gap: 2rem; cursor: pointer; }
  .draft-row:hover h2 { color: var(--purple); } .draft-row h2 { font-size: 1.65rem; margin: .6rem 0; } .draft-row p { color: var(--muted); margin: 0; font-size: 1.05rem; }
  .badge { display: inline-block; font: .75rem var(--font-sans); text-transform: uppercase; letter-spacing: .06em; padding: .3rem .5rem; border: 1px solid var(--line); background: var(--soft); color: var(--muted); }
  .badge.published { color: var(--purple); background: var(--soft-purple); border-color: var(--purple); }
  .draft-meta { display: flex; flex-direction: column; align-items: end; justify-content: center; gap: .5rem; font: .8rem var(--font-sans); color: var(--muted); }
  .approve-form { display: grid; grid-template-columns: 1fr 1.2fr auto; align-items: end; gap: 1rem; margin: 2rem 0; }
  label { display: block; font: .85rem/1.6 var(--font-sans); color: var(--muted); } label input,label select { margin-top: .3rem; }
  .author-row { display: flex; align-items: center; gap: 1.5rem; border-top: 1px solid var(--line); padding: 1.2rem 0; font-family: var(--font-sans); }
  .author-row>div { flex: 1; display: flex; flex-direction: column; gap: .3rem; } .author-row span,.author-row a { font-size: .85rem; color: var(--muted); }
  .editor-actions { position: sticky; top: 3.6rem; z-index: 10; background: var(--bg); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: .8rem; padding: .9rem 0; }
  .save-status { margin-left: auto; font: .8rem var(--font-sans); color: var(--muted); }
  .live-note { font: .85rem/1.6 var(--font-sans); padding: 1rem 0 0; color: var(--muted); } .live-note a { color: var(--purple); margin-left: .7rem; }
  .editor-fields { margin: 1.5rem 0 0; padding: 0; border: 0; min-width: 0; }
  textarea { border: 1px solid var(--line); border-radius: 0; background: var(--surface); color: var(--text); width: 100%; resize: vertical; font: 1rem/1.6 var(--font-serif); padding: .8rem; }
  .title-input { border: none; padding: .3rem 0; font: 500 clamp(2rem,4vw,3.2rem)/1.2 var(--font-serif); background: transparent; min-height: 125px; resize: none; }
  .summary-label textarea { margin-top: .3rem; font-size: 1.15rem; }
  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 1.2rem 0; }
  label small { display: block; font-size: .78rem; margin-top: .3rem; }
  .cover-editor { display: flex; align-items: center; gap: 1.3rem; padding: 1rem 0 1.5rem; }
  .cover-editor img { width: 180px; height: 105px; object-fit: cover; } .cover-editor>div { flex: 1; }
  .composition-tools { border: 1px solid var(--line-strong); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; background: var(--surface); }
  .format-tools,.mode-tabs { display: flex; flex-wrap: wrap; align-items: center; }
  .composition-tools button { min-height: 42px; padding: .6rem .65rem; font: .85rem var(--font-sans); border: none; background: transparent; color: var(--muted); cursor: pointer; }
  .composition-tools button:hover { background: var(--soft); color: var(--text); }
  .mode-tabs { border-left: 1px solid var(--line); } .mode-tabs button.active { color: var(--purple); background: var(--soft-purple); }
  .composition { border: 1px solid var(--line-strong); border-top: 0; min-height: 480px; background: var(--surface); }
  .composition.split { display: grid; grid-template-columns: 1fr 1fr; } .write-pane { min-width: 0; display: flex; }
  .write-pane textarea { border: 0; padding: 1.5rem; font: .95rem/1.8 var(--font-mono); min-height: 480px; resize: vertical; }
  .preview-pane { padding: 1.5rem; min-width: 0; overflow: auto; border-left: 1px solid var(--line); }
  .preview-only .preview-pane { border: 0; max-width: 800px; margin: auto; padding: 2rem; }
  .pane-label { font: .7rem var(--font-sans); letter-spacing: .1em; color: var(--muted); display: block; margin-bottom: 1.5rem; }
  .preview-placeholder { color: var(--muted); font-style: italic; }
  .editor-bottom { display: flex; align-items: center; flex-wrap: wrap; gap: 1.5rem; padding: 1rem 0; font: .85rem var(--font-sans); }
  .editor-bottom>span { margin-right: auto; color: var(--muted); } .danger { color: #b54732; }
  .writing-help { margin-top: .5rem; padding: 1rem 0; border-top: 1px solid var(--line); font: .9rem/1.7 var(--font-sans); color: var(--muted); } .writing-help summary { cursor: pointer; } .writing-help code { font-size: .85em; background: var(--soft); padding: .2rem; }
  dialog { width: min(500px,calc(100vw - 2rem)); padding: 2rem; border: 1px solid var(--line-strong); background: var(--surface); color: var(--text); box-shadow: var(--shadow); } dialog::backdrop { background: #0008; } dialog h2 { font-size: 1.8rem; } .dialog-actions { display: flex; justify-content: end; gap: 1rem; margin-top: 2rem; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  @media(max-width:900px) { .sign-in { gap: 2rem; } .split-tab { display: none; } .composition.split { display: block; } .split .preview-pane { display: none; } .approve-form { grid-template-columns: 1fr 1fr; } .approve-form button { grid-column: 1/-1; justify-self: start; } }
  @media(max-width:600px) { .workspace { padding-top: 1.5rem; } .sign-in { grid-template-columns: 1fr; padding-top: 1rem; } .writing-card { max-width: 350px; margin: 1.5rem 1rem; } .dashboard-head { align-items: start; flex-direction: column; gap: 1rem; } .dashboard-filter { flex-wrap: wrap; } .dashboard-filter input { max-width: 100%; } .dashboard-filter label { width: 100%; } .draft-row { gap: 1rem; grid-template-columns: 1fr; } .draft-meta { flex-direction: row; justify-content: start; } .approve-form { grid-template-columns: 1fr; } .editor-actions { flex-wrap: wrap; gap: .5rem; } .editor-actions .button { font-size: .8rem; padding: .6rem .7rem; } .save-status { font-size: .75rem; } .details-grid { grid-template-columns: 1fr; gap: 1rem; } .cover-editor { flex-wrap: wrap; } .cover-editor .fine { width: 100%; } .mode-tabs { width: 100%; border-left: 0; border-top: 1px solid var(--line); } .write-pane textarea { padding: 1rem; } .banner { flex-wrap: wrap; } .editor-bottom { gap: 1rem; } .title-input { min-height: 105px; } .preview-only .preview-pane { padding: 1rem; } .dashboard-tabs { gap: 1.5rem; } }
</style>
