---
layout: docPage
---

<script lang="ts">
	import Sorting from './sorting.svelte';
	import MultiSorting from './multi-sorting.svelte';
	import Tabs from '$shared/ui/tabs.svelte'
	import TabItem from '$shared/ui/tab-item.svelte'
	import Pre from '$shared/ui/markdown/pre.svelte';

	const items = ['Code', 'Preview'];
</script>

# Sorting Example

The sorting feature in Svelte Reactive Table provides powerful ways to organize your data. This page demonstrates both single-column and multi-column sorting options.

## Basic Sorting

This example shows basic sorting functionality with only one sortable column at a time:

- Click on column headers to sort in ascending/descending order
- Only one column can be active for sorting at a time
- Visual indicators show current sort direction
- Option to clear sorting and return to default order

<Tabs value="Preview" {items}>

<TabItem value="Code">

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { ArrowDown, ArrowUp, ArrowUpDown, RotateCcw } from '@lucide/svelte';
	import { reactiveSorting, reactiveTable, type ColumnSorting } from 'svelte-reactive-table';
	import { initialData } from '../data';

	// Sorting example with multiSort disabled
	const singleSortTable = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	]).use(
		reactiveSorting({
			// Optional: Set initial sorting
			columnSortings: [{ key: 'age', direction: 'desc' }],
			// Disable multi-column sorting
			multiSort: false
		})
	);

	const { sorting } = singleSortTable.plugins;

	function clearSingleSorting() {
		sorting.clearSort();
	}

	// Helper function to determine the current sort direction for a column
	function getSortDirection(accessor: string) {
		const columnSorting = sorting.columnSortings.find((s: ColumnSorting) => s.key === accessor);
		return columnSorting ? columnSorting.direction : 'none';
	}
</script>

<div class="not-prose">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
		<p class="text-sm text-muted-foreground">
			Click on column headers to sort. Only one column can be sorted at a time.
		</p>
		<Button variant="outline" size="sm" onclick={clearSingleSorting} class="shadow-sm">
			<RotateCcw class="mr-2 h-4 w-4" />
			Clear Sorting
		</Button>
	</div>

	<div class="rounded-md border shadow-sm overflow-hidden">
		<Table.Root>
			<Table.Header class="bg-muted/50 ">
				<Table.Row>
					{#each singleSortTable.allColumns as column}
						<Table.Head class="p-2">
							<Button
								onclick={() => {
									const { sorting } = singleSortTable.plugins;
									sorting.toggleSort(column.accessor);
								}}
								size="sm"
								variant="ghost"
							>
								<span class="font-medium">{column.header}</span>
								<span class="text-muted-foreground/70">
									{#if getSortDirection(column.accessor) === 'asc'}
										<ArrowUp class="h-4 text-primary" />
									{:else if getSortDirection(column.accessor) === 'desc'}
										<ArrowDown class="h-4 text-primary" />
									{:else}
										<ArrowUpDown class="h-4 w-4" />
									{/if}
								</span>
							</Button>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each singleSortTable.rows as row}
					<Table.Row class="hover:bg-muted/20 transition-colors">
						{#each row.cells as cell}
							<Table.Cell class="p-4">{cell.value}</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
				{#if singleSortTable.rows.length === 0}
					<Table.Row>
						<Table.Cell class="h-24 text-center p-4" colspan={singleSortTable.headers.length}>
							<div class="flex flex-col items-center justify-center text-muted-foreground">
								<span>No data available</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
```

</TabItem>

<TabItem value="Preview">
	<Sorting />
</TabItem>

</Tabs>

## Multi-Column Sorting

This example demonstrates how to enable multi-column sorting, allowing users to sort by multiple criteria simultaneously:

- Sort by multiple columns with priority given to columns in the order they were selected
- Hold Shift and click on column headers to add secondary/tertiary sort conditions
- Each column can be independently toggled between ascending and descending
- Visual indicators show current sort direction for each column
- Option to clear all sorting conditions at once

<Tabs value="Code" {items}>

<TabItem value="Code">

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { ArrowDown, ArrowUp, ArrowUpDown, RotateCcw } from '@lucide/svelte';
	import { reactiveSorting, reactiveTable, type ColumnSorting } from 'svelte-reactive-table';
	import { initialData } from '../data';

	// Sorting example with multiSort enabled
	const multiSortTable = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	]).use(
		reactiveSorting({
			// Optional: Set initial sorting
			columnSortings: [{ key: 'name', direction: 'asc' }],
			// Enable multi-column sorting
			multiSort: true
		})
	);

	const { sorting } = multiSortTable.plugins;

	function clearMultiSorting() {
		sorting.clearSort();
	}
	// Helper function to determine the current sort direction for a column
	function getSortDirection(accessor: string) {
		const columnSorting = sorting.columnSortings.find((s: ColumnSorting) => s.key === accessor);
		return columnSorting ? columnSorting.direction : 'none';
	}
</script>

<div class="not-prose">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
		<p class="text-sm text-muted-foreground">
			Click on column headers to sort. Multiple columns can be sorted simultaneously.
		</p>
		<Button variant="outline" size="sm" onclick={clearMultiSorting} class="shadow-sm">
			<RotateCcw class="mr-2 h-4 w-4" />
			Clear All Sorting
		</Button>
	</div>

	<div class="rounded-md border shadow-sm overflow-hidden">
		<Table.Root>
			<Table.Header class="bg-muted/50">
				<Table.Row>
					{#each multiSortTable.allColumns as column}
						<Table.Head class="py-2">
							<Button
								onclick={() => {
									const { sorting } = multiSortTable.plugins;
									sorting.toggleSort(column.accessor);
								}}
								size="sm"
								variant="ghost"
							>
								<span class="font-medium">{column.header}</span>
								<span class="text-muted-foreground/70">
									{#if getSortDirection(column.accessor) === 'asc'}
										<ArrowUp class="h-4 text-primary" />
									{:else if getSortDirection(column.accessor) === 'desc'}
										<ArrowDown class="h-4 text-primary" />
									{:else}
										<ArrowUpDown class="h-4 w-4" />
									{/if}
								</span>
							</Button>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each multiSortTable.rows as row}
					<Table.Row class="hover:bg-muted/20 transition-colors">
						{#each row.cells as cell}
							<Table.Cell class="p-4">{cell.value}</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
				{#if multiSortTable.rows.length === 0}
					<Table.Row>
						<Table.Cell class="h-24 text-center p-4" colspan={multiSortTable.headers.length}>
							<div class="flex flex-col items-center justify-center text-muted-foreground">
								<span>No data available</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
```

</TabItem>

<TabItem value="Preview">
	<MultiSorting />
</TabItem>

</Tabs>
