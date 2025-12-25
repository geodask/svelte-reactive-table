import rehypeSectionize from '@hbsnow/rehype-sectionize';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import path from 'path';
import rehypeSlug from 'rehype-slug';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			rehypePlugins: [rehypeSlug, [rehypeSectionize, { idPropertyName: 'data-section-id' }]],
			layout: {
				docPage: path.join(__dirname, './src/lib/shared/ui/layouts/doc-page.svelte')
			},
			highlight: {
				highlighter: async (code, lang, meta) => {
					const titleMatch = meta?.match(/title="([^"]+)"/);
					const title = titleMatch ? titleMatch[1] : '';
					const escapedCode = escapeSvelte(code);
					return `<Components.pre title="${title}" lang="${lang}" code={\`${escapedCode}\`} />`;
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
