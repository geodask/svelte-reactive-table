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

The `reactivePagination` function creates pagination functionality for Svelte Reactive Table, enabling navigation through large datasets by dividing them into manageable pages.

## Signature

```ts
function reactivePagination<T>(options?: PaginationOptions): ReactivePaginationFactory<T>;
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

Returns a factory function that creates pagination functionality when passed to `reactiveTable`.

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

	const table = reactiveTable(data, columns, {
		pagination: reactivePagination({
			pageSize: 10,
			page: 0
		})
	});
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

| Property                     | Type     | Description                  |
| ---------------------------- | -------- | ---------------------------- |
| `table.pagination.page`      | `number` | Current page index (0-based) |
| `table.pagination.pageSize`  | `number` | Number of items per page     |
| `table.pagination.pageCount` | `number` | Total number of pages        |

## Pagination Methods

These methods are available on the table's `pagination` object:

| Method                                           | Return Type | Description                                  |
| ------------------------------------------------ | ----------- | -------------------------------------------- |
| `setPage(page: number)`                          | `void`      | Go to a specific page                        |
| `setPageSize(size: number, resetPage?: boolean)` | `void`      | Change page size (with optional page reset)  |
| `nextPage()`                                     | `boolean`   | Go to next page (returns success status)     |
| `previousPage()`                                 | `boolean`   | Go to previous page (returns success status) |
| `firstPage()`                                    | `void`      | Go to the first page                         |
| `lastPage()`                                     | `void`      | Go to the last page                          |

## Example Controls

```svelte
<div class="pagination">
	<button onclick={table.pagination.previousPage} disabled={table.pagination.page === 0}>
		Previous
	</button>

	<span>Page {table.pagination.page + 1} of {table.pagination.pageCount}</span>

	<button
		onclick={table.pagination.nextPage}
		disabled={table.pagination.page === table.pagination.pageCount - 1}
	>
		Next
	</button>

	<select
		value={table.pagination.pageSize}
		onchange={(e) => table.pagination.setPageSize(Number(e.target.value))}
	>
		<option value="5">5 per page</option>
		<option value="10">10 per page</option>
		<option value="25">25 per page</option>
	</select>
</div>
```

## TypeScript Support

```ts
type User = {
	id: number;
	name: string;
	age: number;
};

const pagination = reactivePagination<User>({ pageSize: 10 });

const table = reactiveTable<User>(users, columns, { pagination });
```
