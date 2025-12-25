<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	interface NavLink {
		title: string;
		href: string;
	}

	interface Props {
		prev?: NavLink;
		next?: NavLink;
	}

	const { prev, next }: Props = $props();
</script>

{#if prev || next}
	<nav class="flex flex-col sm:flex-row gap-4 my-8 py-8 border-t border-border">
		{#if prev}
			<a
				href={prev.href}
				class="flex-1 flex items-center gap-3 p-4 rounded-lg bg-card border border-border text-inherit no-underline transition-colors hover:border-primary/50 group"
			>
				<ChevronLeft
					class="size-5 text-muted-foreground shrink-0 transition-colors group-hover:text-primary"
				/>
				<div class="flex flex-col gap-0.5">
					<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Previous
					</span>
					<span class="text-sm font-semibold text-foreground">
						{prev.title}
					</span>
				</div>
			</a>
		{:else}
			<div class="flex-1"></div>
		{/if}

		{#if next}
			<a
				href={next.href}
				class="flex-1 flex items-center gap-3 p-4 rounded-lg bg-card border border-border text-inherit no-underline transition-colors hover:border-primary/50 justify-end text-right group"
			>
				<div class="flex flex-col gap-0.5">
					<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Next
					</span>
					<span class="text-sm font-semibold text-foreground">
						{next.title}
					</span>
				</div>
				<ChevronRight
					class="size-5 text-muted-foreground shrink-0 transition-colors group-hover:text-primary"
				/>
			</a>
		{:else}
			<div class="flex-1"></div>
		{/if}
	</nav>
{/if}
