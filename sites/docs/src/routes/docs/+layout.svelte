<script lang="ts">
	import { page } from '$app/state';
	import { setupReactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte';
	import { reactiveToc } from '$shared/lib/toc/toc.svelte';
	import * as Sidebar from '$shared/ui/shadcn/sidebar';
	import { Header } from '$widgets/header';
	import { MenuSidebar } from '$widgets/menu-sidebar';
	import { TableOfContents } from '$widgets/table-of-contents';
	import Footer from '../components/footer.svelte';

	const { children, data } = $props();

	// State management
	let content: HTMLDivElement | null = $state(null);
	let root: HTMLDivElement | null = $state(null);

	console.log(data.toc);

	// Initialize TOC state when content is available
	const tocState = reactiveToc(
		() => data.toc,
		() => content,
		{
			idAttribute: 'data-section-id',
			rootMargin: '-60px 0px 0px 0px'
		}
	);

	setupReactiveBreadcrumb();

	// Enhanced TOC items ready for rendering
	const enhancedTocItems = $derived(tocState?.items ?? []);
</script>

<Sidebar.Provider>
	<MenuSidebar />
	<Sidebar.Inset class="contain-inline-size sticky top-0">
		<Header />
		<div bind:this={root} class="p-8 relative">
			{#key page.route.id}
				<div bind:this={content} class="basis-4/5 grow min-w-0 lg:pr-72">
					{@render children()}
				</div>
			{/key}
			<TableOfContents items={enhancedTocItems} />
		</div>
		<Footer />
	</Sidebar.Inset>
</Sidebar.Provider>
