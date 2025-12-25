import { defineConfig, s } from 'velite';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Custom Velite transformer that extracts source code from colocated
 * Svelte components in the same directory as the markdown file.
 *
 * Looks for:
 * 1. example.svelte - single example pattern
 * 2. variants/*.svelte - multiple examples pattern
 */
function extractExampleSource() {
	return s.custom().transform(async (_, { meta }) => {
		// meta.history[0] contains the absolute path to the markdown file
		const mdFilePath = meta.history?.[0];
		if (!mdFilePath) return [];

		const absoluteDir = path.dirname(mdFilePath);
		const examples = [];

		// Try single example.svelte first
		const examplePath = path.join(absoluteDir, 'example.svelte');
		try {
			const source = await fs.readFile(examplePath, 'utf-8');
			examples.push({ name: 'example', source, path: 'example.svelte' });
		} catch {
			// No single example, check for variants folder
			const variantsDir = path.join(absoluteDir, 'variants');
			try {
				const files = await fs.readdir(variantsDir);
				for (const file of files.filter((f) => f.endsWith('.svelte'))) {
					const source = await fs.readFile(path.join(variantsDir, file), 'utf-8');
					examples.push({
						name: file.replace('.svelte', ''),
						source,
						path: `variants/${file}`
					});
				}
			} catch {
				// No variants folder either - that's fine, not all docs have examples
			}
		}

		return examples;
	});
}

export default defineConfig({
	root: './src/routes',
	collections: {
		docs: {
			name: 'Doc',
			pattern: 'docs/**/*.md',
			schema: s.object({
				toc: s.toc({ minDepth: 2 }),
				path: s.path().transform((path) => {
					const parts = path.split('/');
					parts.pop(); // Remove the last part ("+page")
					return '/' + parts.join('/');
				}),
				examples: extractExampleSource()
			})
		}
	}
});
