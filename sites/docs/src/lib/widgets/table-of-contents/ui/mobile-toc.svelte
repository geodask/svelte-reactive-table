<script lang="ts">
	import { cn } from '$shared/lib/shadcn.js';
	import type { HighlightedTocItem } from '$shared/lib/toc';
	import { ChevronDown, List } from '@lucide/svelte';
	import * as Popover from '$shared/ui/shadcn/popover';

	const { items = [] }: { items: HighlightedTocItem[] } = $props();

	let isOpen = $state(false);

	function handleItemClick() {
		isOpen = false;
	}
</script>

{#if items.length > 0}
	<div class="sticky top-0 z-10 mb-4 lg:hidden">
		<Popover.Root bind:open={isOpen}>
			<Popover.Trigger
				class="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground"
			>
				<span class="flex items-center gap-2">
					<List class="size-4" />
					On this page
				</span>
				<ChevronDown
					class={cn('size-4 transition-transform duration-200', isOpen && 'rotate-180')}
				/>
			</Popover.Trigger>
			<Popover.Content
				class="max-h-[60vh] w-(--bits-popover-anchor-width) overflow-y-auto overscroll-contain p-3"
				sideOffset={8}
				align="start"
			>
				{@render TocList(items, false)}
			</Popover.Content>
		</Popover.Root>
	</div>
{/if}

{#snippet TocList(tocItems: HighlightedTocItem[], nested: boolean)}
	{#if tocItems.length > 0}
		<ul class={cn('space-y-0.5 p-2', nested && 'ml-0.5 border-l border-border pl-4')}>
			{#each tocItems as item (item.url)}
				<li>
					<a
						href={item.url}
						onclick={handleItemClick}
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
					{@render TocList(item.items, true)}
				{/if}
			{/each}
		</ul>
	{/if}
{/snippet}
