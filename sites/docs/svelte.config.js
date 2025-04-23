import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import path from 'node:path';
import { codeToHtml } from 'shiki';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx'],
			highlight: {
				highlighter: async (code, lang) => {
					const html = escapeSvelte(await codeToHtml(code, { lang, theme: 'vesper' }));
					return `\`${html}\``;
				}
			}
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			$pages: 'src/lib/pages',
			$entities: 'src/lib/entities',
			$features: 'src/lib/features',
			$shared: 'src/lib/shared',
			$widgets: 'src/lib/widgets'
		}
	}
};

export default config;
