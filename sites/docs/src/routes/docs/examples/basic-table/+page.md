---
layout: docPage
breadcrumb: ["Examples", "Basic Table"]
---

<script lang="ts">
	import Example from './example.svelte';
	import { ExampleViewer } from '$widgets/example-viewer';
	import { page } from '$app/state';
</script>

# Basic Table Example

This example demonstrates creating a simple, functional table using Svelte Reactive Table. The basic implementation includes displaying data in rows and columns with the ability to add new rows dynamically.

The basic table provides core functionality including:

- Column headers automatically generated from your column definitions
- Rendering rows from your data source
- Dynamic updates when adding new rows
- Empty state handling

<ExampleViewer source={page.data.doc?.examples?.[0]?.source ?? ''} title="Basic Table">
	{#snippet preview()}
		<Example />
	{/snippet}
</ExampleViewer>
