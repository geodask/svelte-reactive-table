<script lang="ts" module>
	export { code, pre } from '../markdown';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	const tocSize = 128;
</script>

<div class="prose prose-base max-w-none relative dark:prose-invert">
	<div class="min-w-0 basis-4/5 grow lg:pr-60 xl:pr-64">
		{@render children()}
	</div>
	<div class="fixed z-20 lg:w-48 xl:w-56 right-8 top-24 hidden lg:block">
		<div class="font-semibold">On this page</div>
		<div class="text-sm mt-5">Coming soon...</div>
	</div>
</div>
