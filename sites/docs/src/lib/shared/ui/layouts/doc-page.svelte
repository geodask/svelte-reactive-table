<script lang="ts" module>
	export { h2, h3, pre } from '../markdown';
</script>

<script lang="ts">
	import { type BreadcrumbItem } from '$shared/lib/breadcrumb.svelte';
	import { cn } from '$shared/lib/shadcn';
	import * as Breadcrumb from '$shared/ui/shadcn/breadcrumb';
	import PageNavigation from '$shared/ui/page-navigation.svelte';
	import { BookOpen } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface NavLink {
		title: string;
		href: string;
	}

	interface Props {
		children: Snippet;
		breadcrumb?: string[];
		prev?: NavLink;
		next?: NavLink;
	}

	const { children, breadcrumb: breadcrumbPath = [], prev, next }: Props = $props();

	const frontmatterItems: BreadcrumbItem[] = $derived(
		breadcrumbPath.length > 0
			? [
					{ icon: BookOpen, href: '/docs/introduction' },
					...breadcrumbPath.map((title) => ({ title }))
				]
			: []
	);

	const items = $derived(frontmatterItems);
</script>

{#snippet BreacrumbContent(item: BreadcrumbItem)}
	{#if item.icon}
		{@const Icon = item.icon}
		<Icon class="size-5" />
	{/if}
	{item.title}
{/snippet}

<Breadcrumb.Root class="mb-8">
	<Breadcrumb.List class="text-base">
		{#each items as item}
			<Breadcrumb.Item>
				{#if item.href}
					<Breadcrumb.Link href={item.href}>
						{@render BreacrumbContent(item)}
					</Breadcrumb.Link>
				{:else}
					<Breadcrumb.Page
						class={cn({
							'text-muted-foreground': item === items[items.length - 1]
						})}
					>
						{@render BreacrumbContent(item)}
					</Breadcrumb.Page>
				{/if}
			</Breadcrumb.Item>
			{#if item !== items[items.length - 1]}
				<Breadcrumb.Separator />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>

<div class="prose prose-base max-w-none dark:prose-invert relative pb-10">
	{@render children()}
</div>

<PageNavigation {prev} {next} />
