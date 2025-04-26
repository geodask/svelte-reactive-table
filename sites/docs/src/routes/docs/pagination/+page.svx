---
layout: docPage
---

# Pagination

Pagination is essential for handling large datasets efficiently. Svelte Reactive Table provides an intuitive pagination system that makes it easy to navigate through data.

## Adding Pagination

Pagination is optional and added using the `reactivePagination` function:

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
	const table = reactiveTable(data, columns, {
		pagination: reactivePagination({
			pageSize: 10, // Items per page
			page: 0 // Starting page (0-based)
		})
	});
</script>
```

## Displaying Paginated Data

The `table.rows` property is smart - it automatically adapts based on the features you've enabled. When pagination is added, `table.rows` automatically contains only the current page of data:

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

The pagination feature provides simple navigation methods:

```svelte
<script>
	// Go to next page (returns false if already on last page)
	function nextPage() {
		return table.pagination.nextPage();
	}

	// Go to previous page (returns false if already on first page)
	function previousPage() {
		return table.pagination.previousPage();
	}

	// Go to first or last page
	function firstPage() {
		table.pagination.firstPage();
	}

	function lastPage() {
		table.pagination.lastPage();
	}

	// Go to specific page
	function goToPage(pageIndex) {
		table.pagination.setPage(pageIndex);
	}
</script>
```

## Changing Page Size

Adjust how many items are displayed per page:

```svelte
<script>
	// Change page size and reset to first page
	function changePageSize(newSize) {
		table.pagination.setPageSize(newSize);
	}

	// Change page size but stay on current page (if possible)
	function changePageSizeWithoutReset(newSize) {
		table.pagination.setPageSize(newSize, false);
	}
</script>
```

## Complete Pagination UI Example

Here's a practical example of pagination controls:

```svelte
<div class="pagination">
	<!-- Navigation buttons -->
	<button on:click={table.pagination.firstPage} disabled={table.pagination.page === 0}>
		First
	</button>

	<button on:click={table.pagination.previousPage} disabled={table.pagination.page === 0}>
		Previous
	</button>

	<span>
		Page {table.pagination.page + 1} of {table.pagination.pageCount}
	</span>

	<button
		on:click={table.pagination.nextPage}
		disabled={table.pagination.page === table.pagination.pageCount - 1}
	>
		Next
	</button>

	<button
		on:click={table.pagination.lastPage}
		disabled={table.pagination.page === table.pagination.pageCount - 1}
	>
		Last
	</button>

	<!-- Page size selector -->
	<select
		value={table.pagination.pageSize}
		on:change={(e) => table.pagination.setPageSize(Number(e.target.value))}
	>
		<option value="5">5 per page</option>
		<option value="10">10 per page</option>
		<option value="25">25 per page</option>
	</select>
</div>
```

## Pagination Properties

The pagination feature provides these reactive properties:

- `table.pagination.page`: Current page index (0-based)
- `table.pagination.pageSize`: Number of items per page
- `table.pagination.pageCount`: Total number of pages
- `table.rows`: Automatically contains the rows for the current page
- `table.allRows`: All rows across all pages (unaffected by pagination)

## Automatic Reactivity

The pagination system automatically:

- Updates when data items are added or removed
- Recalculates page count when page size changes
- Adjusts the current page if it becomes invalid after data changes

With pagination, you can build tables that efficiently handle large datasets while providing an intuitive browsing experience.
