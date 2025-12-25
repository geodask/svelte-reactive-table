---
layout: docPage
---

<script lang="ts">
	import Example from './example.svelte';
	import { ExampleViewer } from '$widgets/example-viewer';
	import { page } from '$app/state';
</script>

# Pagination Example

This example demonstrates how to implement pagination in your tables using svelte-reactive-table. Pagination allows you to divide large datasets into manageable pages for better user experience.

The pagination feature provides:

- Configurable page size options
- First/previous/next/last page navigation
- Current page indicator and total page count
- Row count indicators

<ExampleViewer source={page.data.doc?.examples?.[0]?.source ?? ''} title="Pagination">
	{#snippet preview()}
		<Example />
	{/snippet}
</ExampleViewer>
