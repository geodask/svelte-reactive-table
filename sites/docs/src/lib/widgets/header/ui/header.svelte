<script lang="ts">
	import Github from '$shared/ui/icons/github.svelte';
	import { Button } from '$shared/ui/shadcn/button';
	import { Separator } from '$shared/ui/shadcn/separator';
	import * as Sidebar from '$shared/ui/shadcn/sidebar';
	import { Moon, Search, Sun } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<header class="flex sticky border-b bg-background z-20 top-0 h-14 shrink-0 items-center gap-2 px-4">
	<Sidebar.Trigger class=" size-9" />
	<Separator orientation="vertical" class="min-h-0 h-6" />

	<!-- <Button class="w-64 ml-auto justify-start px-2" variant="outline">
		<Search size={16} />
		Search Docs...
	</Button> -->

	<Button
		size="icon"
		class="ml-auto"
		variant="ghost"
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
</header>
