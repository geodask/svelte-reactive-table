<script lang="ts">
	import { Button } from '$shared/ui/shadcn/button';
	import * as Table from '$shared/ui/shadcn/table';
	import { ArrowDown, ArrowUp, ArrowUpDown, RotateCcw } from '@lucide/svelte';
	import { reactiveSorting, reactiveTable, type ColumnSorting } from 'svelte-reactive-table';
	import { initialData } from '../data';

	// Sorting example with multiSort disabled
	const singleSortTable = reactiveTable(
		initialData,
		[
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		],
		{
			sorting: reactiveSorting({
				// Optional: Set initial sorting
				columnSortings: [{ key: 'age', direction: 'desc' }],
				// Disable multi-column sorting
				multiSort: false
			})
		}
	);

	function clearSingleSorting() {
		singleSortTable.sorting.clearSort();
	}

	// Helper function to determine the current sort direction for a column
	function getSortDirection(table: any, accessor: string) {
		const sorting = table.sorting.columnSortings.find((s: ColumnSorting) => s.key === accessor);
		return sorting ? sorting.direction : 'none';
	}
</script>

<div class="not-prose">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
		<p class="text-sm text-muted-foreground">
			Click on column headers to sort. Only one column can be sorted at a time.
		</p>
		<Button variant="outline" size="sm" onclick={clearSingleSorting} class="shadow-sm">
			<RotateCcw class="mr-2 h-4 w-4" />
			Clear Sorting
		</Button>
	</div>

	<div class="rounded-md border shadow-sm overflow-hidden">
		<Table.Root>
			<Table.Header class="bg-muted/50 ">
				<Table.Row>
					{#each singleSortTable.allColumns as column}
						<Table.Head class="p-2">
							<Button
								onclick={() => singleSortTable.sorting.toggleSort(column.accessor)}
								size="sm"
								variant="ghost"
							>
								<span class="font-medium">{column.header}</span>
								<span class="text-muted-foreground/70">
									{#if getSortDirection(singleSortTable, column.accessor) === 'asc'}
										<ArrowUp class="h-4 text-primary" />
									{:else if getSortDirection(singleSortTable, column.accessor) === 'desc'}
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
				{#each singleSortTable.rows as row}
					<Table.Row class="hover:bg-muted/20 transition-colors">
						{#each row.cells as cell}
							<Table.Cell class="p-4">{cell.value}</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
				{#if singleSortTable.rows.length === 0}
					<Table.Row>
						<Table.Cell class="h-24 text-center p-4" colspan={singleSortTable.headers.length}>
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
