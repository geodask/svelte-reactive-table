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

This guide demonstrates how to enhance your Svelte Reactive Table with plugins for pagination, column visibility, and sorting. Each plugin adds specific functionality while maintaining the table's reactive behavior.

> New to Svelte Reactive Table? Start with [Basic Usage](/docs/basic-usage) to learn table creation fundamentals, then return here to add plugins.

## Starting Point

This guide assumes you have a basic table setup:

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

<!-- Render your table -->
<table>
	<thead>
		<tr>
			{#each table.headers as header}
				<th>{header}</th>
			{/each}
		</tr>
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
```

Now let's enhance this table with plugins.

## Adding Column Visibility Controls

The `reactiveColumnVisibility` plugin allows users to show and hide columns:

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
	<button onclick={() => columnVisibility.toggleVisibility('age')}>
		{columnVisibility.isVisible('age') ? 'Hide' : 'Show'} Age Column
	</button>
	<button onclick={() => columnVisibility.hideColumn('city')}> Hide City Column </button>
	<button onclick={() => columnVisibility.showColumn('city')}> Show City Column </button>
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

## Adding Data Filtering

Enable users to search and filter data with the filtering plugin:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveFiltering, filterHelpers } from 'svelte-reactive-table';

	// Same data and columns as above

	// Create a table with filtering plugin
	const table = reactiveTable(data, columns).use(reactiveFiltering());

	// Access the filtering API through table.plugins
	const { filtering } = table.plugins;

	// Form state for filters
	let nameSearch = $state('');
	let minAge = $state<number | undefined>();
	let maxAge = $state<number | undefined>();

	// Sync filters with form state using effects
	$effect(() => {
		filtering.setFilter('name', nameSearch.trim());
	});

	$effect(() => {
		filtering.setFilter('age', filterHelpers.range(minAge, maxAge));
	});
</script>

<!-- Filter controls -->
<div class="filters">
	<input type="text" bind:value={nameSearch} placeholder="Search names..." />

	<input type="number" bind:value={minAge} placeholder="Min age" />

	<input type="number" bind:value={maxAge} placeholder="Max age" />

	{#if filtering.hasActiveFilters}
		<button
			onclick={() => {
				filtering.clearFilters();
				nameSearch = '';
				minAge = undefined;
				maxAge = undefined;
			}}
		>
			Clear Filters ({filtering.count})
		</button>
	{/if}

	<p>Showing {table.rows.length} of {table.allRows.length} results</p>
</div>

<table>
	<!-- Table as before -->
</table>
```

The filtering plugin supports:

- **Exact matches**: `filtering.setFilter('city', 'New York')`
- **Array filters (IN)**: `filtering.setFilter('city', ['New York', 'Los Angeles'])`
- **Predicate functions**: `filtering.setFilter('age', (age) => age >= 25)`
- **Filter helpers**: `filterHelpers.range()`, `filterHelpers.startsWith()`, etc.
- **Case-insensitive string search** by default (substring matching)

## Combining Multiple Features

The real power comes from combining multiple features. Here's a fully-featured table:

```svelte
<script lang="ts">
	import {
		reactiveTable,
		reactiveColumnVisibility,
		reactiveFiltering,
		reactivePagination,
		reactiveSorting
	} from 'svelte-reactive-table';

	// Same data and columns as above

	// Create a table with multiple plugins
	const table = reactiveTable(data, columns)
		.use(reactiveColumnVisibility())
		.use(reactiveFiltering())
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
	const { columnVisibility, filtering, sorting, pagination } = table.plugins;
</script>

<!-- Include controls for all features -->
<!-- Render the table -->
```

Now you have a table with column visibility controls, data filtering, multi-column sorting, and pagination - all working together seamlessly!

The plugins work together intelligently:

- Filtering is applied first to narrow down the dataset
- Sorting is applied to the filtered results
- Pagination divides the filtered and sorted results into pages
- Column visibility affects which columns are displayed throughout

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
- Add data filtering with multiple filter types
- Combine multiple features

## Summary

This guide covers the basics of using Svelte Reactive Table. Explore the library's capabilities by checking the other documentation sections and API references, or by looking at the example components in the codebase.
