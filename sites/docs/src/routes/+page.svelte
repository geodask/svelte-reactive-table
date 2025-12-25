<script lang="ts">
	import { Button } from '$lib/shared/ui/shadcn/button';
	import * as Card from '$lib/shared/ui/shadcn/card';
	import { cn } from '$shared/lib/shadcn';
	import {
		Activity,
		ArrowRight,
		Check,
		CircleCheck,
		Clock,
		Copy,
		LayoutDashboard,
		Loader,
		PackageOpen,
		ShieldCheck,
		Sparkles,
		type Icon
	} from '@lucide/svelte';
	import { Footer } from '$widgets/footer';
	import Header from './components/header.svelte';

	import { version } from '$lib/shared/config/version';
	import BackgroundPattern from '$shared/ui/layouts/background-pattern.svelte';
	import Github from '$shared/ui/icons/github.svelte';
	import { Badge } from '$shared/ui/shadcn/badge';
	import { fade, fly } from 'svelte/transition';
	import { useClipboard } from '$shared/lib/clipboard.svelte';

	const features = [
		{
			title: 'Headless by Design',
			description:
				'Zero styling, full control. Bring your own markup and styles for total UI flexibility.',
			icon: LayoutDashboard
		},
		{
			title: 'Fully Reactive',
			description: 'Powered by Svelte 5 runes. Table state updates automatically with your data.',
			icon: Activity
		},
		{
			title: 'Composable Features',
			description:
				'Add pagination, filtering, or sorting only when you need them. Keep your table lean.',
			icon: PackageOpen
		},
		{
			title: 'Type-Safe API',
			description:
				"Built with TypeScript for reliable autocompletion, strict typing, and DX you'll love.",
			icon: ShieldCheck
		}
	];

	const implemented = [
		'Reactive core with Svelte 5 runes',
		'Column definitions and header rendering',
		'Row and cell generation',
		'Column visibility toggling',
		'Pagination (page size, navigation, reactive state)',
		'Column sorting (single and multi-column)',
		'Filtering (global and column-based)'
	];

	const comingSoon = [
		'Row selection (single, multi, range)',
		'Column resizing and reordering',
		'Custom cell and header rendering',
		'Computed and dynamic columns'
	];

	const installCommand = 'npm install svelte-reactive-table';

	const clipboard = useClipboard();
</script>

<Header />

<BackgroundPattern />

<main
	class="relative container mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center min-h-[calc(100vh-13rem)]"
>
	<!-- Hero Section -->
	<section class="text-center py-20 md:py-28 px-4 max-w-4xl mx-auto">
		<div class="flex items-center justify-center mb-6" in:fade={{ delay: 200, duration: 400 }}>
			<!-- <Badge
				class="font-mono flex gap-2 text-primary hover:bg-primary/20 bg-primary/10 border-primary/30 px-3 py-1.5 text-sm items-center rounded-full transition-colors duration-200"
			>
				<Sparkles class="size-4" />
				<span class="font-medium">v{version}</span>
			</Badge> -->
		</div>

		<h1
			in:fly={{ y: 20, duration: 600, delay: 300 }}
			class="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-foreground to-foreground/70 pb-2 relative mx-auto"
		>
			Svelte Reactive
			<span class="text-primary block sm:inline">Table</span>
			<Badge
				variant="outline"
				class="absolute top-0 left-full ml-0.5 sm:top-2 sm:ml-2 font-normal text-sm md:text-base border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10 h-5 sm:h-7 px-1.5 sm:px-2.5"
			>
				ALPHA
			</Badge>
		</h1>

		<p
			in:fly={{ y: 20, duration: 600, delay: 400 }}
			class="text-lg md:text-xl lg:text-2xl mb-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed"
		>
			A <span class="text-foreground font-medium">headless</span>, fully reactive table library
			built for modern Svelte applications
		</p>

		<!-- Install command -->
		<div in:fly={{ y: 20, duration: 600, delay: 450 }} class="mb-10 flex justify-center">
			<button
				onclick={() => clipboard.copy()}
				class="group flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/50 border border-border/60 hover:border-border hover:bg-muted/80 transition-all duration-200"
			>
				<span class="text-primary font-mono">$</span>
				<code use:clipboard.readText class="font-mono text-sm text-foreground"
					>{installCommand}</code
				>
				<span
					class="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors"
				>
					{#if clipboard.copied}
						<Check class="size-3.5" />
						Copied!
					{:else}
						<Copy class="size-3.5" />
						Copy
					{/if}
				</span>
			</button>
		</div>

		<!-- CTA buttons -->
		<div
			in:fly={{ y: 20, duration: 600, delay: 500 }}
			class="flex flex-col sm:flex-row gap-4 justify-center mb-10"
		>
			<Button href="/docs/introduction" size="lg" class="text-base gap-2 group">
				Get Started
				<ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
			</Button>

			<Button
				href="https://github.com/geodask/svelte-reactive-table"
				target="_blank"
				size="lg"
				variant="outline"
				class="text-base gap-2"
			>
				<Github class="size-[18px]" />
				View on GitHub
			</Button>
		</div>

		<div class="mt-8"></div>
	</section>

	<!-- Features Section -->
	<section class="w-full mb-20">
		<div class="text-center mb-12">
			<h2 class="text-2xl sm:text-3xl font-bold mb-3">Why Choose Svelte Reactive Table?</h2>
			<p class="text-muted-foreground max-w-xl mx-auto">
				Built from the ground up with Svelte 5, offering a modern and developer-friendly experience.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
			{#each features as feature}
				{@render FeatureCard(feature)}
			{/each}
		</div>
	</section>

	<!-- Features Roadmap -->
	<section class="w-full mb-20 max-w-4xl">
		<div class="text-center mb-12">
			<h2 class="text-2xl sm:text-3xl font-bold mb-3">Feature Roadmap</h2>
			<p class="text-muted-foreground">Track our progress and see what's coming next.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{@render RoadmapCard('Available Now', implemented, true)}
			{@render RoadmapCard('Coming Soon', comingSoon, false)}
		</div>
	</section>

	<!-- CTA Section -->
	<section class="w-full text-center mb-16 max-w-2xl">
		<div
			class="relative p-8 sm:p-10 rounded-2xl bg-linear-to-br from-primary/5 via-accent/5 to-primary/10 border border-primary/20 overflow-hidden"
		>
			<!-- Decorative gradient -->
			<div
				class="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-50"
				aria-hidden="true"
			></div>

			<div class="relative">
				<h2 class="text-2xl sm:text-3xl font-bold mb-4">Ready to build your perfect table?</h2>
				<p class="mb-8 text-muted-foreground max-w-md mx-auto">
					Get started with Svelte Reactive Table and take complete control of your data display.
				</p>
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<Button href="/docs/introduction" size="lg" class="gap-2 group">
						Read the Docs
						<ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
					</Button>
					<Button href="/docs/examples" size="lg" variant="outline">View Examples</Button>
				</div>
			</div>
		</div>
	</section>
</main>

<Footer />

{#snippet FeatureCard(feature: { title: string; description: string; icon: typeof Icon })}
	<Card.Root
		class="group h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-border/80 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
	>
		<Card.Header class="pb-3">
			<Card.Title class="text-lg font-semibold flex items-center gap-3">
				{@const Icon = feature.icon}
				<div
					class="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20"
				>
					<Icon class="size-5" />
				</div>
				{feature.title}
			</Card.Title>
		</Card.Header>

		<Card.Content>
			<p class="text-muted-foreground text-sm leading-relaxed">
				{feature.description}
			</p>
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet RoadmapCard(title: string, features: string[], ready: boolean)}
	<Card.Root
		class={cn('border-l-4 bg-card/50 backdrop-blur-sm', {
			'border-l-muted-foreground/50': !ready,
			'border-l-primary': ready
		})}
	>
		<Card.Header class="pb-2">
			<Card.Title class="text-lg font-semibold gap-2.5 flex items-center">
				{#if ready}
					<div class="flex items-center justify-center size-7 rounded-full bg-primary/10">
						<CircleCheck class="size-4 text-primary" />
					</div>
				{:else}
					<div class="flex items-center justify-center size-7 rounded-full bg-muted">
						<Clock class="size-4 text-muted-foreground" />
					</div>
				{/if}
				{title}
			</Card.Title>
		</Card.Header>
		<Card.Content class="pt-0">
			<ul class="space-y-2">
				{#each features as feature}
					<li
						class="flex gap-2.5 items-start px-2.5 py-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
					>
						<div class="mt-0.5">
							{#if ready}
								<Check class="size-4 text-primary" />
							{:else}
								<Loader class="size-4 text-muted-foreground" />
							{/if}
						</div>
						<span class="text-sm">{feature}</span>
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
{/snippet}
