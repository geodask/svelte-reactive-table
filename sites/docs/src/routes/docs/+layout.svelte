<script lang="ts">
	import { page } from '$app/state';
	import { setupReactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte';
	import { reactiveToc } from '$shared/lib/toc/toc.svelte';
	import BackgroundPattern from '$shared/ui/layouts/background-pattern.svelte';
	import { Footer } from '$widgets/footer';
	import { Header } from '$widgets/header';
	import { MenuSidebar } from '$widgets/menu-sidebar';
	import { MobileToc, TableOfContents } from '$widgets/table-of-contents';

	const { children, data } = $props();

	let content: HTMLElement | null = $state(null);

	const tocState = reactiveToc(
		() => data.toc,
		() => content,
		{
			idAttribute: 'data-section-id',
			rootMargin: '-60px 0px 0px 0px'
		}
	);

	setupReactiveBreadcrumb();

	const enhancedTocItems = $derived(tocState?.items ?? []);
</script>

<div class="flex min-h-screen bg-background relative isolate">
	<BackgroundPattern />
	<div class="flex-1 flex flex-col min-w-0">
		<Header />

		<div class="flex flex-1 gap-12 pt-6 lg:pt-10 mx-auto container px-4 md:px-6 lg:px-8">
			<MenuSidebar />

			{#key page.route.id}
				<main bind:this={content} class="flex-1 min-w-0">
					<MobileToc items={enhancedTocItems} />
					{@render children()}
					<Footer />
				</main>
			{/key}
			<TableOfContents items={enhancedTocItems} />
		</div>
	</div>
</div>
