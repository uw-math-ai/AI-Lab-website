import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { yamlContent } from './scripts/yaml-content';
import { mathSymbols } from './scripts/math-symbols';

export default defineConfig({
	plugins: [yamlContent(), mathSymbols(), sveltekit()]
});
