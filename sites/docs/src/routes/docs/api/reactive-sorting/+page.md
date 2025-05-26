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
			title: 'API Reference',
		},
		{
			title: 'reactiveSorting'
		}
	])
</script>

# reactiveSorting

The `reactiveSorting` function creates a sorting plugin for table instances, enabling data sorting in ascending or descending order across single or multiple columns.

## Signature

```ts
function reactiveSorting<T>(
	options?: SortingOptions<T>
): TablePlugin<T, SortingState<T>, 'sorting'>;
```

## Parameters

| Parameter | Type                | Description                                     |
| --------- | ------------------- | ----------------------------------------------- |
| `options` | `SortingOptions<T>` | Optional configuration for the sorting behavior |

### SortingOptions

| Property         | Type                                      | Default | Description                             |
| ---------------- | ----------------------------------------- | ------- | --------------------------------------- |
| `columnSortings` | `ColumnSorting<T>[]`                      | `[]`    | Initial column sorting states           |
| `multiSort`      | `boolean`                                 | `false` | Whether multi-column sorting is enabled |
| `comparators`    | `Record<keyof T, Comparator<T[keyof T]>>` | `{}`    | Custom comparison functions for columns |

### ColumnSorting

| Property    | Type           | Description                      |
| ----------- | -------------- | -------------------------------- |
| `key`       | `keyof T`      | The key of the column to sort by |
| `direction` | `'asc'⎮'desc'` | The direction of the sort        |

## Return Value

Returns a TablePlugin that adds sorting functionality when passed to the `use` method of the table.

## Basic Usage

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
			columnSortings: [{ key: 'name', direction: 'asc' }],
			multiSort: false
		})
	);

	// Access the sorting API through table.plugins
	const { sorting } = table.plugins;
</script>

<table>
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

## Sorting Properties

When sorting plugin is used, these properties are available:

| Property                 | Type                 | Description                             |
| ------------------------ | -------------------- | --------------------------------------- |
| `sorting.columnSortings` | `ColumnSorting<T>[]` | Current active column sorting states    |
| `sorting.multiSort`      | `boolean`            | Whether multi-column sorting is enabled |

## Sorting Methods

These methods are available on the sorting plugin state:

| Method                                | Return Type                 | Description                                 |
| ------------------------------------- | --------------------------- | ------------------------------------------- |
| `toggleSort(accessor: keyof T)`       | `void`                      | Toggle sort direction for a column          |
| `clearSort()`                         | `void`                      | Remove all sorting                          |
| `getSortDirection(accessor: keyof T)` | `'asc' \| 'desc' \| 'none'` | Get the current sort direction for a column |

## Custom Comparators

You can provide custom comparison functions for specific columns:

```svelte
<script>
	const table = reactiveTable(data, columns).use(
		reactiveSorting({
			comparators: {
				// Case-insensitive string comparison
				name: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),

				// Date comparison
				createdAt: (a, b) => new Date(a).getTime() - new Date(b).getTime(),

				// Numeric comparison with null handling
				price: (a, b) => {
					if (a === null && b === null) return 0;
					if (a === null) return -1;
					if (b === null) return 1;
					return a - b;
				}
			}
		})
	);
</script>
```

## Multi-Column Sorting Examples

Multi-column sorting allows sorting by multiple columns with precedence:

```svelte
<script>
	const table = reactiveTable(data, columns).use(
		reactiveSorting({
			multiSort: true,
			columnSortings: [
				{ key: 'department', direction: 'asc' },
				{ key: 'name', direction: 'asc' }
			]
		})
	);

	const { sorting } = table.plugins;
	
	// Display active sorts
	function getActiveSorts() {
		return sorting.columnSortings.map((sort, index) => 
			`${index + 1}. ${sort.key} (${sort.direction})`
		).join(', ');
	}
</script>

<!-- Show current sort state -->
<div class="sort-info">
	{#if sorting.columnSortings.length > 0}
		Active sorts: {getActiveSorts()}
	{:else}
		No sorting applied
	{/if}
</div>
```

## Sortable Headers Example

```svelte
<thead>
	<tr>
		{#each table.columns as column}
			<th 
				onclick={() => sorting.toggleSort(column.accessor)}
				class="sortable-header"
			>
				{column.header}
				{#if sorting.getSortDirection(column.accessor) !== 'none'}
					<span class="sort-indicator">
						{sorting.getSortDirection(column.accessor) === 'asc' ? '↑' : '↓'}
					</span>
				{/if}
			</th>
		{/each}
	</tr>
</thead>

<style>
	.sortable-header {
		cursor: pointer;
		user-select: none;
	}
	
	.sort-indicator {
		margin-left: 4px;
		opacity: 0.7;
	}
</style>
```

## TypeScript Support

```ts
import { reactiveTable, reactiveSorting } from 'svelte-reactive-table';

type User = {
	id: number;
	name: string;
	age: number;
};

const table = reactiveTable<User>(users, columns).use(
	reactiveSorting<User>({
		columnSortings: [{ key: 'name', direction: 'asc' }],
		comparators: {
			age: (a, b) => a - b
		}
	})
);

// TypeScript will infer the correct sorting state type
const { sorting } = table.plugins;
```
