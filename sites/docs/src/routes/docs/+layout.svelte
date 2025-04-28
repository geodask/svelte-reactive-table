<script lang="ts">
	import * as Sidebar from '$shared/ui/shadcn/sidebar';
	import { Header } from '$widgets/header';
	import { MenuSidebar } from '$widgets/menu-sidebar';
	import { List } from '@lucide/svelte';
	import { page } from '$app/state';
	import { cn } from '$shared/lib/shadcn.js';

	type Item = {
		title: string;
		url: string;
		items: Item[];
	};

	const { children, data } = $props();

	const hash = $derived(page.url.hash);

	$inspect(hash);
</script>

<Sidebar.Provider>
	<MenuSidebar />
	<Sidebar.Inset class="contain-inline-size sticky top-0">
		<Header />
		<div class="p-8 relative">
			<div class="basis-4/5 grow min-w-0 lg:pr-72">
				{@render children()}
			</div>
			<div class="fixed z-20 lg:w-[16rem] right-8 top-20 hidden lg:block">
				<div class="font-semibold flex items-center gap-2">
					<List class="size-5" />
					On this page
				</div>
				<div class="text-sm mt-3 pl-1">
					{@render TocList(data.toc)}
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

{#snippet TocList(items: Item[])}
	{#if items.length > 0}
		<ul class="even:pl-5">
			{#each items as item}
				<li
					class={cn('py-2', {
						'text-primary font-semibold': hash === item.url
					})}
				>
					<a href={item.url}>{item.title}</a>
				</li>
				{@render TocList(item.items)}
			{/each}
		</ul>
	{/if}
{/snippet}
