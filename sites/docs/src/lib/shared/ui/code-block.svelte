<script lang="ts">
	import { useClipboard } from '$shared/lib/clipboard.svelte';
	import { Button } from '$shared/ui/shadcn/button';
	import ScrollArea from '$shared/ui/shadcn/scroll-area/scroll-area.svelte';
	import { Check, Copy } from '@lucide/svelte';
	import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
	import { codeToHtml } from 'shiki';
	import { fade } from 'svelte/transition';

	type CodeblockProps = {
		lang: string;
		code: string;
		title?: string;
	};

	const { lang, code, title }: CodeblockProps = $props();

	const clipboard = useClipboard();

	// Unescape code that was escaped by mdsvex's escapeSvelte
	function unescapeSvelte(str: string): string {
		return str
			.replace(/&#123;/g, '{')
			.replace(/&#125;/g, '}')
			.replace(/&commat;/g, '@')
			.replace(/&lbrace;/g, '{')
			.replace(/&rbrace;/g, '}')
			.replace(/&lcub;/g, '{')
			.replace(/&rcub;/g, '}');
	}

	const unescapedCode = $derived(unescapeSvelte(code));

	const html = $derived(
		await codeToHtml(unescapedCode, {
			lang,
			themes: {
				light: 'github-light',
				dark: 'github-dark'
			},
			transformers: [transformerNotationDiff(), transformerNotationHighlight()]
		})
	);
</script>

<div class="rounded-md bg-muted not-prose overflow-hidden">
	{#if title}
		<div class="flex items-center px-4 py-2 border-b border-border">
			<span class="font-medium text-base">{title}</span>F
		</div>
	{/if}

	<div class="relative text-sm">
		<Button
			onclick={() => clipboard.copy()}
			variant="ghost"
			size="icon"
			class="size-8 z-10 absolute bg-muted right-2 top-2"
		>
			{#if clipboard.copied}
				<div in:fade={{ duration: 80 }}>
					<Check class="text-emerald-500" />
				</div>
			{:else}
				<div in:fade={{ duration: 200 }}>
					<Copy />
				</div>
			{/if}
		</Button>
		<ScrollArea orientation="both" viewportClass="h-fit max-h-[600px]">
			<div use:clipboard.readText>
				{@html html}
			</div>
		</ScrollArea>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(pre code) {
		display: grid;
		counter-reset: line;
	}

	:global(.line::before) {
		counter-increment: line;
		content: counter(line);
		display: inline-block;
		width: 1rem;
		margin-right: 2rem;
		text-align: right;
		color: gray;
	}

	:global(pre code) {
		@apply grow py-4 h-full m-0 block!;
	}

	:global(pre span.line) {
		@apply inline-block w-full px-4!;
	}

	:global(pre span.line.highlighted) {
		@apply bg-yellow-200/50!;
	}

	:global(.dark pre span.line.highlighted) {
		@apply bg-yellow-400/20!;
	}

	:global(pre span.line.diff.add) {
		@apply bg-green-300/50!;
	}

	:global(pre span.line.diff.remove) {
		@apply bg-red-300/50!;
	}

	:global(.dark pre span.line.diff.add) {
		@apply bg-green-600/20!;
	}
	:global(.dark pre span.line.diff.remove) {
		@apply bg-red-600/20!;
	}
</style>
