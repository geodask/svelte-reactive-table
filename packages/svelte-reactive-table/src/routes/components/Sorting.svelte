<script lang="ts">
	import { reactiveSorting, reactiveTable, type ColumnSorting } from '$lib/index.js';
	import { initialData } from './data.js';

	// Sorting example with multiSort enabled
	const multiSortTable = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	]).use(
		reactiveSorting({
			// Optional: Set initial sorting
			columnSortings: [{ key: 'name', direction: 'asc' }],
			// Enable multi-column sorting
			multiSort: true
		})
	);

	// Sorting example with multiSort disabled
	const singleSortTable = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	]).use(
		reactiveSorting({
			// Optional: Set initial sorting
			columnSortings: [{ key: 'age', direction: 'desc' }],
			// Disable multi-column sorting
			multiSort: false, 
		})
	);

	function handleMultiSort(accessor: keyof (typeof multiSortTable.data)[0]) {
		multiSortTable.plugins.sorting.toggleSort(accessor);
	}

	function handleSingleSort(accessor: keyof (typeof singleSortTable.data)[0]) {
		singleSortTable.plugins.sorting.toggleSort(accessor);
	}

	function clearMultiSorting() {
		multiSortTable.plugins.sorting.clearSort();
	}

	function clearSingleSorting() {
		singleSortTable.plugins.sorting.clearSort();
	}
</script>

<section class="mx-auto my-8 px-4">
	<h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Sortable Data Tables</h2>

	<!-- Multi-Sort Table Example -->
	<div class="mb-10">
		<h3 class="text-xl font-semibold mb-4 text-gray-700">Multi-Column Sorting</h3>

		<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<p class="text-sm text-gray-600">
				Click on column headers to sort. Multiple columns can be sorted simultaneously.
			</p>
			<button
				class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
				onclick={clearMultiSorting}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 mr-2"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
						clip-rule="evenodd"
					/>
				</svg>
				Clear All Sorting
			</button>
		</div>

		<!-- Active Sorting Card - Moved to top -->
		<div class="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h4 class="text-md font-semibold mb-2 text-gray-700">Active Sorting</h4>
			<div class="h-[100px] relative flex flex-col">
				{#if multiSortTable.plugins.sorting.columnSortings.length > 0}
					<div class="overflow-y-auto custom-scrollbar pr-1">
						<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							{#each multiSortTable.plugins.sorting.columnSortings as sorting, i}
								<div class="bg-gray-50 p-3 rounded-md border border-gray-200">
									<div class="flex justify-between items-center">
										<div class="flex items-center gap-2">
											<span
												class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium"
											>
												{i + 1}
											</span>
											<span class="font-medium text-gray-700 text-sm">
												{sorting.key.charAt(0).toUpperCase() + sorting.key.slice(1)}
											</span>
										</div>
										<span
											class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
											{sorting.direction === 'asc' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}"
										>
											{sorting.direction === 'asc' ? 'Ascending' : 'Descending'}
										</span>
									</div>
								</div>
							{/each}
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
								class="h-10 w-10 text-gray-400"
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

		<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="bg-gray-50 border-b border-gray-200">
							{#each multiSortTable.allColumns as column}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
									onclick={() => handleMultiSort(column.accessor)}
								>
									<div class="flex items-center gap-2">
										<span>{column.header}</span>
										{#if multiSortTable.plugins.sorting.getSortDirection(column.accessor) !== 'none'}
											<span class="text-emerald-600">
												{#if multiSortTable.plugins.sorting.getSortDirection(column.accessor) === 'asc'}
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
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each multiSortTable.rows as row}
							<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
								{#each row.cells as cell}
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.value}</td>
								{/each}
							</tr>
						{/each}
						{#if multiSortTable.rows.length === 0}
							<tr>
								<td
									colspan={multiSortTable.headers.length}
									class="px-6 py-8 text-center text-sm text-gray-500"
								>
									No data available
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Single-Sort Table Example -->
	<div class="mt-12 pt-8 border-t border-gray-200">
		<h3 class="text-xl font-semibold mb-4 text-gray-700">Single-Column Sorting</h3>

		<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<p class="text-sm text-gray-600">
				Click on column headers to sort. Only one column can be sorted at a time.
			</p>
			<button
				class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
				onclick={clearSingleSorting}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 mr-2"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
						clip-rule="evenodd"
					/>
				</svg>
				Clear Sorting
			</button>
		</div>

		<!-- Active Sorting Card - Moved to top -->
		<div class="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
			<h4 class="text-md font-semibold mb-2 text-gray-700">Active Sorting</h4>
			<div class="h-[80px] relative flex flex-col">
				{#if singleSortTable.plugins.sorting.columnSortings.length > 0}
					<div class="bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm max-w-md">
						{#each singleSortTable.plugins.sorting.columnSortings as sorting}
							<div class="flex justify-between items-center">
								<span class="font-medium text-gray-700">
									{sorting.key.charAt(0).toUpperCase() + sorting.key.slice(1)}
								</span>
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
									{sorting.direction === 'asc' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}"
								>
									{sorting.direction === 'asc' ? 'Ascending' : 'Descending'}
								</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="h-full flex flex-col">
						<p class="text-sm text-gray-500 mb-2">
							No active sorting. Click on column headers to sort the table.
						</p>
						<div class="flex-1 flex items-center justify-center opacity-30">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-gray-400"
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

		<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="bg-gray-50 border-b border-gray-200">
							{#each singleSortTable.allColumns as column}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
									onclick={() => handleSingleSort(column.accessor)}
								>
									<div class="flex items-center gap-2">
										<span>{column.header}</span>
										{#if singleSortTable.plugins.sorting.getSortDirection(column.accessor) !== 'none'}
											<span class="text-emerald-600">
												{#if singleSortTable.plugins.sorting.getSortDirection(column.accessor) === 'asc'}
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
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each singleSortTable.rows as row}
							<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
								{#each row.cells as cell}
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.value}</td>
								{/each}
							</tr>
						{/each}
						{#if singleSortTable.rows.length === 0}
							<tr>
								<td
									colspan={singleSortTable.headers.length}
									class="px-6 py-8 text-center text-sm text-gray-500"
								>
									No data available
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
			<h5 class="text-sm font-medium text-amber-800 mb-2">Behavior Note</h5>
			<p class="text-sm text-amber-700">
				When <code class="px-1 py-0.5 bg-amber-100 rounded">multiSort: false</code>, clicking on a
				column will:
			</p>
			<ul class="list-disc ml-6 mt-2 text-sm text-amber-700 space-y-1">
				<li>Clear any existing sort when sorting a new column</li>
				<li>Cycle through: ascending → descending → no sorting</li>
			</ul>
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
