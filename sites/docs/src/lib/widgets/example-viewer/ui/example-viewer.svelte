<script lang="ts">
	import CodeBlock from '$shared/ui/code-block.svelte';
	import TabItem from '$shared/ui/tab-item.svelte';
	import Tabs from '$shared/ui/tabs.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		source: string;
		title?: string;
		preview: Snippet;
		defaultTab?: 'Preview' | 'Code';
	};

	const { source, title, preview, defaultTab = 'Preview' }: Props = $props();
	const items = ['Preview', 'Code'];
</script>

<div class="not-prose my-6">
	{#if title}
		<div class="mb-2 font-medium text-sm text-muted-foreground">{title}</div>
	{/if}

	<Tabs value={defaultTab} {items}>
		<TabItem value="Preview">
			{@render preview()}
		</TabItem>

		<TabItem value="Code">
			<CodeBlock lang="svelte" code={source} />
		</TabItem>
	</Tabs>
</div>
