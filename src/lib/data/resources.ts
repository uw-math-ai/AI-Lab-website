import coursesContent from '../../content/resources/courses.yaml';
import seminarsContent from '../../content/resources/seminars.yaml';
import resourcesContent from '../../content/resources/resources.yaml';
import type { ContentBlock } from '$lib/content/schema';

export const courses = coursesContent as { blocks: ContentBlock[] };
export const seminars = seminarsContent as { blocks: ContentBlock[] };
export const resources = resourcesContent as { blocks: ContentBlock[] };
