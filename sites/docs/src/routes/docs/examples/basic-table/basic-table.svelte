<script lang="ts">
	import * as Table from '$shared/ui/shadcn/table';
	import { reactiveTable } from 'svelte-reactive-table';
	import { initialData } from '../data';
	import { Inbox, Plus, Trash2 } from '@lucide/svelte';
	import { Button } from '$shared/ui/shadcn/button';
	// Basic table example
	const basicTable = reactiveTable(initialData, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	]);

	function addNewRow() {
		basicTable.data.push({
			name: 'New Hero',
			age: Math.floor(Math.random() * 100),
			city: 'New City',
			id: Math.floor(Math.random() * 1000)
		});
	}

	function removeRow() {
		if (basicTable.data.length > 0) {
			basicTable.data.pop();
		}
	}
</script>

<div class="not-prose">
	<div class="flex mb-2 gap-2 justify-end">
		<Button size="sm" onclick={() => addNewRow()} class="shadow-sm">
			<Plus />
			Add New Row
		</Button>

		<Button size="sm" variant="destructive" onclick={() => removeRow()} class="shadow-sm">
			<Trash2 />
			Remove Row
		</Button>
	</div>

	<div class="rounded-md border shadow-sm overflow-hidden">
		<Table.Root>
			<Table.Header class="bg-muted/50">
				<Table.Row>
					{#each basicTable.headers as header}
						<Table.Head class="font-medium p-4">
							{header}
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each basicTable.allRows as row, i}
					<Table.Row class="hover:bg-muted/20 transition-colors">
						{#each row.cells as cell}
							<Table.Cell class="p-4">
								{cell.value}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
				{#if basicTable.allRows.length === 0}
					<Table.Row>
						<Table.Cell class="h-24 text-center p-4" colspan={basicTable.columns.length}>
							<div class="flex flex-col items-center justify-center text-muted-foreground">
								<Inbox class="h-8 w-8 mb-2 opacity-60" />
								<span>No data available</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
