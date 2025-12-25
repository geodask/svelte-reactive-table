---
layout: docPage
breadcrumb: ['Plugins', 'Sorting']
prev: { title: 'Pagination', href: '/docs/pagination' }
next: { title: 'Basic Table Example', href: '/docs/examples/basic-table' }
---

# Sorting

The sorting plugin provides flexible, reactive sorting capabilities for both single-column and multi-column scenarios. Data automatically updates based on sort state changes.

## Enable Sorting

Add sorting using the `reactiveSorting` plugin:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveSorting } from 'svelte-reactive-table';

	const data = [
		/* Your data array */
	];
	const columns = [
		/* Your column definitions */
	];

	// Create table instance with sorting plugin
	const table = reactiveTable(data, columns).use(
		reactiveSorting({
			// Optional: Initial column sorting state
			columnSortings: [{ key: 'name', direction: 'asc' }],
			// Optional: Enable multi-column sorting
			multiSort: false,
			// Optional: Custom comparator functions for specific columns
			comparators: {
				// Custom sorting for date columns
				createdAt: (a, b) => new Date(a).getTime() - new Date(b).getTime()
			}
		})
	);

	// Access sorting controls through plugins
	const { sorting } = table.plugins;
</script>
```

## Automatic Sorted Data

The `table.rows` property automatically contains data sorted according to the current sort state:

```svelte
<tbody>
	{#each table.rows as row}
		<tr>
			{#each row.cells as cell}
				<td>{cell.value}</td>
			{/each}
		</tr>
	{/each}
</tbody>
```

No special handling needed in templates - the table automatically transforms rows based on sort state.

## Sort Control Methods

The sorting plugin provides methods for managing sort behavior:

```svelte
<script>
	// Toggle sort direction for a column (asc → desc → none)
	function toggleSort(columnKey) {
		sorting.toggleSort(columnKey);
	}

	// Clear all sorting
	function clearSort() {
		sorting.clearSort();
	}

	// Get current sort direction for a column
	function getSortDirection(columnKey) {
		return sorting.getSortDirection(columnKey); // Returns 'asc', 'desc', or 'none'
	}
</script>
```

## Sortable Column Headers

Example implementation of sortable column headers:

```svelte
<thead>
	<tr>
		{#each table.columns as column}
			<th onclick={() => sorting.toggleSort(column.accessor)}>
				{column.header}
				{#if sorting.getSortDirection(column.accessor) !== 'none'}
					{sorting.getSortDirection(column.accessor) === 'asc' ? '↑' : '↓'}
				{/if}
			</th>
		{/each}
	</tr>
</thead>
```

## Single vs Multi-Column Sorting

By default, sorting is single-column - sorting by a new column clears previous sorts.

Enable multi-column sorting:

```svelte
const table = reactiveTable(data, columns)
	.use(reactiveSorting({
		multiSort: true
	}));
```

With multi-column sorting enabled:

- Each `toggleSort()` call adds columns to the sort stack
- Columns cycle through: ascending → descending → removed from sort
- Sort order matters - earlier sorts take precedence

## Custom Sort Functions

Provide custom comparator functions for complex data types:

```svelte
const table = reactiveTable(data, columns)
	.use(reactiveSorting({
		comparators: {
			// Case-insensitive string comparison
			name: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),

			// Date comparison (assuming ISO strings)
			createdAt: (a, b) => new Date(a).getTime() - new Date(b).getTime(),

			// Custom numeric sorting with null handling
			price: (a, b) => {
				if (a === null) return -1;
				if (b === null) return 1;
				return a - b;
			}
		}
	}));
```

## Automatic Updates

The sorting system automatically:

- Re-sorts when data items change
- Re-sorts when sort configurations change
- Works seamlessly with other plugins like pagination and filtering

## Integration with Other Plugins

Sorting works seamlessly with other plugins and is applied in a specific order:

```svelte
<script>
	import {
		reactiveTable,
		reactiveFiltering,
		reactiveSorting,
		reactivePagination
	} from 'svelte-reactive-table';

	// Order: filter → sort → paginate
	const table = reactiveTable(data, columns)
		.use(reactiveFiltering())
		.use(reactiveSorting({ multiSort: true }))
		.use(reactivePagination({ pageSize: 10 }));

	// Sorting is applied to filtered results
	// Pagination shows sorted, filtered results
</script>
```

When combined with other plugins:

- Sorting is applied to filtered results (if filtering is enabled)
- Pagination divides the sorted results into pages
- All plugins work together automatically

## API Reference

For complete property and method documentation, see the [reactiveSorting API reference](/docs/api/reactive-sorting).

## Related

- [Filtering](/docs/filtering) - Filter data before sorting
- [Pagination](/docs/pagination) - Paginate sorted results
- [Sorting Example](/docs/examples/sorting) - Interactive examples
