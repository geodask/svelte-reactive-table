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
			title: 'reactivePagination'
		}
	])
</script>

# reactivePagination

The `reactivePagination` function creates a pagination plugin for Svelte Reactive Table, enabling navigation through large datasets by dividing them into manageable pages.

## Signature

```ts
function reactivePagination<T>(
	options?: PaginationOptions
): TablePlugin<T, PaginationState, 'pagination'>;
```

## Parameters

| Parameter | Type                | Description                                        |
| --------- | ------------------- | -------------------------------------------------- |
| `options` | `PaginationOptions` | Optional configuration for the pagination behavior |

### PaginationOptions

| Property   | Type     | Default | Description                  |
| ---------- | -------- | ------- | ---------------------------- |
| `pageSize` | `number` | `10`    | Number of items per page     |
| `page`     | `number` | `0`     | Initial page index (0-based) |

## Return Value

Returns a TablePlugin that adds pagination functionality when passed to the `use` method of the table.

## Basic Usage

```svelte
<script lang="ts">
	import { reactiveTable, reactivePagination } from 'svelte-reactive-table';

	const data = [
		/* Your data array */
	];
	const columns = [
		/* Your column definitions */
	];

	// Create a table with pagination plugin
	const table = reactiveTable(data, columns).use(
		reactivePagination({
			pageSize: 10,
			page: 0
		})
	);

	// Access the pagination API through table.plugins
	const { pagination } = table.plugins;
</script>

<table>
	<!-- Table headers -->
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

## Pagination Properties

When pagination is enabled, these properties are available:

| Property                     | Type      | Description                                |
| ---------------------------- | --------- | ------------------------------------------ |
| `pagination.page`            | `number`  | Current page index (0-based)               |
| `pagination.pageSize`        | `number`  | Number of items per page                   |
| `pagination.pageCount`       | `number`  | Total number of pages                      |
| `pagination.isFirstPage`     | `boolean` | Whether current page is the first page     |
| `pagination.isLastPage`      | `boolean` | Whether current page is the last page      |
| `pagination.hasPreviousPage` | `boolean` | Whether there is a previous page available |
| `pagination.hasNextPage`     | `boolean` | Whether there is a next page available     |

## Pagination Methods

These methods are available on the pagination plugin state:

| Method                                           | Return Type | Description                                  |
| ------------------------------------------------ | ----------- | -------------------------------------------- |
| `setPage(page: number)`                          | `void`      | Go to a specific page                        |
| `setPageSize(size: number, resetPage?: boolean)` | `void`      | Change page size (with optional page reset)  |
| `goToNextPage()`                                 | `boolean`   | Go to next page (returns success status)     |
| `goToPreviousPage()`                             | `boolean`   | Go to previous page (returns success status) |
| `goToFirstPage()`                                | `void`      | Go to the first page                         |
| `goToLastPage()`                                 | `void`      | Go to the last page                          |

## Example Controls

```svelte
<div class="pagination">
	<button click={() => pagination.goToPreviousPage()} disabled={!pagination.hasPreviousPage}>
		Previous
	</button>

	<span>Page {pagination.page + 1} of {pagination.pageCount}</span>

	<button click={() => pagination.goToNextPage()} disabled={!pagination.hasNextPage}> Next </button>

	<select bind:value={pagination.pageSize}>
		<option value={5}>5 per page</option>
		<option value={10}>10 per page</option>
		<option value={25}>25 per page</option>
	</select>
</div>
```

## TypeScript Support

```ts
import { reactiveTable, reactivePagination } from 'svelte-reactive-table';

type User = {
	id: number;
	name: string;
	age: number;
};

const table = reactiveTable<User>(users, columns).use(reactivePagination({ pageSize: 10 }));

// TypeScript will infer the correct pagination state type
const { pagination } = table.plugins;
```
