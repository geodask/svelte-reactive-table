<script lang="ts">
	import { filterHelpers, reactiveFiltering, reactiveTable } from '$lib/index.js';
	import { initialData, type Person } from './data.js';

	// Create table with the simple filtering plugin
	const table = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' },
		{ accessor: 'status', header: 'Status' }
	]).use(reactiveFiltering<Person>());

	const { filtering } = table.plugins;

	// Simple reactive form state
	let nameSearch = $state('');
	let selectedCities = $state<string[]>([]);
	let selectedStatuses = $state<Person['status'][]>([]);
	let minAge = $state<number | undefined>();
	let maxAge = $state<number | undefined>();

	const cities = [...new Set(initialData.map((p) => p.city))];
	const statuses: Person['status'][] = ['active', 'inactive', 'pending'];

	$effect(() => {
		filtering.setFilter('name', nameSearch.trim());
	});

	$effect(() => {
		filtering.setFilter('age', filterHelpers.range(minAge, maxAge));
	});

	$effect(() => {
		filtering.setFilter('status', selectedStatuses);
	});

	$effect(() => {
		filtering.setFilter('city', selectedCities);
	});

	// Get status badge classes
	function getStatusBadgeClass(status: string | number | undefined): string {
		switch (status as Person['status']) {
			case 'active':
				return 'bg-emerald-100 text-emerald-800';
			case 'inactive':
				return 'bg-red-100 text-red-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<section class="max-w-7xl mx-auto my-8 px-4">
	<h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
		Data Table with Simple Filtering API
	</h2>

	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
		<!-- Filter Panel -->
		<div class="lg:col-span-1">
			<div class="bg-white rounded-lg shadow-md border border-gray-200 p-4 sticky top-4">
				<h3 class="text-lg font-semibold mb-4 text-gray-800">Filters</h3>

				<!-- Filter Status -->
				<div class="mb-4 p-3 bg-gray-50 rounded-md">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Active Filters:</span>
						<span class="text-sm font-medium text-emerald-600">
							{filtering.count}
						</span>
					</div>
					{#if filtering.hasActiveFilters}
						<button
							onclick={() => {
								filtering.clearFilters();
								nameSearch = '';
								selectedCities = [];
								selectedStatuses = [];
								minAge = undefined;
								maxAge = undefined;
							}}
							class="mt-2 w-full px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
						>
							Clear All Filters
						</button>
					{/if}
				</div>

				<!-- Name Filter -->
				<div class="mb-4">
					<label for="name-search" class="block text-sm font-medium text-gray-700 mb-2">
						Name Contains
					</label>
					<input
						id="name-search"
						type="text"
						bind:value={nameSearch}
						placeholder="Search names..."
						class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
					/>
				</div>

				<!-- Age Range Filter -->
				<div class="mb-4">
					<fieldset>
						<legend class="block text-sm font-medium text-gray-700 mb-2">Age Range</legend>
						<div class="flex gap-2">
							<input
								type="number"
								bind:value={minAge}
								placeholder="Min"
								class="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							/>
							<span class="text-gray-500 self-center">to</span>
							<input
								type="number"
								bind:value={maxAge}
								placeholder="Max"
								class="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							/>
						</div>
					</fieldset>
				</div>

				<!-- City Filter -->
				<div class="mb-4">
					<fieldset>
						<legend class="block text-sm font-medium text-gray-700 mb-2">Cities</legend>
						<div class="space-y-1 max-h-32 overflow-y-auto">
							{#each cities as city}
								<label class="flex items-center">
									<input
										type="checkbox"
										value={city}
										bind:group={selectedCities}
										class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
									/>
									<span class="ml-2 text-sm text-gray-700">{city}</span>
								</label>
							{/each}
						</div>
					</fieldset>
				</div>

				<!-- Status Filter -->
				<div class="mb-4">
					<fieldset>
						<legend class="block text-sm font-medium text-gray-700 mb-2">Status</legend>
						<div class="space-y-1">
							{#each statuses as status}
								<label class="flex items-center">
									<input
										type="checkbox"
										value={status}
										bind:group={selectedStatuses}
										class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
									/>
									<span class="ml-2 text-sm capitalize text-gray-700">{status}</span>
								</label>
							{/each}
						</div>
					</fieldset>
				</div>
			</div>
		</div>

		<!-- Data Table -->
		<div class="lg:col-span-3">
			<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
				<!-- Results Summary -->
				<div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
					<div class="text-sm text-gray-600">
						Showing <span class="font-medium">{table.rows.length}</span> of
						<span class="font-medium">{table.allRows.length}</span> results
						{#if filtering.hasActiveFilters}
							<span class="text-emerald-600">(filtered)</span>
						{/if}
					</div>
					{#if filtering.hasActiveFilters}
						<div class="text-xs text-gray-500">
							{filtering.count} filter{filtering.count === 1 ? '' : 's'}
							active
						</div>
					{/if}
				</div>

				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="bg-gray-50 border-b border-gray-200">
								{#each table.headers as header}
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										{header}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each table.rows as row}
								<tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
									{#each row.cells as cell}
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
											{#if cell.key === 'status'}
												<span
													class="inline-flex px-2 py-1 text-xs font-medium rounded-full {getStatusBadgeClass(
														cell.value
													)}"
												>
													{cell.value || 'N/A'}
												</span>
											{:else}
												{cell.value || 'N/A'}
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
							{#if table.rows.length === 0}
								<tr>
									<td
										colspan={table.headers.length}
										class="px-6 py-8 text-center text-sm text-gray-500"
									>
										{#if filtering.hasActiveFilters}
											No results match your current filters. Try adjusting your search criteria.
										{:else}
											No data available
										{/if}
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>
