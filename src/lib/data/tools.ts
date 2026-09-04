import content from '../../content/tools.yaml';
import type { LabTool } from '$lib/content/schema';
export type { LabTool } from '$lib/content/schema';
export type ToolStat = LabTool['stats'][number];
export type ToolLink = LabTool['links'][number];

export const labTools = content as LabTool[];
