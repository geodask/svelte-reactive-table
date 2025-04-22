<script lang="ts">
	import { reactivePagination, reactiveTable } from '$lib/index.js';
	import { initialData } from './data.js';

	// Pagination example
	const table = reactiveTable(
		initialData,
		[
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		],
		reactivePagination({ page: 0, pageSize: 3 })
	);

	// Page size options
	const pageSizeOptions = [3, 5, 10];

	function setPageSize(size: number) {
		table.pagination.setPageSize(size);
	}
</script>

<section class="max-w-5xl mx-auto my-8 px-4">
	<h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Data Table with Pagination</h2>

	<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
		<div
			class="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4"
		>
			<div class="flex items-center gap-3">
				<span class="text-sm font-medium text-gray-700">Rows per page:</span>
				<div class="inline-flex rounded-md shadow-sm" role="group">
					{#each pageSizeOptions as size}
						<button
							class="px-3 py-1.5 text-sm font-medium
                {table.pagination.pageSize === size
								? 'bg-emerald-600 text-white border-emerald-600 z-10'
								: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                {pageSizeOptions.indexOf(size) === 0 ? 'rounded-l-md' : ''}
                {pageSizeOptions.indexOf(size) === pageSizeOptions.length - 1 ? 'rounded-r-md' : ''}
                border focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors"
							on:click={() => setPageSize(size)}
						>
							{size}
						</button>
					{/each}
				</div>
			</div>

			<div class="text-sm text-gray-600">
				Showing <span class="font-medium">{table.pagination.rows.length}</span> of
				<span class="font-medium">{table.allRows.length}</span> items
			</div>
		</div>

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
					{#each table.pagination.rows as row, i}
						<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
							{#each row.cells as cell}
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.value}</td>
							{/each}
						</tr>
					{/each}
					{#if table.pagination.rows.length === 0}
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
				Page <span class="font-medium">{table.pagination.page + 1}</span> of
				<span class="font-medium">{table.pagination.pageCount}</span>
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
</section>
