<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$shared/lib/shadcn.js';
	import * as Sidebar from '$shared/ui/shadcn/sidebar';
	import { Header } from '$widgets/header';
	import { MenuSidebar } from '$widgets/menu-sidebar';
	import { List } from '@lucide/svelte';

	type Item = {
		title: string;
		url: string;
		items: Item[];
	};

	// Add type definition for active sections with weights
	type ActiveSection = {
		id: string;
		weight: number;
	};

	const { children, data } = $props();

	let activeSections: ActiveSection[] = $state([]);
	let content: HTMLDivElement | null = $state(null);
	let root: HTMLDivElement | null = $state(null);
	let showDebugOverlay = $state(true); // Add debug state

	$effect(() => {
		let observer: IntersectionObserver | null = null;
		// Keep track of all section visibility states
		const sectionStates = new Map<string, number>();

		observer = new IntersectionObserver(
			(entries) => {
				// Update visibility states for sections that triggered the callback
				entries.forEach((entry) => {
					const sectionId = entry.target.getAttribute('data-section-id');
					if (sectionId) {
						// Only remove from sectionStates if the section is completely out of view
						if (entry.intersectionRatio === 0) {
							sectionStates.delete(sectionId);
						} else {
							// Store the raw intersection ratio for now
							sectionStates.set(sectionId, entry.intersectionRatio);
						}
					}
				});

				// Calculate the total visible area (sum of all intersection ratios)
				const totalVisibleArea = Array.from(sectionStates.values()).reduce(
					(sum, ratio) => sum + ratio,
					0
				);

				// Convert to percentage weights based on proportion of total visible area
				const visibleSections = Array.from(sectionStates.entries())
					.map(([id, ratio]) => ({
						id,
						// Each section's weight is its percentage of the total visible area
						weight: totalVisibleArea > 0 ? ratio / totalVisibleArea : 0
					}))
					.sort((a, b) => b.weight - a.weight);

				activeSections = visibleSections;
			},
			{
				threshold: [0, 0.25, 0.5, 0.75, 1.0],
				rootMargin: '-56px 0px 0px 0px'
			}
		);

		if (content && page.route.id) {
			const sectionsNodeList = content
				.querySelectorAll('[data-section-id]')
				.values()
				.filter((value) => {
					const rank = value.getAttribute('data-heading-rank');
					return rank !== '1';
				});
			const sections = Array.from(sectionsNodeList) as HTMLElement[];
			sections.forEach((section) => {
				observer?.observe(section);
			});
		}

		return () => {
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		};
	});

	// Calculate the viewport height minus the rootMargin
	$effect(() => {
		if (showDebugOverlay) {
			// Add debug styles to the document
			const styleId = 'intersection-debug-styles';
			let style = document.getElementById(styleId) as HTMLStyleElement;
			if (!style) {
				style = document.createElement('style');
				style.id = styleId;
				document.head.appendChild(style);
			}

			style.textContent = `
				.intersection-debug-overlay {
					position: fixed;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					pointer-events: none;
					z-index: 9999;
				}
				.intersection-debug-overlay::before {
					content: '';
					position: absolute;
					left: 0;
					right: 0;
					top: 56px;
					height: calc(100% - 56px);
					background: rgba(0, 255, 0, 0.1);
					border-top: 2px dashed rgba(0, 255, 0, 0.5);
				}
				.intersection-debug-overlay .margin-area {
					position: absolute;
					left: 0;
					right: 0;
					background: rgba(255, 0, 0, 0.1);
				}
				.intersection-debug-overlay .margin-area.top {
					top: 0;
					height: 56px;
				}
				.intersection-debug-overlay .margin-area.bottom {
					display: none;
				}
			`;
		} else {
			// Remove debug styles when disabled
			const style = document.getElementById('intersection-debug-styles');
			if (style) {
				style.remove();
			}
		}
	});

	$inspect(activeSections);
</script>

<Sidebar.Provider>
	<MenuSidebar />
	<Sidebar.Inset class="contain-inline-size sticky top-0">
		<Header />
		{#if showDebugOverlay}
			<div class="intersection-debug-overlay">
				<div class="margin-area top"></div>
				<div class="margin-area bottom"></div>
			</div>
		{/if}
		<div bind:this={root} class="p-8 relative">
			<div bind:this={content} class="basis-4/5 grow min-w-0 lg:pr-72">
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

{#snippet TocList(
	items: Item[],
	className: string = '',
	parentWeights: { item: Item; effectiveWeight: number; isActive: boolean }[] = []
)}
	{#if items.length > 0}
		{@const levelItemWeights = items.map((item) => {
			const directActiveSection = activeSections.find((section) => '#' + section.id === item.url);

			// Get maximum child weight
			const getMaxChildWeight = (items: Item[]): number => {
				let maxWeight = 0;
				for (const childItem of items) {
					const childActiveSection = activeSections.find(
						(section) => '#' + section.id === childItem.url
					);
					const childWeight = childActiveSection ? childActiveSection.weight : 0;
					const descendantWeight =
						childItem.items.length > 0 ? getMaxChildWeight(childItem.items) : 0;
					maxWeight = Math.max(maxWeight, childWeight, descendantWeight);
				}
				return maxWeight;
			};

			const childrenMaxWeight = item.items.length > 0 ? getMaxChildWeight(item.items) : 0;
			const effectiveWeight = Math.max(directActiveSection?.weight || 0, childrenMaxWeight * 0.9);

			return {
				item,
				effectiveWeight,
				isActive: effectiveWeight > 0
			};
		})}

		{@const allWeights = [...parentWeights, ...levelItemWeights]}

		{@const maxWeight = allWeights.reduce(
			(max, current) => (current.effectiveWeight > max ? current.effectiveWeight : max),
			0
		)}

		<ul class={className}>
			{#each levelItemWeights as { item, effectiveWeight, isActive }}
				{@const isHighestVisibility = maxWeight > 0 && effectiveWeight === maxWeight}
				{@const opacity = isActive ? (isHighestVisibility ? 1.0 : 0.8) : 0.4}

				<li
					class={cn('py-2 transition-all duration-200', {
						'text-primary font-bold': isActive && isHighestVisibility,
						'text-primary/80 brightness-70': isActive && !isHighestVisibility,
						'text-muted-foreground': !isActive
					})}
				>
					<a href={item.url} class="block">{item.title}</a>
				</li>

				{#if item.items.length > 0}
					{@render TocList(item.items, 'pl-5', allWeights)}
				{/if}
			{/each}
		</ul>
	{/if}
{/snippet}
