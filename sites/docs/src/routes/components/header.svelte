<script lang="ts">
	import { IsMobile } from '$shared/lib/is-mobile.svelte';
	import { Button } from '$shared/ui/shadcn/button';
	import Github from '$shared/ui/icons/github.svelte';
	import { Grid2x2Check, Menu, Moon, Sun, X } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';

	// Mobile menu state
	let isMenuOpen = false;
	const isMobile = new IsMobile();
	// Toggle mobile menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="w-full bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo and Project Name -->
			<div class="flex items-center gap-2">
				<Grid2x2Check class="text-primary" />
				<a href="/" class="text-xl font-bold">Svelte Reactive Table</a>
			</div>

			<!-- Mobile Menu Button -->

			{#if isMobile.current}
				<div>
					<Button
						variant="ghost"
						size="icon"
						target="_blank"
						href="https://github.com/geodask/svelte-reactive-table"
					>
						<Github />
					</Button>
					<Button size="icon" variant="ghost" onclick={toggleMode}>
						{#if mode.current === 'dark'}
							<Sun />
						{:else}
							<Moon />
						{/if}
					</Button>
					<Button aria-label="Toggle menu" size="icon" variant="ghost" onclick={toggleMenu}>
						{#if isMenuOpen}
							<X />
						{:else}
							<Menu />
						{/if}
					</Button>
				</div>
			{/if}

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex items-center gap-4">
				<a
					href="/docs/introduction"
					class="text-sm font-medium hover:text-primary transition-colors"
				>
					Documentation
				</a>
				<a href="/docs/examples" class="text-sm font-medium hover:text-primary transition-colors">
					Examples
				</a>
				<Button
					variant="ghost"
					target="_blank"
					size="icon"
					href="https://github.com/geodask/svelte-reactive-table"
				>
					<Github />
				</Button>
				<Button size="icon" variant="ghost" onclick={toggleMode}>
					{#if mode.current === 'dark'}
						<Sun />
					{:else}
						<Moon />
					{/if}
				</Button>
			</nav>
		</div>

		<!-- Mobile Navigation Menu -->
		{#if isMobile && isMenuOpen}
			<div class="md:hidden py-4 border-t">
				<nav class="flex flex-col space-y-4">
					<a href="/docs" class="px-2 py-1 text-sm font-medium hover:text-primary transition-colors"
						>Documentation</a
					>
					<a
						href="/examples"
						class="px-2 py-1 text-sm font-medium hover:text-primary transition-colors">Examples</a
					>
					<a
						href="https://github.com/geodask/svelte-reactive-table/releases"
						class="px-2 py-1 text-sm font-medium hover:text-primary transition-colors">Releases</a
					>
				</nav>
			</div>
		{/if}
	</div>
</header>
