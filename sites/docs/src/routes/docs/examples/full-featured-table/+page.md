---
layout: docPage
breadcrumb: ['Examples', 'Full Featured Table']
prev: { title: 'Sorting Example', href: '/docs/examples/sorting' }
next: { title: 'reactiveTable API', href: '/docs/api/reactive-table' }
---

<script lang="ts">
	import Example from './example.svelte';
	import { ExampleViewer } from '$widgets/example-viewer';
	import { page } from '$app/state';
</script>

# Full Featured Table Example

This example demonstrates how to combine all the plugins of svelte-reactive-table into a comprehensive, full-featured table implementation.

The full-featured table includes:

- Column visibility toggles
- Name filtering with real-time search
- Pagination with configurable page sizes
- Multi-column sorting
- All plugins working together seamlessly

<ExampleViewer source={page.data.doc?.examples?.[0]?.source ?? ''} title="Full Featured Table">
{#snippet preview()}
<Example />
{/snippet}
</ExampleViewer>
