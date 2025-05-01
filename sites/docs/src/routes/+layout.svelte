<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { ScrollArea } from '$shared/ui/shadcn/scroll-area';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	let viewportRef: HTMLDivElement | null = $state(null);

	onNavigate(() => {
		viewportRef?.scrollTo({ top: 0, behavior: 'instant' });
	});

	const { children } = $props();
</script>

<ModeWatcher />

<ScrollArea bind:viewportRef type="always" class="h-screen">
	{@render children()}
</ScrollArea>
