<script lang="ts" module>
	export { code, pre } from '../markdown';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="prose prose-base max-w-none dark:prose-invert">
	{@render children()}
</div>
