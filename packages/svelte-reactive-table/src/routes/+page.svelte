<script lang="ts">
	import BasicTable from './components/BasicTable.svelte';
	import ColumnVisibility from './components/ColumnVisibility.svelte';
	import Pagination from './components/Pagination.svelte';
	import { onMount } from 'svelte';
	import Sorting from './components/Sorting.svelte';
	import FullFeaturedTable from './components/FullFeaturedTable.svelte';
	import Filtering from './components/Filtering.svelte';

	let activeTab = 'basic';

	onMount(() => {
		// Check if there's a hash in the URL to set the active tab
		if (window.location.hash) {
			const hash = window.location.hash.substring(1);
			if (['basic', 'columns', 'pagination', 'sorting', 'filtering', 'full'].includes(hash)) {
				activeTab = hash;
			}
		}
	});

	const setActiveTab = (tab: string) => {
		activeTab = tab;
		window.location.hash = tab;
	};
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="container mx-auto px-4">
		<div class="max-w-6xl mx-auto">
			<!-- Header -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<h1 class="text-2xl font-bold text-gray-800">Svelte Table Examples</h1>

					<div class="flex bg-gray-100 p-1 rounded-lg">
						<button
							class="px-4 py-2 text-sm font-medium rounded-md transition-colors
                {activeTab === 'basic'
								? 'bg-white text-emerald-700 shadow-sm'
								: 'text-gray-700 hover:text-gray-900'}"
							onclick={() => setActiveTab('basic')}
						>
							Basic
						</button>

						<button
							class="px-4 py-2 text-sm font-medium rounded-md transition-colors
                {activeTab === 'columns'
								? 'bg-white text-emerald-700 shadow-sm'
								: 'text-gray-700 hover:text-gray-900'}"
							onclick={() => setActiveTab('columns')}
						>
							Columns
						</button>

						<button
							class="px-4 py-2 text-sm font-medium rounded-md transition-colors
                {activeTab === 'pagination'
								? 'bg-white text-emerald-700 shadow-sm'
								: 'text-gray-700 hover:text-gray-900'}"
							onclick={() => setActiveTab('pagination')}
						>
							Pagination
						</button>

						<button
							class="px-4 py-2 text-sm font-medium rounded-md transition-colors
							{activeTab === 'sorting'
								? 'bg-white text-emerald-700 shadow-sm'
								: 'text-gray-700 hover:text-gray-900'}"
							onclick={() => setActiveTab('sorting')}
						>
							Sorting
						</button>

						<button
							class="px-4 py-2 text-sm font-medium rounded-md transition-colors
							{activeTab === 'filtering'
								? 'bg-white text-emerald-700 shadow-sm'
								: 'text-gray-700 hover:text-gray-900'}"
							onclick={() => setActiveTab('filtering')}
						>
							Filtering
						</button>
						<button
							class="px-4 py-2 text-sm font-medium rounded-md transition-colors
							{activeTab === 'full'
								? 'bg-white text-emerald-700 shadow-sm'
								: 'text-gray-700 hover:text-gray-900'}"
							onclick={() => setActiveTab('full')}
						>
							Full Example
						</button>
					</div>
				</div>
			</div>

			<!-- Table Components -->
			<div class="space-y-8">
				{#if activeTab === 'basic'}
					<div id="basic">
						<BasicTable />
					</div>
				{:else if activeTab === 'columns'}
					<div id="columns">
						<ColumnVisibility />
					</div>
				{:else if activeTab === 'pagination'}
					<div id="pagination">
						<Pagination />
					</div>
				{:else if activeTab === 'sorting'}
					<div id="sorting">
						<Sorting />
					</div>
				{:else if activeTab === 'filtering'}
					<div id="plugin">
						<Filtering />
					</div>
				{:else if activeTab === 'full'}
					<div id="full">
						<FullFeaturedTable />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
