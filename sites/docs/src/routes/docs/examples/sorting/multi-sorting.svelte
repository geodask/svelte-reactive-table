<script lang="ts">
	import { Button } from '$shared/ui/shadcn/button';
	import * as Table from '$shared/ui/shadcn/table';
	import { ArrowDown, ArrowUp, ArrowUpDown, RotateCcw } from '@lucide/svelte';
	import { reactiveSorting, reactiveTable, type ColumnSorting } from 'svelte-reactive-table';
	import { initialData } from '../data';

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

	const { sorting } = multiSortTable.plugins;

	function clearMultiSorting() {
		sorting.clearSort();
	}
	// Helper function to determine the current sort direction for a column
	function getSortDirection(accessor: string) {
		const columnSorting = sorting.columnSortings.find((s: ColumnSorting) => s.key === accessor);
		return columnSorting ? columnSorting.direction : 'none';
	}
</script>

<div class="not-prose">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
		<p class="text-sm text-muted-foreground">
			Click on column headers to sort. Multiple columns can be sorted simultaneously.
		</p>
		<Button variant="outline" size="sm" onclick={clearMultiSorting} class="shadow-sm">
			<RotateCcw class="mr-2 h-4 w-4" />
			Clear All Sorting
		</Button>
	</div>

	<div class="rounded-md border shadow-sm overflow-hidden">
		<Table.Root>
			<Table.Header class="bg-muted/50">
				<Table.Row>
					{#each multiSortTable.allColumns as column}
						<Table.Head class="py-2">
							<Button
								onclick={() => {
									const { sorting } = multiSortTable.plugins;
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
										<ArrowUpDown class="h-4 w-4" />
									{/if}
								</span>
							</Button>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each multiSortTable.rows as row}
					<Table.Row class="hover:bg-muted/20 transition-colors">
						{#each row.cells as cell}
							<Table.Cell class="p-4">{cell.value}</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
				{#if multiSortTable.rows.length === 0}
					<Table.Row>
						<Table.Cell class="h-24 text-center p-4" colspan={multiSortTable.headers.length}>
							<div class="flex flex-col items-center justify-center text-muted-foreground">
								<span>No data available</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
