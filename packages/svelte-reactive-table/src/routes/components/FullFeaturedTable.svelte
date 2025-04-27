<script lang="ts">
	import {
		reactiveTable,
		reactiveColumnVisibility,
		reactivePagination,
		reactiveSorting,
		type ColumnSorting
	} from '$lib/index.js';
	import { initialData, type Person } from './data.js';

	// Create a fully featured table with all available features enabled
	const table = reactiveTable(
		initialData,
		[
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		],
		{
			// Column visibility feature
			columnVisibility: reactiveColumnVisibility({
				hiddenColumns: [] // No hidden columns by default
			}),
			// Pagination feature
			pagination: reactivePagination({
				pageSize: 5, // Default page size
				page: 0 // Start at first page
			}),
			// Sorting feature
			sorting: reactiveSorting({
				// Initial sorting by name ascending
				columnSortings: [{ key: 'name', direction: 'asc' }],
				// Enable multi-column sorting
				multiSort: true
			})
		}
	);

	// Page size options
	const pageSizeOptions = [3, 5, 10];

	// Column visibility toggle
	function toggleColumn(accessor: keyof Person) {
		table.columnVisibility.toggleColumnVisibility(accessor);
	}

	// Set page size
	function setPageSize(size: number) {
		table.pagination.setPageSize(size);
	}

	// Sorting functions
	function handleSort(accessor: keyof Person) {
		table.sorting.toggleSort(accessor);
	}

	function clearSorting() {
		table.sorting.clearSort();
	}

	// Helper function to determine the current sort direction for a column
	function getSortDirection(accessor: string) {
		const sorting = table.sorting.columnSortings.find((s: ColumnSorting) => s.key === accessor);
		return sorting ? sorting.direction : 'none';
	}
</script>

<section class="max-w-6xl mx-auto my-8 px-4">
	<h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Full-Featured Table</h2>

	<!-- Feature Panels -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
		<!-- Column Visibility Panel -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h3 class="text-lg font-semibold mb-3 text-gray-700">Column Visibility</h3>
			<p class="text-sm text-gray-600 mb-3">Toggle columns to show/hide:</p>
			<div class="flex flex-wrap gap-2">
				{#each table.allColumns as column}
					<button
						class="px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                {table.columnVisibility.isColumnVisible(column.accessor)
							? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
							: 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}"
						on:click={() => toggleColumn(column.accessor)}
					>
						<div class="flex items-center gap-1">
							<span class="w-3 h-3 flex items-center justify-center">
								{#if table.columnVisibility.isColumnVisible(column.accessor)}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-3 h-3"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-3 h-3"
									>
										<path
											d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
										/>
									</svg>
								{/if}
							</span>
							{column.accessor}
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Pagination Options Panel -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h3 class="text-lg font-semibold mb-3 text-gray-700">Pagination</h3>
			<div class="flex items-center gap-3 mb-3">
				<span class="text-sm font-medium text-gray-700">Rows per page:</span>
				<div class="inline-flex rounded-md shadow-sm" role="group">
					{#each pageSizeOptions as size}
						<button
							class="px-3 py-1.5 text-xs font-medium
                    {table.pagination.pageSize === size
								? 'bg-emerald-600 text-white border-emerald-600 z-10'
								: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                    {pageSizeOptions.indexOf(size) === 0 ? 'rounded-l-md' : ''}
                    {pageSizeOptions.indexOf(size) === pageSizeOptions.length - 1
								? 'rounded-r-md'
								: ''}
                    border focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
							on:click={() => setPageSize(size)}
						>
							{size}
						</button>
					{/each}
				</div>
			</div>
			<div class="text-sm text-gray-600">
				Page <span class="font-medium">{table.pagination.page + 1}</span> of
				<span class="font-medium">{table.pagination.pageCount}</span>
			</div>
		</div>

		<!-- Sorting Panel -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h3 class="text-lg font-semibold mb-3 text-gray-700">Sorting</h3>
			<div class="h-[150px] relative flex flex-col">
				{#if table.sorting.columnSortings.length > 0}
					<div class="flex flex-col h-full">
						<h4 class="text-sm font-medium mb-2 text-gray-700">Active Sorting:</h4>
						<div class="overflow-y-auto flex-grow mb-2 pr-1 custom-scrollbar">
							<div class="space-y-2">
								{#each table.sorting.columnSortings as sorting, i}
									<div
										class="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
									>
										<div class="flex items-center gap-2">
											<span class="text-xs font-medium">{i + 1}</span>
											<span class="text-sm">{sorting.key}</span>
										</div>
										<span
											class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
											{sorting.direction === 'asc' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}"
										>
											{sorting.direction === 'asc' ? 'Ascending' : 'Descending'}
										</span>
									</div>
								{/each}
							</div>
						</div>
						<div class="mt-auto">
							<button
								class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-xs"
								on:click={clearSorting}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-3 w-3 mr-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
										clip-rule="evenodd"
									/>
								</svg>
								Clear All
							</button>
						</div>
					</div>
				{:else}
					<div class="h-full flex flex-col">
						<p class="text-sm text-gray-500 mb-2">
							No active sorting. Click on column headers to sort the table.
						</p>
						<div class="flex-1 flex items-center justify-center opacity-30">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
								/>
							</svg>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Table Component -->
	<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="bg-gray-50 border-b border-gray-200">
						{#each table.allColumns as column}
							{#if table.columnVisibility.isColumnVisible(column.accessor)}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
									on:click={() => handleSort(column.accessor)}
								>
									<div class="flex items-center gap-2">
										<span>{column.header}</span>
										{#if getSortDirection(column.accessor) !== 'none'}
											<span class="text-emerald-600">
												{#if getSortDirection(column.accessor) === 'asc'}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-4 w-4"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fill-rule="evenodd"
															d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
															clip-rule="evenodd"
														/>
													</svg>
												{:else}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-4 w-4"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fill-rule="evenodd"
															d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
															clip-rule="evenodd"
														/>
													</svg>
												{/if}
											</span>
										{/if}
									</div>
								</th>
							{/if}
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each table.rows as row}
						<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
							{#each row.cells as cell}
								{#if table.columnVisibility.isColumnVisible(cell.key)}
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										{cell.value}
									</td>
								{/if}
							{/each}
						</tr>
					{/each}
					{#if table.rows.length === 0}
						<tr>
							<td
								colspan={table.headers.length}
								class="px-6 py-8 text-center text-sm text-gray-500"
							>
								No data available
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination Controls -->
		<div
			class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4"
		>
			<div class="text-sm text-gray-600">
				Showing <span class="font-medium">{table.rows.length}</span> of
				<span class="font-medium">{table.allRows.length}</span> items
			</div>

			<div class="inline-flex rounded-md shadow-sm" role="group">
				<button
					class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border
            {table.pagination.page === 0
						? 'bg-gray-50 text-gray-400 cursor-not-allowed'
						: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}
            focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
					on:click={table.pagination.firstPage}
					disabled={table.pagination.page === 0}
					aria-label="First page"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<button
					class="relative inline-flex items-center px-3 py-2 text-sm font-medium border-t border-b
            {table.pagination.page === 0
						? 'bg-gray-50 text-gray-400 cursor-not-allowed'
						: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}
            focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
					on:click={table.pagination.previousPage}
					disabled={table.pagination.page === 0}
					aria-label="Previous page"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<button
					class="relative inline-flex items-center px-3 py-2 text-sm font-medium border-t border-b
            {table.pagination.page === table.pagination.pageCount - 1
						? 'bg-gray-50 text-gray-400 cursor-not-allowed'
						: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}
            focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
					on:click={table.pagination.nextPage}
					disabled={table.pagination.page === table.pagination.pageCount - 1}
					aria-label="Next page"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<button
					class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border
            {table.pagination.page === table.pagination.pageCount - 1
						? 'bg-gray-50 text-gray-400 cursor-not-allowed'
						: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}
            focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
					on:click={table.pagination.lastPage}
					disabled={table.pagination.page === table.pagination.pageCount - 1}
					aria-label="Last page"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Feature Description -->
	<div class="mt-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6">
		<h3 class="text-xl font-semibold mb-4 text-gray-700">Features Included</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div>
				<h4 class="text-lg font-medium mb-2 text-gray-700">Column Visibility</h4>
				<ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
					<li>Toggle individual columns</li>
					<li>Visual indicators for visible/hidden state</li>
					<li>Dynamically adjusts table layout</li>
				</ul>
			</div>
			<div>
				<h4 class="text-lg font-medium mb-2 text-gray-700">Pagination</h4>
				<ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
					<li>Configurable page size</li>
					<li>First/previous/next/last navigation</li>
					<li>Page count and current position</li>
					<li>Row count indicators</li>
				</ul>
			</div>
			<div>
				<h4 class="text-lg font-medium mb-2 text-gray-700">Sorting</h4>
				<ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
					<li>Click column headers to sort</li>
					<li>Ascending/descending toggle</li>
					<li>Multi-column sorting support</li>
					<li>Clear sorting option</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
