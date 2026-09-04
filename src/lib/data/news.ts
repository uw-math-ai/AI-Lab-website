import content from '../../content/news.yaml';
import type { NewsItem } from '$lib/content/schema';

export const labNews = (content as NewsItem[]).toSorted((a, b) => b.date.localeCompare(a.date));
