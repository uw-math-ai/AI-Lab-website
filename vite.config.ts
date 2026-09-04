import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { yamlContent } from './scripts/yaml-content';

export default defineConfig({
	plugins: [yamlContent(), sveltekit()]
});
