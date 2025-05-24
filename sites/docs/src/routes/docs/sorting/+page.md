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

Svelte Reactive Table provides flexible, reactive sorting capabilities that work seamlessly with both single-column and multi-column approaches.

## Adding Sorting to Your Table

Sorting is optional and added using the `reactiveSorting` plugin:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveSorting } from 'svelte-reactive-table';

	const data = [
		/* Your data array */
	];
	const columns = [
		/* Your column definitions */
	];

	// Create a table with sorting plugin
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

	// Access the sorting API through table.plugins
	const { sorting } = table.plugins;
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

## Managing Sorting State

The sorting plugin provides these intuitive methods for controlling sort behavior:

```svelte
<script>
	// Toggle sort direction for a column (asc → desc → none)
	function toggleSort(columnKey) {
		sorting.toggleSort(columnKey);
	}

	// Remove all sorting
	function clearSort() {
		sorting.clearSort();
	}

	// Get the current sort direction for a column
	function getSortDirection(columnKey) {
		return sorting.getSortDirection(columnKey); // Returns 'asc', 'desc', or 'none'
	}
</script>
```

## Building Sortable Column Headers

Here's an example of creating sortable column headers:

```svelte
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
```

## Single vs Multi-Column Sorting

By default, sorting is single-column only, meaning when you sort by a new column, any previous sort is cleared.

To enable multi-column sorting:

```svelte
const table = reactiveTable(data, columns)
	.use(reactiveSorting({
		multiSort: true
	}));
```

With multi-column sorting enabled:

- Each call to `toggleSort()` adds that column to the sort stack
- Columns cycle through: ascending → descending → removed from sort
- The order matters - earlier sorts take precedence over later ones

## Custom Sort Functions

For complex data types or custom sorting logic, you can provide your own comparator functions:

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

## Sorting Properties

The sorting plugin provides these reactive properties:

- `sorting.columnSortings`: Array of active column sorts (each with `key` and `direction`)
- `sorting.multiSort`: Whether multi-column sorting is enabled
- `table.rows`: Automatically contains the sorted rows based on current sort state

## Automatic Reactivity

The sorting system automatically:

- Re-sorts when data items change
- Re-sorts when sort configurations change
- Works seamlessly with other features like pagination

With the sorting feature, you can provide a rich user experience for data organization while keeping your code clean and reactive.

## TypeScript Support

Sorting is fully typed to work with your data structure:

```ts
import { reactiveTable, reactiveSorting } from 'svelte-reactive-table';

type User = {
	id: number;
	name: string;
	registeredAt: string;
};

const table = reactiveTable<User>(users, columns).use(
	reactiveSorting<User>({
		columnSortings: [{ key: 'name', direction: 'asc' }],
		comparators: {
			// TypeScript ensures you only reference valid columns
			registeredAt: (a, b) => new Date(a).getTime() - new Date(b).getTime()
		}
	})
);

// Access the sorting API with type safety
const { sorting } = table.plugins;
```
