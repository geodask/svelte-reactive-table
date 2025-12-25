---
layout: docPage
---

<script lang="ts">
	import Example from './example.svelte';
	import { ExampleViewer } from '$widgets/example-viewer';
	import { page } from '$app/state';
</script>

# Column Visibility Example

This example demonstrates how to implement column visibility control with svelte-reactive-table. Users can toggle the visibility of individual columns in the table.

The column visibility feature provides:

- Ability to show/hide specific columns
- Visual indicators of column state (visible/hidden)
- Automatic table adjustment when toggling columns

<ExampleViewer source={page.data.doc?.examples?.[0]?.source ?? ''} title="Column Visibility">
	{#snippet preview()}
		<Example />
	{/snippet}
</ExampleViewer>
