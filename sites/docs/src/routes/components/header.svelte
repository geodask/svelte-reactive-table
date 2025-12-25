<script lang="ts">
	import { IsMobile } from '$shared/lib/is-mobile.svelte';
	import { cn } from '$shared/lib/shadcn';
	import Github from '$shared/ui/icons/github.svelte';
	import { Badge } from '$shared/ui/shadcn/badge';
	import { Button } from '$shared/ui/shadcn/button';
	import { Separator } from '$shared/ui/shadcn/separator';
	import { Grid2x2Check, Menu, Moon, Sun, X } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';

	let isMenuOpen = $state(false);
	let scrollY = $state(0);
	const isMobile = new IsMobile();

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<svelte:window bind:scrollY />

<header
	class={cn(
		'sticky top-0 z-50 w-full transition-all duration-300',
		scrollY > 20
			? 'bg-background/80 backdrop-blur-xl backdrop-saturate-150'
			: 'bg-transparent border-transparent'
	)}
>
	<div class="container mx-auto px-4 md:px-6 lg:px-8">
		<div class="flex h-14 items-center justify-between">
			<a href="/" class="flex items-center gap-2.5 group">
				<div
					class="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary/20"
				>
					<Grid2x2Check class="size-5" />
				</div>
				<span class="text-base md:text-lg font-semibold tracking-tight">Svelte Reactive Table</span>
				<Badge
					variant="outline"
					class="font-normal text-[10px] border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10 ml-2 h-5"
				>
					ALPHA
				</Badge>
			</a>

			{#if isMobile.current}
				<div class="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						target="_blank"
						href="https://github.com/geodask/svelte-reactive-table"
						class="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200"
					>
						<Github class="size-[18px]" />
						<span class="sr-only">GitHub</span>
					</Button>
					<Button
						size="icon"
						variant="ghost"
						onclick={toggleMode}
						class="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200"
					>
						{#if mode.current === 'dark'}
							<Sun class="size-[18px]" />
						{:else}
							<Moon class="size-[18px]" />
						{/if}
						<span class="sr-only">Toggle theme</span>
					</Button>
					<Button
						aria-label="Toggle menu"
						size="icon"
						variant="ghost"
						onclick={toggleMenu}
						class="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200"
					>
						{#if isMenuOpen}
							<X class="size-5" />
						{:else}
							<Menu class="size-5" />
						{/if}
					</Button>
				</div>
			{/if}

			<nav class="hidden md:flex items-center gap-1">
				<a
					href="/docs/introduction"
					class="px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent/60 transition-all duration-200"
				>
					Documentation
				</a>
				<a
					href="/docs/examples"
					class="px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent/60 transition-all duration-200"
				>
					Examples
				</a>

				<Separator orientation="vertical" class="mx-2 h-5 bg-border/60" />

				<div class="flex items-center gap-1">
					<Button
						variant="ghost"
						target="_blank"
						size="icon"
						href="https://github.com/geodask/svelte-reactive-table"
						class="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200"
					>
						<Github class="size-[18px]" />
						<span class="sr-only">GitHub</span>
					</Button>
					<Button
						size="icon"
						variant="ghost"
						onclick={toggleMode}
						class="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200"
					>
						{#if mode.current === 'dark'}
							<Sun class="size-[18px]" />
						{:else}
							<Moon class="size-[18px]" />
						{/if}
						<span class="sr-only">Toggle theme</span>
					</Button>
				</div>
			</nav>
		</div>

		{#if isMobile.current && isMenuOpen}
			<div
				class="md:hidden py-4 border-t border-border/40 animate-in slide-in-from-top-2 duration-200"
			>
				<nav class="flex flex-col gap-1">
					<a
						href="/docs/introduction"
						class="px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
					>
						Documentation
					</a>
					<a
						href="/docs/examples"
						class="px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
					>
						Examples
					</a>
					<a
						href="https://github.com/geodask/svelte-reactive-table/releases"
						target="_blank"
						class="px-3 py-2.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
					>
						Releases
					</a>
				</nav>
			</div>
		{/if}
	</div>
</header>
