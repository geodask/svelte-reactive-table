<script lang="ts">
	import { cn } from '$shared/lib/shadcn.js';
	import type { HighlightedTocItem } from '$shared/lib/toc';
	import { List } from '@lucide/svelte';

	const { items = [] }: { items: HighlightedTocItem[] } = $props();
</script>

<aside class="sticky top-24 hidden w-56 shrink-0 self-start lg:block">
	<nav class="pr-4">
		<div
			class="flex items-center gap-2 border-b border-border pb-3 text-sm font-semibold text-foreground"
		>
			<List class="size-4" />
			<span>On this page</span>
		</div>
		<div class="mt-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
			{@render TocList(items)}
		</div>
	</nav>
</aside>

{#snippet TocList(tocItems: HighlightedTocItem[], className: string = '')}
	{#if tocItems.length > 0}
		<ul class={cn('space-y-0.5', className)}>
			{#each tocItems as item (item.url)}
				<li>
					<a
						href={item.url}
						class={cn(
							'block truncate py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground',
							{
								'font-medium text-primary': item.isFocused,
								'text-foreground': item.hasFocusedChildren
							}
						)}
					>
						{item.title}
					</a>
				</li>

				{#if item.items?.length > 0}
					{@render TocList(item.items, 'ml-0.5 border-l border-border pl-4')}
				{/if}
			{/each}
		</ul>
	{/if}
{/snippet}
