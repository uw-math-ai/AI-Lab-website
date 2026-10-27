<script lang="ts">
  import { browser } from '$app/environment';
  import { sitePath } from '$lib/paths';
  import { renderBlogMarkdown } from '$lib/blog/markdown';
  import { tick } from 'svelte';
  let { body }: { body: string } = $props();
  let element: HTMLDivElement;
  let rendered = $derived(renderBlogMarkdown(body));
  $effect(() => {
    rendered;
    if (!browser) return;
    let cancelled = false;
    async function typeset() {
      await tick();
      const w = window as unknown as { renderMathInElement?: (el: HTMLElement, options: object) => void; blogMath?: Promise<void> };
      w.blogMath ??= (async () => {
        for (const file of ['katex.min.js', 'contrib/auto-render.min.js']) await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script'); script.src = sitePath('/vendor/katex/' + file); script.onload = () => resolve(); script.onerror = () => reject(new Error('Math library unavailable')); document.head.appendChild(script);
        });
      })();
      try { await w.blogMath; if (!cancelled && element) w.renderMathInElement?.(element, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false, trust: false, strict: 'warn' }); } catch { w.blogMath = undefined; }
    }
    void typeset(); return () => { cancelled = true; };
  });
</script>
<svelte:head><link rel="stylesheet" href={sitePath('/vendor/katex/katex.min.css')} /></svelte:head>
<div class="blog-prose" bind:this={element}>{@html rendered}</div>
<style>
  .blog-prose { font-size: 1.18rem; line-height: 1.8; overflow-wrap: anywhere; }
  .blog-prose :global(p) { margin: 0 0 1.25em; }
  .blog-prose :global(h2) { font-size: 1.8rem; margin: 2em 0 .65em; line-height: 1.25; }
  .blog-prose :global(h3) { font-size: 1.4rem; margin: 1.6em 0 .5em; }
  .blog-prose :global(h1) { font-size: 2rem; margin: 1em 0; }
  .blog-prose :global(a) { color: var(--purple); }
  .blog-prose :global(pre) { padding: 1.2rem; background: var(--soft); border: 1px solid var(--line); overflow: auto; font: .86rem/1.65 var(--font-mono); }
  .blog-prose :global(code) { font-family: var(--font-mono); font-size: .82em; }
  .blog-prose :global(blockquote) { margin: 1.5rem 0; border-left: 3px solid var(--purple); padding: .3rem 1.5rem; color: var(--muted); }
  .blog-prose :global(img) { max-width: 100%; height: auto; display: block; margin: auto; }
  .blog-prose :global(table) { display: block; overflow: auto; border-collapse: collapse; font-size: .95rem; }
  .blog-prose :global(th), .blog-prose :global(td) { padding: .7rem; border: 1px solid var(--line); }
  .blog-prose :global(.katex-display) { overflow-x: auto; overflow-y: hidden; padding: .4rem 0; }
  .blog-prose :global(hr) { border: 0; border-top: 1px solid var(--line); margin: 2rem 0; }
</style>
