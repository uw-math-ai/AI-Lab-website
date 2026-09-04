import content from '../../content/pages.yaml';
import type { z } from 'zod';
import type { pagesSchema } from '$lib/content/schema';

// All YAML imports are schema-validated by the Vite content plugin.
export const pages = content as z.infer<typeof pagesSchema>;
