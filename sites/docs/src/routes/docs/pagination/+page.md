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
			title: 'Pagination'
		}
	])
</script>

# Pagination

When you're dealing with hundreds or thousands of rows, pagination becomes essential. Svelte Reactive Table makes pagination both powerful and simple to implement.

## Why Pagination Matters

Without pagination, large datasets can:

- Slow down your app's performance
- Overwhelm users with too much information
- Make it hard to find specific data

With pagination, you get fast, user-friendly tables that handle any amount of data gracefully.

## Adding Pagination to Your Table

Pagination is optional and added using the `reactivePagination` plugin:

```svelte
<script lang="ts">
	import { reactiveTable, reactivePagination } from 'svelte-reactive-table';

	const data = [
		/* Your data array */
	];
	const columns = [
		/* Your column definitions */
	];

	// Create a table with pagination
	const table = reactiveTable(data, columns).use(
		reactivePagination({
			pageSize: 10, // Items per page
			page: 0 // Starting page (0-based)
		})
	);

	// Access the pagination API through table.plugins
	const { pagination } = table.plugins;
</script>
```

The `table.rows` property automatically contains only the current page's data. You don't need to change your template at all.

## The Smart `table.rows` Property

The `table.rows` property automatically adapts based on your active features. With pagination enabled, it contains exactly the rows for the current page:

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

This means you always use `table.rows` in your templates regardless of which features are active. The table handles transforming the rows based on pagination, sorting, or filtering (once implemented).

If you need to access all rows regardless of pagination, you can use `table.allRows`.

## Navigation Controls

The pagination plugin provides simple navigation methods:

```svelte
<script>
	// Go to next page (returns false if already on last page)
	function nextPage() {
		return pagination.goToNextPage();
	}

	// Go to previous page (returns false if already on first page)
	function previousPage() {
		return pagination.goToPreviousPage();
	}

	// Go to first or last page
	function firstPage() {
		pagination.goToFirstPage();
	}

	function lastPage() {
		pagination.goToLastPage();
	}

	// Go to specific page
	function goToPage(pageIndex) {
		pagination.setPage(pageIndex);
	}
</script>
```

## Changing Page Size

Adjust how many items are displayed per page:

```svelte
<script>
	// Change page size and reset to first page
	function changePageSize(newSize) {
		pagination.setPageSize(newSize);
	}

	// Change page size but stay on current page (if possible)
	function changePageSizeWithoutReset(newSize) {
		pagination.setPageSize(newSize, false);
	}
</script>
```

## Complete Pagination UI Example

Here's a practical example of pagination controls:

```svelte
<div class="pagination">
	<!-- Navigation buttons -->
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
	<select bind:value={pagination.pageSize}>
		<option value={5}>5 per page</option>
		<option value={10}>10 per page</option>
		<option value={25}>25 per page</option>
	</select>
</div>
```

## Pagination Properties

The pagination plugin provides these reactive properties:

- `pagination.page`: Current page index (0-based)
- `pagination.pageSize`: Number of items per page
- `pagination.pageCount`: Total number of pages
- `pagination.isFirstPage`: Whether the current page is the first page
- `pagination.isLastPage`: Whether the current page is the last page
- `pagination.hasPreviousPage`: Whether there is a previous page available
- `pagination.hasNextPage`: Whether there is a next page available
- `table.rows`: Automatically contains the rows for the current page
- `table.allRows`: All rows across all pages (unaffected by pagination)

## Automatic Reactivity

The pagination system automatically:

- Updates when data items are added or removed
- Recalculates page count when page size changes
- Adjusts the current page if it becomes invalid after data changes

With pagination, you can build tables that efficiently handle large datasets while providing an intuitive browsing experience.
