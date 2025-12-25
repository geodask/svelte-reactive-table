<script lang="ts">
	import { Button } from '$shared/ui/shadcn/button';
	import * as DropdownMenu from '$shared/ui/shadcn/dropdown-menu';
	import * as Select from '$shared/ui/shadcn/select';
	import * as Table from '$shared/ui/shadcn/table';
	import {
		ArrowDown,
		ArrowUp,
		ArrowUpDown,
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight,
		Search,
		SlidersHorizontal
	} from '@lucide/svelte';
	import {
		reactiveColumnVisibility,
		reactiveFiltering,
		reactivePagination,
		reactiveSorting,
		reactiveTable
	} from 'svelte-reactive-table';
	import { initialData, type Person } from '../data';

	// Create a fully featured table with all available features enabled
	const table = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	])
		// Add column visibility plugin
		.use(
			reactiveColumnVisibility({
				hiddenColumns: [] // No hidden columns by default
			})
		)
		// Add filtering plugin
		.use(reactiveFiltering())
		.use(
			reactivePagination({
				pageSize: 5, // Default page size
				page: 0 // Start at first page
			})
		)
		.use(
			reactiveSorting({
				// Initial sorting by name ascending
				columnSortings: [{ key: 'name', direction: 'asc' }],
				// Enable multi-column sorting
				multiSort: true
			})
		);

	// Access the filtering API
	const { filtering } = table.plugins;

	// Reactive state for name search
	let nameSearch = $state('');

	// Page size options
	const pageSizeOptions = [3, 5, 10];

	// Column visibility toggle
	function toggleColumn(accessor: keyof Person) {
		const { columnVisibility } = table.plugins;
		columnVisibility.toggleVisibility(accessor);
	}

	// Set page size
	function setPageSize(size: number) {
		const { pagination } = table.plugins;
		pagination.setPageSize(size);
	}

	function clearSorting() {
		const { sorting } = table.plugins;
		sorting.clearSort();
	}

	// Helper function to determine the current sort direction for a column
	function getSortDirection(accessor: keyof Person) {
		const { sorting } = table.plugins;
		return sorting.getSortDirection(accessor);
	}

	// Sync name search with filtering
	$effect(() => {
		filtering.setFilter('name', nameSearch.trim());
	});
</script>

<!-- Table Component with Integrated Controls -->
<div class="rounded-md border shadow-sm overflow-hidden not-prose">
	<!-- Table Header Controls -->
	<div class="px-4 py-4 bg-muted/30 border-b flex flex-wrap justify-between items-center gap-3">
		<div class="flex items-center gap-2">
			<h2 class="text-sm font-medium">Svelte Reactive Table</h2>
			{#if filtering.hasActiveFilters}
				<span class="text-xs text-muted-foreground">
					({table.rows.length} of {table.allRows.length} shown)
				</span>
			{/if}
		</div>

		<div class="flex items-center gap-2">
			<!-- Search Input -->
			<div class="relative">
				<Search class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					bind:value={nameSearch}
					placeholder="Search names..."
					class="h-8 w-[200px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				/>
			</div>

			<!-- Column Visibility Dropdown -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm">
							<SlidersHorizontal class="h-4 w-4" />
							View
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-40">
					{#each table.allColumns as column}
						<DropdownMenu.CheckboxItem
							checked={table.plugins.columnVisibility.isVisible(column.accessor)}
							onCheckedChange={() => toggleColumn(column.accessor)}
						>
							{column.header}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<Table.Root>
		<Table.Header class="bg-muted/50">
			<Table.Row>
				{#each table.columns as column}
					<Table.Head class="p-2">
						<Button
							onclick={() => {
								const { sorting } = table.plugins;
								sorting.toggleSort(column.accessor);
							}}
							size="sm"
							variant="ghost"
						>
							<span class="font-medium">{column.header}</span>
							<span class="text-muted-foreground/70">
								{#if getSortDirection(column.accessor) === 'asc'}
									<ArrowUp class="h-4 text-primary" />
								{:else if getSortDirection(column.accessor) === 'desc'}
									<ArrowDown class="h-4 text-primary" />
								{:else}
									<ArrowUpDown />
								{/if}
							</span>
						</Button>
					</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each table.rows as row}
				<Table.Row class="hover:bg-muted/20 transition-colors">
					{#each row.cells as cell}
						<Table.Cell class="p-4">
							{cell.value}
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
			{#if table.rows.length === 0}
				<Table.Row>
					<Table.Cell class="h-24 text-center p-4" colspan={table.headers.length}>
						<div class="flex flex-col items-center justify-center text-muted-foreground">
							<span>No data available</span>
						</div>
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>

	<!-- Pagination Controls with Page Size Selector -->
	<div class="px-4 py-3 border-t bg-muted/20 flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-4">
			<div class="flex items-center gap-2">
				<span class="text-xs text-muted-foreground whitespace-nowrap">Rows per page:</span>
				<Select.Root
					type="single"
					name="pageSize"
					onValueChange={(value) => {
						const { pagination } = table.plugins;
						pagination.setPageSize(parseInt(value));
					}}
					value={table.plugins.pagination.pageSize.toString()}
				>
					<Select.Trigger class="text-xs h-7 p-2">
						{table.plugins.pagination.pageSize}
					</Select.Trigger>
					<Select.Content side="bottom" align="end">
						{#each pageSizeOptions as pageSize (pageSize)}
							<Select.Item value={pageSize.toString()} label={pageSize.toString()} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="text-xs text-muted-foreground">
				<span>Showing</span>
				<span class="font-medium">{table.rows.length}</span>
				<span>of</span>
				<span class="font-medium">{table.allRows.length}</span>
				<span>results</span>
			</div>
		</div>

		<div class="flex items-center gap-1">
			<div class="text-xs text-muted-foreground mr-1">
				<span>Page</span>
				<span class="font-medium">{table.plugins.pagination.page + 1}</span>
				<span>of</span>
				<span class="font-medium">{table.plugins.pagination.pageCount}</span>
			</div>

			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					const { pagination } = table.plugins;
					pagination.goToFirstPage();
				}}
				disabled={table.plugins.pagination.isFirstPage}
				aria-label="First page"
				class="h-7 w-7 p-0"
			>
				<ChevronsLeft class="h-3.5 w-3.5" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					const { pagination } = table.plugins;
					pagination.goToPreviousPage();
				}}
				disabled={!table.plugins.pagination.hasPreviousPage}
				aria-label="Previous page"
				class="h-7 w-7 p-0"
			>
				<ChevronLeft class="h-3.5 w-3.5" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					const { pagination } = table.plugins;
					pagination.goToNextPage();
				}}
				disabled={!table.plugins.pagination.hasNextPage}
				aria-label="Next page"
				class="h-7 w-7 p-0"
			>
				<ChevronRight class="h-3.5 w-3.5" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					const { pagination } = table.plugins;
					pagination.goToLastPage();
				}}
				disabled={table.plugins.pagination.isLastPage}
				aria-label="Last page"
				class="h-7 w-7 p-0"
			>
				<ChevronsRight class="h-3.5 w-3.5" />
			</Button>
		</div>
	</div>
</div>
