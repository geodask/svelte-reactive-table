<script lang="ts">
	import { Button } from '$shared/ui/button';
	import Github from '$shared/ui/github.svelte';
	import * as Sidebar from '$shared/ui/sidebar';
	import { Moon, Search, Sun } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<header class="flex h-16 shrink-0 items-center gap-2 px-4">
	<Sidebar.Trigger class="-ml-1" />

	<Button class="w-64 ml-auto justify-start px-2" variant="outline">
		<Search size={16} />
		Search Docs...
	</Button>

	<Button
		size="icon"
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
