import type { LabEvent, NewsItem } from '$lib/content/schema';
import type { Post } from '$lib/blog/client';
import { eventRange } from '$lib/calendar';

export type UpdateView = 'all' | 'news' | 'events' | 'blog';
export type Update =
  | { kind: 'news'; id: string; title: string; timestamp: number; news: NewsItem }
  | { kind: 'events'; id: string; title: string; timestamp: number; event: LabEvent }
  | { kind: 'blog'; id: string; title: string; timestamp: number; post: Post };
export const eventId = (event: LabEvent) => `event-${event.date}-${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
export function timeline(news: NewsItem[], events: LabEvent[], posts: Post[], now: number): Update[] {
  return [
    ...news.map(news => ({ kind: 'news' as const, id: news.id, title: news.title, timestamp: Date.parse(news.date + 'T12:00:00Z'), news })),
    ...events.filter(event => eventRange(event).end < now).map(event => ({ kind: 'events' as const, id: eventId(event), title: event.title, timestamp: eventRange(event).start, event })),
    ...posts.map(post => ({ kind: 'blog' as const, id: `post-${post.id}`, title: post.title, timestamp: post.published_at, post }))
  ].sort((a,b) => b.timestamp - a.timestamp || a.id.localeCompare(b.id));
}
export function matchesUpdate(item: Update, query: string) {
  const text = item.kind === 'news' ? `${item.title} ${item.news.summary}` : item.kind === 'blog' ? `${item.title} ${item.post.summary} ${item.post.author.name} ${item.post.tags.join(' ')}` : eventSearchText(item.event);
  return text.toLowerCase().includes(query.trim().toLowerCase());
}
export const eventSearchText = (event: LabEvent) => `${event.title} ${event.type} ${event.speaker ?? ''} ${event.location ?? ''} ${event.abstract ?? ''} ${(event.details ?? []).join(' ')} ${(event.papers ?? []).map(p => p.title).join(' ')}`;
export const displayDay = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
