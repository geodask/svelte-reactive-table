---
layout: docPage
---

<script lang="ts">
	import BasicSorting from './variants/basic.svelte';
	import MultiSorting from './variants/multi.svelte';
	import { ExampleViewer } from '$widgets/example-viewer';
	import { page } from '$app/state';

	// Get examples by name
	const examples = page.data.doc?.examples ?? [];
	const basicSource = examples.find(e => e.name === 'basic')?.source ?? '';
	const multiSource = examples.find(e => e.name === 'multi')?.source ?? '';
</script>

# Sorting Example

The sorting feature in Svelte Reactive Table provides powerful ways to organize your data. This page demonstrates both single-column and multi-column sorting options.

## Basic Sorting

This example shows basic sorting functionality with only one sortable column at a time:

- Click on column headers to sort in ascending/descending order
- Only one column can be active for sorting at a time
- Visual indicators show current sort direction
- Option to clear sorting and return to default order

<ExampleViewer source={basicSource} title="Basic Sorting">
	{#snippet preview()}
		<BasicSorting />
	{/snippet}
</ExampleViewer>

## Multi-Column Sorting

This example demonstrates how to enable multi-column sorting, allowing users to sort by multiple criteria simultaneously:

- Sort by multiple columns with priority given to columns in the order they were selected
- Hold Shift and click on column headers to add secondary/tertiary sort conditions
- Each column can be independently toggled between ascending and descending
- Visual indicators show current sort direction for each column
- Option to clear all sorting conditions at once

<ExampleViewer source={multiSource} title="Multi-Column Sorting">
	{#snippet preview()}
		<MultiSorting />
	{/snippet}
</ExampleViewer>
