<script lang="ts">
	import { version } from '$shared/config/version';
	import Github from '$shared/ui/icons/github.svelte';
	import { Badge } from '$shared/ui/shadcn/badge';
	import { Button } from '$shared/ui/shadcn/button';
	import { Separator } from '$shared/ui/shadcn/separator';
	import { Grid2x2Check, Moon, Search, Sun } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';
	let isScrolled = $state(false);

	$effect(() => {
		const viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
		if (!viewport) return;

		const handleScroll = () => {
			isScrolled = viewport.scrollTop > 50;
		};

		viewport.addEventListener('scroll', handleScroll);
		return () => viewport.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="sticky top-0 z-20 w-full transition-all duration-200 {isScrolled
		? 'bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60 border-b border-border/40'
		: 'bg-transparent border-transparent'}"
>
	<div class="container flex h-14 items-center gap-2 justify-between mx-auto px-4 md:px-6 lg:px-8">
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

		<div class="flex items-center gap-2 ml-auto">
			<Button
				onclick={() => alert('Coming soon!')}
				class="hidden md:flex w-full md:w-64 justify-start px-2 h-9 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted font-normal md:mr-2"
				variant="ghost"
			>
				<Search class="mr-2 size-4 opacity-50" />
				Search...
				<kbd
					class="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
				>
					<span class="text-xs">⌘</span>K
				</kbd>
			</Button>

			<div class="px-2">
				<Badge variant="outline" class="font-normal font-mono text-xs bg-muted/50 border-border/50">
					v{version}
				</Badge>
			</div>

			<Separator orientation="vertical" class="h-6 mx-1 bg-border/40" />

			<div class="flex items-center gap-0.5">
				<Button
					size="icon"
					variant="ghost"
					target="_blank"
					href="https://github.com/geodask/svelte-reactive-table"
					class="size-8 text-muted-foreground hover:text-foreground"
				>
					<Github class="size-4" />
					<span class="sr-only">GitHub</span>
				</Button>

				<Button
					size="icon"
					variant="ghost"
					onclick={toggleMode}
					class="size-8 text-muted-foreground hover:text-foreground"
				>
					{#if mode.current === 'dark'}
						<Sun class="size-4" />
					{:else}
						<Moon class="size-4" />
					{/if}
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</div>
</header>
