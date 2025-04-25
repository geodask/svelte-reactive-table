<script lang="ts">
	import { ScrollArea } from '$shared/ui/shadcn/scroll-area';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	const { children } = $props();
</script>

<ModeWatcher />

<ScrollArea class="h-screen">
	{@render children()}
</ScrollArea>
