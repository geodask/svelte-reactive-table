<script lang="ts">
	import { reactivePagination, reactiveTable } from '$lib/index.js';
	import { initialData } from './data.js';

	// Basic table example
	const basicTable = reactiveTable(
		initialData,
		[
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		],
		reactivePagination({ page: 0, pageSize: 3 })
	);

	function addNewRow() {
		basicTable.data.push({
			name: 'New Hero',
			age: Math.floor(Math.random() * 100),
			city: 'New City',
			id: Math.floor(Math.random() * 1000)
		});
	}
</script>

<section class="max-w-5xl mx-auto my-8 px-4">
	<h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Data Table</h2>

	<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="bg-gray-50 border-b border-gray-200">
						{#each basicTable.headers as header}
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>{header}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each basicTable.allRows as row, i}
						<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
							{#each row.cells as cell}
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell.value}</td>
							{/each}
						</tr>
					{/each}
					{#if basicTable.allRows.length === 0}
						<tr>
							<td
								colspan={basicTable.headers.length}
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

	<div class="mt-6 flex justify-end">
		<button
			class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
			onclick={() => addNewRow()}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
					clip-rule="evenodd"
				/>
			</svg>
			Add New Row
		</button>
	</div>
</section>
