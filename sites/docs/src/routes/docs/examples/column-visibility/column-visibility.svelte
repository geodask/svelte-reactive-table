<script lang="ts">
	import * as Table from '$shared/ui/shadcn/table';
	import { Button } from '$shared/ui/shadcn/button';
	import { Check, X } from '@lucide/svelte';
	import { reactiveColumnVisibility, reactiveTable } from 'svelte-reactive-table';
	import { initialData, type Person } from '../data';

	// Toggle column visibility example
	const visibilityTable = reactiveTable(
		initialData,
		[
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		],
		{
			columnVisibility: reactiveColumnVisibility({
				hiddenColumns: []
			})
		}
	);

	function toggleColumn(accessor: keyof Person) {
		visibilityTable.columnVisibility.toggleColumnVisibility(accessor);
	}
</script>

<div class="not-prose">
	<div class="space-y-2">
		<div class="p-4 border rounded-md shadow-sm bg-muted/10">
			<h3 class="text-sm font-medium mb-3">Toggle columns to display:</h3>
			<div class="flex flex-wrap gap-2">
				{#each visibilityTable.allColumns as column}
					<Button
						variant={visibilityTable.columnVisibility.isColumnVisible(column.accessor)
							? 'default'
							: 'outline-solid'}
						size="sm"
						onclick={() => toggleColumn(column.accessor)}
						class="shadow-sm"
					>
						{#if visibilityTable.columnVisibility.isColumnVisible(column.accessor)}
							<Check class="mr-2 h-4 w-4" />
						{:else}
							<X class="mr-2 h-4 w-4" />
						{/if}
						{column.accessor.charAt(0).toUpperCase() + column.accessor.slice(1)}
					</Button>
				{/each}
			</div>
		</div>

		<div class="rounded-md border shadow-sm overflow-hidden">
			<Table.Root>
				<Table.Header class="bg-muted/50">
					<Table.Row>
						{#each visibilityTable.headers as header}
							<Table.Head class="font-medium p-4">
								{header}
							</Table.Head>
						{/each}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each visibilityTable.rows as row}
						<Table.Row class="hover:bg-muted/20 transition-colors">
							{#each row.cells as cell}
								<Table.Cell class="p-4">{cell.value}</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
					{#if visibilityTable.rows.length === 0}
						<Table.Row>
							<Table.Cell class="h-24 text-center p-4" colspan={visibilityTable.headers.length}>
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
</div>
