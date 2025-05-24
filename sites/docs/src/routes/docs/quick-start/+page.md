---
layout: docPage
---

<script lang="ts">
	import { reactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte'
	import { BookOpen } from '@lucide/svelte';

	const breadcrumb = reactiveBreadcrumb();
	breadcrumb.setItems([
		{
			icon: BookOpen, 
			href: '/docs/introduction'
		},
		{
			title: 'Getting Started',
		},
		{
			title: 'Quick Start'
		}
	])
</script>

# Quick Start

Welcome! This guide shows you how to add powerful features to your Svelte Reactive Table. We'll start with a basic table and progressively add pagination, column visibility, sorting, and more.

> New to Svelte Reactive Table? Start with [Basic Usage](/docs/basic-usage) to learn how to create your first table, then come back here to add features.

## Creating a Basic Table

Let's assume you already have a working table like this:

```svelte
<script lang="ts">
	import { reactiveTable } from 'svelte-reactive-table';

	// Define your data
	const data = [
		{ id: 1, name: 'John Doe', age: 30, city: 'New York' },
		{ id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' }
	];

	// Define your columns
	const columns = [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	];

	// Create a reactive table instance
	const table = reactiveTable(data, columns);
</script>

<!-- Render your table with complete styling freedom -->
<table>
	<thead>
		<tr>
			{#each table.headers as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each table.allRows as row}
			<tr>
				{#each row.cells as cell}
					<td>{cell.value}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
```

Perfect! Now let's enhance this table with some powerful features.

## Controlling Column Visibility

Let users show and hide columns with the `reactiveColumnVisibility` plugin:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveColumnVisibility } from 'svelte-reactive-table';

	// Same data and columns as above

	// Create a table with column visibility plugin
	const table = reactiveTable(data, columns).use(
		reactiveColumnVisibility({
			hiddenColumns: ['age'] // Initially hide the age column
		})
	);

	// Access the column visibility API through table.plugins
	const { columnVisibility } = table.plugins;
</script>

<div>
	<button click={() => columnVisibility.toggleVisibility('age')}>
		{columnVisibility.isVisible('age') ? 'Hide' : 'Show'} Age Column
	</button>
	<button click={() => columnVisibility.hideColumn('city')}> Hide City Column </button>
	<button click={() => columnVisibility.showColumn('city')}> Show City Column </button>
</div>

<!-- Table as above -->
```

The plugin automatically handles the visibility state, and your table updates instantly when columns are toggled.

## Implementing Pagination

For large datasets, pagination is essential. Here's how to add it:

```svelte
<script lang="ts">
	import { reactiveTable, reactivePagination } from 'svelte-reactive-table';

	// Same data and columns as above

	// Create a table with pagination plugin
	const table = reactiveTable(data, columns).use(
		reactivePagination({
			pageSize: 10,
			page: 0 // Start at the first page (0-based)
		})
	);

	// Access the pagination API through table.plugins
	const { pagination } = table.plugins;
</script>

<!-- Table with paginated rows -->
<table>
	<thead>
		<!-- headers as before -->
	</thead>
	<tbody>
		{#each table.rows as row}
			<tr>
				{#each row.cells as cell}
					<td>{cell.value}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<!-- Pagination controls -->
<div class="pagination-controls">
	<button click={() => pagination.goToFirstPage()} disabled={pagination.isFirstPage}>
		First
	</button>

	<button click={() => pagination.goToPreviousPage()} disabled={!pagination.hasPreviousPage}>
		Previous
	</button>

	<span>
		Page {pagination.page + 1} of {pagination.pageCount}
	</span>

	<button click={() => pagination.goToNextPage()} disabled={!pagination.hasNextPage}> Next </button>

	<button click={() => pagination.goToLastPage()} disabled={pagination.isLastPage}> Last </button>

	<!-- Page size selector -->
	<div>
		<span>Rows per page:</span>
		<select bind:value={pagination.pageSize}>
			{#each [5, 10, 25, 50] as size}
				<option value={size}>{size}</option>
			{/each}
		</select>
	</div>
</div>
```

Notice how `table.rows` automatically contains only the current page's data. The table handles all the pagination logic for you!

## Leveraging Reactivity for Data Updates

One of the most powerful features is automatic reactivity. Your table updates instantly when data changes:

```svelte
<script lang="ts">
	// Same table setup as before

	function addNewRow() {
		// Simply update the data, and the table will automatically reflect the change
		table.data.push({
			id: table.data.length + 1,
			name: 'New Person',
			age: 27,
			city: 'Chicago'
		});
	}

	function removeRow(id) {
		// Remove a row by ID
		table.data = table.data.filter((item) => item.id !== id);
	}
</script>

<button click={addNewRow}>Add New Row</button>

<!-- Table as before, but with delete buttons -->
<table>
	<!-- thead as before -->
	<tbody>
		{#each table.rows as row}
			<tr>
				{#each row.cells as cell}
					<td>{cell.value}</td>
				{/each}
				<td>
					<button click={() => removeRow(row.id)}>Remove</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
```

No manual updates needed - the table automatically reflects your data changes. This works with pagination, sorting, and all other features too!

## Adding Sorting Capabilities

Let users organize data by adding sorting capabilities:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveSorting } from 'svelte-reactive-table';

	// Same data and columns as above

	// Create a table with sorting plugin
	const table = reactiveTable(data, columns).use(
		reactiveSorting({
			columnSortings: [{ key: 'name', direction: 'asc' }], // Initial sort
			multiSort: true // Allow sorting by multiple columns simultaneously
		})
	);

	// Access the sorting API through table.plugins
	const { sorting } = table.plugins;
</script>

<table>
	<thead>
		<tr>
			{#each table.columns as column}
				<th click={() => sorting.toggleSort(column.accessor)}>
					{column.header}
					{#if sorting.getSortDirection(column.accessor) !== 'none'}
						{sorting.getSortDirection(column.accessor) === 'asc' ? '↑' : '↓'}
					{/if}
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		<!-- Table body -->
	</tbody>
</table>
```

Click any column header to sort, click again to reverse the order, and once more to remove sorting.

## Combining Multiple Features

The real power comes from combining multiple features. Here's a fully-featured table:

```svelte
<script lang="ts">
	import {
		reactiveTable,
		reactiveColumnVisibility,
		reactivePagination,
		reactiveSorting
	} from 'svelte-reactive-table';

	// Same data and columns as above

	// Create a table with multiple plugins
	const table = reactiveTable(data, columns)
		.use(reactiveColumnVisibility())
		.use(
			reactiveSorting({
				multiSort: true
			})
		)
		.use(
			reactivePagination({
				pageSize: 5
			})
		);

	// Access all plugin APIs
	const { columnVisibility, sorting, pagination } = table.plugins;
</script>

<!-- Include controls for all features -->
<!-- Render the table -->
```

Now you have a table with column visibility controls, multi-column sorting, and pagination - all working together seamlessly!

## Utilizing TypeScript Support

The library provides comprehensive TypeScript support for a better development experience:

```ts
import {
	reactiveTable,
	reactivePagination,
	reactiveColumnVisibility,
	reactiveSorting,
	type ColumnDef,
	type ReactiveTableWithPlugins
} from 'svelte-reactive-table';

// Define your data type
type Person = {
	id: number;
	name: string;
	age: number;
	city?: string;
};

// Define typed columns
const columns: ColumnDef<Person>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'age', header: 'Age' },
	{ accessor: 'city', header: 'City' }
];

// Create a typed table
const table = reactiveTable<Person>(data, columns);

// Create a table with typed plugins
const tableWithPlugins = reactiveTable<Person>(data, columns)
	.use(reactiveColumnVisibility())
	.use(reactiveSorting())
	.use(reactivePagination({ pageSize: 10 }));

// TypeScript will infer the correct plugin state types
const { columnVisibility, sorting, pagination } = tableWithPlugins.plugins;
```

## Congratulations!

You've just learned the fundamentals of Svelte Reactive Table! You now know how to:

- Create basic reactive tables
- Add column visibility controls
- Implement pagination
- Handle data updates reactively
- Add sorting functionality
- Combine multiple features

## Summary

This guide covers the basics of using Svelte Reactive Table. Explore the library's capabilities by checking the other documentation sections and API references, or by looking at the example components in the codebase.
