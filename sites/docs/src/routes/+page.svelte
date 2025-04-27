<script lang="ts">
	import { Button } from '$lib/shared/ui/shadcn/button';
	import * as Card from '$lib/shared/ui/shadcn/card';
	import { cn } from '$shared/lib/shadcn';
	import {
		Activity,
		Check,
		CircleCheck,
		Clock,
		LayoutDashboard,
		Loader,
		PackageOpen,
		ShieldCheck,
		Sparkles,
		type Icon
	} from '@lucide/svelte';
	import Footer from './components/footer.svelte';
	import Header from './components/header.svelte';

	import { version } from '$lib/shared/config/version';
	import Github from '$shared/ui/icons/github.svelte';
	import { Badge } from '$shared/ui/shadcn/badge';
	import EarlyReleaseAlert from '$widgets/early-release-alert/ui/early-release-alert.svelte';
	import { fade, fly } from 'svelte/transition';

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
		'Column sorting (single and multi-column)'
	];

	const comingSoon = [
		'Filtering (global and column-based)',
		'Row selection (single, multi, range)',
		'Column resizing and reordering',
		'Custom cell and header rendering',
		'Computed and dynamic columns'
	];

	const installCommand = 'npm install svelte-reactive-table';

	let copied = $state(false);

	function copyInstallCommand() {
		navigator.clipboard.writeText(installCommand);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<!-- Header Component -->
<Header />

<main class="max-w-[1200px] mx-auto px-4 flex flex-col items-center min-h-[calc(100vh-13rem)]">
	<!-- Hero Section -->

	<section class="text-center py-16 px-4 max-w-4xl mx-auto">
		<div class="flex items-center justify-center mb-4" in:fade={{ delay: 200, duration: 400 }}>
			<Badge
				class="font-light font-mono flex gap-2 text-primary hover:bg-primary/20 bg-primary/10 border-primary/20 px-3 py-1 text-sm items-center rounded-full"
			>
				<Sparkles size={16} />
				<span>v{version}</span>
			</Badge>
		</div>

		<h1
			in:fly={{ y: 20, duration: 600, delay: 300 }}
			class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent leading-tight"
		>
			Svelte Reactive Table
		</h1>

		<p
			in:fly={{ y: 20, duration: 600, delay: 400 }}
			class="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto"
		>
			A headless, fully reactive table library for Svelte applications
		</p>

		<div in:fly={{ y: 20, duration: 600, delay: 450 }} class="mb-8 flex justify-center">
			<Button variant="ghost" class="group" onclick={copyInstallCommand}>
				<span class="select-none text-primary">$</span>
				<span class="pr-2">{installCommand}</span>
				<span class="text-xs transition-colors group-hover:text-primary ml-2">
					{copied ? '✓ Copied!' : 'Copy'}
				</span>
			</Button>
		</div>

		<div
			in:fly={{ y: 20, duration: 600, delay: 500 }}
			class="flex flex-wrap gap-4 justify-center mb-8"
		>
			<Button href="/docs/introduction" size="lg" class="text-base">Get Started</Button>

			<Button
				href="https://github.com/geodask/svelte-reactive-table"
				target="_blank"
				size="lg"
				variant="secondary"
				class="text-base"
			>
				<Github />
				Github
			</Button>
		</div>

		<div in:fade={{ delay: 700, duration: 400 }} class="justify-self-center">
			<EarlyReleaseAlert />
		</div>
	</section>

	<!-- Features Section -->
	<section class="w-full mb-16">
		<h2 class="text-3xl font-bold text-center mb-10">Why Choose Svelte Reactive Table?</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each features as feature}
				{@render FeatureCard(feature)}
			{/each}
		</div>
	</section>

	<!-- Features Roadmap - Enhanced -->
	<section class="w-full mb-16 max-w-4xl">
		<h2 class="text-3xl font-bold text-center mb-10">Feature Roadmap</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Implemented Features -->
			{@render RoadmapCard('Available', implemented, true)}

			<!-- Coming Soon Features -->
			{@render RoadmapCard('Coming Soon', comingSoon, false)}
		</div>
	</section>

	<!-- CTA Section -->
	<section class="w-full text-center mb-8 max-w-2xl">
		<Card.Root class="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
			<h2 class="text-2xl font-bold mb-4">Ready to build your perfect table?</h2>
			<p class="mb-6 text-muted-foreground">
				Get started with Svelte Reactive Table and take complete control of your data display.
			</p>
			<div class="flex flex-wrap gap-4 justify-center">
				<Button href="/docs/introduction" size="lg">Read the Docs</Button>
			</div>
		</Card.Root>
	</section>
</main>

<Footer />

{#snippet FeatureCard(feature: { title: string; description: string; icon: typeof Icon })}
	<Card.Root class="h-full transition-all hover:shadow-md">
		<Card.Header>
			<Card.Title class="text-xl font-semibold flex gap-2">
				{@const Icon = feature.icon}
				<Icon class="text-primary" />
				{feature.title}
			</Card.Title>
		</Card.Header>

		<Card.Content>
			<p class="text-muted-foreground">
				{feature.description}
			</p>
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet RoadmapCard(title: string, features: string[], ready: boolean)}
	<Card.Root
		class={cn('border-l-4 p-0', {
			'border-l-muted-foreground': !ready,
			'border-l-primary': ready
		})}
	>
		<Card.Header>
			<Card.Title class="text-xl font-semibold mb-4 gap-2 flex items-center">
				{#if ready}
					<CircleCheck class="size-6 text-primary" />
				{:else}
					<Clock class="size-6" />
				{/if}
				{title}
			</Card.Title>
		</Card.Header>
		<Card.Content class="pt-0">
			<ul class="space-y-3">
				{#each features as feature}
					<li class="flex gap-2 items-start p-2 rounded hover:bg-muted transition-colors">
						<div class="mt-1">
							{#if ready}
								<Check class="size-4 text-primary" />
							{:else}
								<Loader class="size-4" />
							{/if}
						</div>

						<span>{feature}</span>
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
{/snippet}
