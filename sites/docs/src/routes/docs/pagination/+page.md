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
			title: 'Plugins',
		},
		{
			title: 'Pagination'
		}
	])
</script>

# Pagination

Pagination enables efficient handling of large datasets by displaying data in smaller, manageable chunks. The pagination plugin provides comprehensive controls for navigating through data pages.

## Pagination Benefits

Pagination provides several advantages for large datasets:

- Improved performance by limiting rendered rows
- Better user experience with manageable data chunks
- Efficient navigation through large datasets

## Enable Pagination

Add pagination using the `reactivePagination` plugin:

```svelte
<script lang="ts">
	import { reactiveTable, reactivePagination } from 'svelte-reactive-table';

	const data = [
		/* Your data array */
	];
	const columns = [
		/* Your column definitions */
	];

	// Create table instance with pagination
	const table = reactiveTable(data, columns).use(
		reactivePagination({
			pageSize: 10, // Items per page
			page: 0 // Starting page (0-based)
		})
	);

	// Access pagination controls through plugins
	const { pagination } = table.plugins;
</script>
```

The `table.rows` property automatically contains only the current page's data.

## Automatic Row Management

The `table.rows` property adapts based on active plugins. With pagination enabled, it contains only the current page's rows:

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

Always use `table.rows` in templates regardless of active plugins. Access all rows with `table.allRows` when needed.

## Navigation Methods

The pagination plugin provides navigation controls:

```svelte
<script>
	// Navigate to next page (returns false if on last page)
	function nextPage() {
		return pagination.goToNextPage();
	}

	// Navigate to previous page (returns false if on first page)
	function previousPage() {
		return pagination.goToPreviousPage();
	}

	// Navigate to first or last page
	function firstPage() {
		pagination.goToFirstPage();
	}

	function lastPage() {
		pagination.goToLastPage();
	}

	// Navigate to specific page
	function goToPage(pageIndex) {
		pagination.setPage(pageIndex);
	}
</script>
```

## Configure Page Size

Adjust the number of items displayed per page:

```svelte
<script>
	// Change page size and reset to first page
	function changePageSize(newSize) {
		pagination.setPageSize(newSize);
	}

	// Change page size but maintain current page if possible
	function changePageSizeWithoutReset(newSize) {
		pagination.setPageSize(newSize, false);
	}
</script>
```

## Pagination Controls Example

Complete pagination interface implementation:

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

## Automatic Updates

The pagination system automatically:

- Updates when data items are added or removed
- Recalculates page count when page size changes
- Adjusts current page if it becomes invalid after data changes

## API Reference

For complete property and method documentation, see the [reactivePagination API reference](/docs/api/reactive-pagination).
