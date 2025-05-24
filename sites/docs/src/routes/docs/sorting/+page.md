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
			title: 'Core Concepts',
		},
		{
			title: 'Sorting'
		}
	])
</script>

# Sorting

Sorting allows users to organize table data in ascending or descending order. Svelte Reactive Table provides flexible, reactive sorting capabilities that work with both single-column and multi-column approaches.

## Adding Sorting

Sorting is optional and added using the `reactiveSorting` function:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveSorting } from 'svelte-reactive-table';

	const data = [
		/* Your data array */
	];
	const columns = [
		/* Your column definitions */
	];

	// Create a table with sorting
	const table = reactiveTable(data, columns, {
		sorting: reactiveSorting({
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
	});
</script>
```

## Displaying Sorted Data

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

No special handling is needed in your templates - the table handles transforming the rows based on the active sort state.

## Managing Sorting

The sorting feature provides these main methods:

```svelte
<script>
	// Toggle sort direction for a column (asc → desc → none)
	function toggleSort(columnKey) {
		table.sorting.toggleSort(columnKey);
	}

	// Remove all sorting
	function clearSort() {
		table.sorting.clearSort();
	}
</script>
```

## Building Sortable Column Headers

Here's an example of creating sortable column headers:

```svelte
<thead>
	<tr>
		{#each table.columns as column}
			<th onclick={() => table.sorting.toggleSort(column.accessor)}>
				{column.header}
				{#if table.sorting.columnSortings.some((sort) => sort.key === column.accessor)}
					{#if table.sorting.columnSortings.find((sort) => sort.key === column.accessor)?.direction === 'asc'}
						↑
					{:else}
						↓
					{/if}
				{/if}
			</th>
		{/each}
	</tr>
</thead>
```

## Single vs Multi-Column Sorting

By default, sorting is single-column only, meaning when you sort by a new column, any previous sort is cleared.

To enable multi-column sorting:

```svelte
const table = reactiveTable(data, columns, {
	sorting: reactiveSorting({
		multiSort: true
	})
});
```

With multi-column sorting enabled:

- Each call to `toggleSort()` adds that column to the sort stack
- Columns cycle through: ascending → descending → removed from sort
- The order matters - earlier sorts take precedence over later ones

## Custom Sort Functions

For complex data types or custom sorting logic, provide your own comparator functions:

```svelte
const table = reactiveTable(data, columns, {
	sorting: reactiveSorting({
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
	})
});
```

## Sorting Properties

The sorting feature provides these reactive properties:

- `table.sorting.columnSortings`: Array of active column sorts (each with `key` and `direction`)
- `table.sorting.multiSort`: Whether multi-column sorting is enabled
- `table.rows`: Automatically contains the sorted rows based on current sort state

## Automatic Reactivity

The sorting system automatically:

- Re-sorts when data items change
- Re-sorts when sort configurations change
- Works seamlessly with other features like pagination

With the sorting feature, you can provide a rich user experience for data organization while keeping your code clean and reactive.
