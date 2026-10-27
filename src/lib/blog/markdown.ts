import MarkdownIt from 'markdown-it';
// User-authored raw HTML and unsafe link protocols are never accepted.
const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
md.renderer.rules.image = (tokens, idx) => {
  const t = tokens[idx], src = String(t.attrGet('src') || '');
  if (!/^https:\/\//i.test(src)) return md.utils.escapeHtml(t.content);
  return `<img src="${md.utils.escapeHtml(src)}" alt="${md.utils.escapeHtml(t.content)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
};
const link = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => { tokens[idx].attrSet('rel', 'noopener noreferrer'); return link(tokens, idx, options, env, self); };
// Preserve TeX before Markdown handles backslashes and underscores. KaTeX renders
// these text nodes with trust=false; code spans/fences are excluded by its scanner.
md.inline.ruler.before('escape', 'math', (state, silent) => {
  const start = state.pos; if (state.src[start] !== '$') return false;
  const delimiter = state.src[start + 1] === '$' ? '$$' : '$';
  const end = state.src.indexOf(delimiter, start + delimiter.length); if (end < 0) return false;
  if (!silent) { const t = state.push('math', '', 0); t.content = state.src.slice(start, end + delimiter.length); }
  state.pos = end + delimiter.length; return true;
});
md.renderer.rules.math = (tokens, idx) => `<span class="blog-tex">${md.utils.escapeHtml(tokens[idx].content)}</span>`;
export const renderBlogMarkdown = (text: string) => md.render(text);
