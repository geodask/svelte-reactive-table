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

The `reactiveSorting` function creates sorting functionality for Svelte Reactive Table, enabling users to sort data in ascending or descending order across one or multiple columns.

## Signature

```ts
function reactiveSorting<T>(options?: SortingOptions): ReactiveSortingFactory<T>;
```

## Parameters

| Parameter | Type             | Description                                     |
| --------- | ---------------- | ----------------------------------------------- |
| `options` | `SortingOptions` | Optional configuration for the sorting behavior |

### SortingOptions

| Property         | Type                         | Default | Description                             |
| ---------------- | ---------------------------- | ------- | --------------------------------------- |
| `columnSortings` | `ColumnSorting[]`            | `[]`    | Initial column sorting states           |
| `multiSort`      | `boolean`                    | `false` | Whether multi-column sorting is enabled |
| `comparators`    | `Record<string, Comparator>` | `{}`    | Custom comparison functions for columns |

### ColumnSorting

| Property    | Type           | Description                      |
| ----------- | -------------- | -------------------------------- |
| `key`       | `string`       | The key of the column to sort by |
| `direction` | `'asc'⎮'desc'` | The direction of the sort        |

## Return Value

Returns a factory function that creates sorting functionality when passed to `reactiveTable`.

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

	const table = reactiveTable(data, columns, {
		sorting: reactiveSorting({
			columnSortings: [{ key: 'name', direction: 'asc' }],
			multiSort: false
		})
	});
</script>

<table>
	<thead>
		<tr>
			{#each table.columns as column}
				<th on:click={() => table.sorting.toggleSort(column.accessor)}>
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

When sorting is enabled, these properties are available:

| Property                       | Type              | Description                             |
| ------------------------------ | ----------------- | --------------------------------------- |
| `table.sorting.columnSortings` | `ColumnSorting[]` | Current active column sorting states    |
| `table.sorting.multiSort`      | `boolean`         | Whether multi-column sorting is enabled |

## Sorting Methods

These methods are available on the table's `sorting` object:

| Method                          | Return Type | Description                        |
| ------------------------------- | ----------- | ---------------------------------- |
| `toggleSort(accessor: keyof T)` | `void`      | Toggle sort direction for a column |
| `clearSort()`                   | `void`      | Remove all sorting                 |

## Custom Comparators

You can provide custom comparison functions for specific columns:

```svelte
<script>
	const table = reactiveTable(data, columns, {
		sorting: reactiveSorting({
			comparators: {
				// Case-insensitive string comparison
				name: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),

				// Date comparison
				createdAt: (a, b) => new Date(a).getTime() - new Date(b).getTime()
			}
		})
	});
</script>
```

## Multi-Column Sorting

Multi-column sorting allows sorting by multiple columns with precedence:

```svelte
<script>
	const table = reactiveTable(data, columns, {
		sorting: reactiveSorting({
			multiSort: true
		})
	});
</script>

<!-- Example for how users can see multi-column sort state -->
<div class="active-sorts">
	Active sorts:
	{#each table.sorting.columnSortings as sort, i}
		<span>
			{i + 1}. {sort.key} ({sort.direction})
		</span>
	{/each}
</div>
```

## TypeScript Support

```ts
type User = {
	id: number;
	name: string;
	age: number;
};

const sorting = reactiveSorting<User>({
	columnSortings: [{ key: 'name', direction: 'asc' }],
	comparators: {
		age: (a, b) => a - b
	}
});

const table = reactiveTable<User>(users, columns, { sorting });
```
