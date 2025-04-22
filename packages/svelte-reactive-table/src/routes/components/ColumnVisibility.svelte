<script lang="ts">
	import { reactivePagination, reactiveTable } from '$lib/index.js';
	import { initialData, type Person } from './data.js';

	// Toggle column visibility example
	const visibilityTable = reactiveTable(
		initialData,
		[
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		],
		reactivePagination({ page: 0, pageSize: 3 })
	);

	function toggleColumn(accessor: keyof Person) {
		visibilityTable.toggleColumnVisibility(accessor);
	}
</script>

<section class="max-w-5xl mx-auto my-8 px-4">
	<h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Column Visibility</h2>

	<div class="mb-6">
		<p class="text-sm text-gray-600 mb-3">Select which columns to display in the table:</p>
		<div class="flex flex-wrap gap-2">
			{#each visibilityTable.columns as column}
				<button
					class="px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
            {column.visible
						? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
						: 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}"
					onclick={() => toggleColumn(column.accessor)}
				>
					<div class="flex items-center gap-2">
						<span class="w-4 h-4 flex items-center justify-center">
							{#if column.visible}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-4 h-4"
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
									class="w-4 h-4"
								>
									<path
										d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
									/>
								</svg>
							{/if}
						</span>
						{column.accessor.charAt(0).toUpperCase() + column.accessor.slice(1)}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="bg-gray-50 border-b border-gray-200">
						{#each visibilityTable.headers as header}
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>{header}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each visibilityTable.allRows as row}
						<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
							{#each row.cells as cell}
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.value}</td>
							{/each}
						</tr>
					{/each}
					{#if visibilityTable.allRows.length === 0}
						<tr>
							<td
								colspan={visibilityTable.headers.length}
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
</section>
