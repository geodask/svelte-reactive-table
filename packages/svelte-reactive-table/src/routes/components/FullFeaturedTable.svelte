<script lang="ts">
	import {
		reactiveColumnVisibility,
		reactivePagination,
		reactiveSorting,
		reactiveTable
	} from '$lib/index.js';
	import { initialData } from './data.js';

	// Create a table with the new plugin architecture
	const table = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	])
		// Chain plugins with a fluent API
		.use(
			reactiveColumnVisibility({
				hiddenColumns: [] // No hidden columns by default
			})
		)
		.use(
			reactiveSorting({
				columnSortings: [{ key: 'name', direction: 'asc' }],
				multiSort: true
			})
		)
		.use(
			reactivePagination({
				pageSize: 5,
				page: 0
			})
		);

	const visibility = table.plugins.columnVisibility;
	const tableSorting = table.plugins.sorting;
	const tablePagination = table.plugins.pagination;

	const pageSizeOptions = [3, 5, 10];

	// Helper to get sort icon
	function getSortIcon(direction: 'asc' | 'desc' | 'none') {
		if (direction === 'asc') return '↑';
		if (direction === 'desc') return '↓';
		return '';
	}
</script>

<section class="mx-auto my-8 px-4">
	<h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Full Featured Example</h2>

	<!-- Feature Panels -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
		<!-- Column Visibility Panel -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h3 class="text-lg font-semibold mb-3 text-gray-700">Column Visibility</h3>
			<p class="text-sm text-gray-600 mb-3">Toggle columns to show/hide:</p>
			<div class="flex flex-wrap gap-2">
				{#each table.allColumns as column}
					<button
						class="px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200 focus:outline-none
              {visibility.isVisible(column.accessor)
							? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
							: 'bg-gray-100 text-gray-600 border border-gray-200'}"
						onclick={() => visibility.toggleVisibility(column.accessor)}
					>
						<div class="flex items-center gap-1">
							<span class="w-3 h-3 flex items-center justify-center">
								{#if visibility.isVisible(column.accessor)}
									✓
								{:else}
									×
								{/if}
							</span>
							{String(column.accessor)}
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Sorting Panel -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h3 class="text-lg font-semibold mb-3 text-gray-700">Sorting</h3>
			<p class="text-sm text-gray-600 mb-3">Click to sort by column:</p>
			<div class="flex flex-wrap gap-2">
				{#each table.columns as column}
					<button
						class="px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200
              border border-gray-200 hover:bg-gray-50"
						onclick={() => tableSorting.toggleSort(column.accessor)}
					>
						{String(column.accessor)}
						{getSortIcon(tableSorting.getSortDirection(column.accessor))}
					</button>
				{/each}
				<button
					class="px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200
            border border-gray-200 bg-gray-50"
					onclick={() => tableSorting.clearSort()}
				>
					Clear Sort
				</button>
			</div>
		</div>

		<!-- Pagination Panel -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h3 class="text-lg font-semibold mb-3 text-gray-700">Pagination</h3>
			<p class="text-sm text-gray-600 mb-3">
				Showing {tablePagination.pageItemRange.start}-{tablePagination.pageItemRange.end}
				of {tablePagination.totalItems} items
			</p>

			<div class="flex items-center justify-between">
				<div class="flex gap-2">
					{#each pageSizeOptions as size}
						<button
							class="px-2 py-1 rounded-md text-xs transition-all duration-200
                {tablePagination.pageSize === size
								? 'bg-blue-100 text-blue-800 border border-blue-300'
								: 'bg-gray-100 text-gray-600 border border-gray-200'}"
							onclick={() => tablePagination.setPageSize(size)}
						>
							{size}
						</button>
					{/each}
				</div>

				<div class="flex gap-2">
					<button
						class="px-3 py-1 rounded-md text-xs transition-all duration-200
              {!tablePagination.hasPreviousPage
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						onclick={() => tablePagination.goToPreviousPage()}
						disabled={!tablePagination.hasPreviousPage}
					>
						Previous
					</button>

					<span class="px-3 py-1 text-xs">
						Page {tablePagination.page + 1} of {tablePagination.pageCount}
					</span>

					<button
						class="px-3 py-1 rounded-md text-xs transition-all duration-200
              {!tablePagination.hasNextPage
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						onclick={() => tablePagination.goToNextPage()}
						disabled={!tablePagination.hasNextPage}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="bg-gray-50 border-b border-gray-200">
						{#each table.headers as header}
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>{header}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each table.rows as row}
						<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
							{#each row.cells as cell}
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.value}</td>
							{/each}
						</tr>
					{/each}
					{#if table.rows.length === 0}
						<tr>
							<td
								colspan={table.headers.length}
								class="px-6 py-8 text-center text-sm text-gray-500"
							>
								No data available.
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</section>
