<script lang="ts">
	import * as Table from '$shared/ui/shadcn/table';
	import * as Select from '$shared/ui/shadcn/select';
	import { Button } from '$shared/ui/shadcn/button';
	import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from '@lucide/svelte';
	import { reactivePagination, reactiveTable } from 'svelte-reactive-table';
	import { initialData } from '../data';

	// Pagination example
	const table = reactiveTable(
		initialData,
		[
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		],
		{
			pagination: reactivePagination({
				pageSize: 3,
				page: 0
			})
		}
	);

	// Page size options
	const pageSizeOptions = [3, 5, 10];

	function setPageSize(size: number) {
		table.pagination.setPageSize(size);
	}
</script>

<div class="not-prose">
	<div class="rounded-md border shadow-sm overflow-hidden">
		<Table.Root>
			<Table.Header class="bg-muted/50">
				<Table.Row>
					{#each table.headers as header}
						<Table.Head class="font-medium p-4">
							{header}
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each table.rows as row}
					<Table.Row class="hover:bg-muted/20 transition-colors">
						{#each row.cells as cell}
							<Table.Cell class="p-4">{cell.value}</Table.Cell>
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
							table.pagination.setPageSize(parseInt(value));
						}}
						value={table.pagination.pageSize.toString()}
					>
						<Select.Trigger class="text-xs h-7 p-2">
							{table.pagination.pageSize}
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
					<span class="font-medium">{table.pagination.page + 1}</span>
					<span>of</span>
					<span class="font-medium">{table.pagination.pageCount}</span>
				</div>

				<Button
					variant="outline"
					size="sm"
					onclick={table.pagination.firstPage}
					disabled={table.pagination.page === 0}
					aria-label="First page"
					class="h-7 w-7 p-0"
				>
					<ChevronsLeft class="h-3.5 w-3.5" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={table.pagination.previousPage}
					disabled={table.pagination.page === 0}
					aria-label="Previous page"
					class="h-7 w-7 p-0"
				>
					<ChevronLeft class="h-3.5 w-3.5" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={table.pagination.nextPage}
					disabled={table.pagination.page === table.pagination.pageCount - 1}
					aria-label="Next page"
					class="h-7 w-7 p-0"
				>
					<ChevronRight class="h-3.5 w-3.5" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={table.pagination.lastPage}
					disabled={table.pagination.page === table.pagination.pageCount - 1}
					aria-label="Last page"
					class="h-7 w-7 p-0"
				>
					<ChevronsRight class="h-3.5 w-3.5" />
				</Button>
			</div>
		</div>
	</div>
</div>
