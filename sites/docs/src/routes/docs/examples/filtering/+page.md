---
layout: docPage
---

<script lang="ts">
	import FilteringExample from './filtering-example.svelte';
	import Tabs from '$shared/ui/tabs.svelte'
	import TabItem from '$shared/ui/tab-item.svelte'

	const items = ['Code', 'Preview'];
</script>

# Filtering Example

The filtering feature in Svelte Reactive Table provides powerful data filtering capabilities with an intuitive API. This example demonstrates various filtering patterns including text search, range filters, and multi-select options.

## Interactive Filtering Example

This example shows comprehensive filtering functionality:

- Text search with case-insensitive substring matching
- Age range filtering using the `range` helper
- Multi-select city filtering (array/IN operation)
- Multi-select status filtering
- Real-time filter state display
- Clear all filters functionality
- "No results" message when filters exclude all data

<Tabs value="Preview" {items}>

<TabItem value="Code">

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { FilterX } from '@lucide/svelte';
	import { reactiveTable, reactiveFiltering, filterHelpers } from 'svelte-reactive-table';

	type Person = {
		id: number;
		name: string;
		age: number;
		city: string;
		status: 'active' | 'inactive' | 'pending';
	};

	const data: Person[] = [
		{ id: 1, name: 'Alice Johnson', age: 28, city: 'New York', status: 'active' },
		{ id: 2, name: 'Bob Smith', age: 35, city: 'Los Angeles', status: 'inactive' },
		{ id: 3, name: 'Charlie Brown', age: 22, city: 'Chicago', status: 'pending' },
		{ id: 4, name: 'Diana Prince', age: 30, city: 'New York', status: 'active' },
		{ id: 5, name: 'Eve Wilson', age: 29, city: 'Seattle', status: 'active' },
		{ id: 6, name: 'Frank Miller', age: 42, city: 'Boston', status: 'inactive' },
		{ id: 7, name: 'Grace Lee', age: 26, city: 'Chicago', status: 'active' },
		{ id: 8, name: 'Henry Davis', age: 31, city: 'New York', status: 'pending' },
		{ id: 9, name: 'Ivy Chen', age: 27, city: 'Los Angeles', status: 'active' },
		{ id: 10, name: 'Jack Anderson', age: 38, city: 'Seattle', status: 'inactive' }
	];

	const table = reactiveTable(data, [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' },
		{ accessor: 'status', header: 'Status' }
	]).use(reactiveFiltering<Person>());

	const { filtering } = table.plugins;

	// Form state
	let nameSearch = $state('');
	let selectedCities = $state<string[]>([]);
	let selectedStatuses = $state<Person['status'][]>([]);
	let minAge = $state<number | undefined>();
	let maxAge = $state<number | undefined>();

	const cities = ['New York', 'Los Angeles', 'Chicago', 'Seattle', 'Boston'];
	const statuses: Person['status'][] = ['active', 'inactive', 'pending'];

	// Sync filters with form state
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

	function clearAllFilters() {
		filtering.clearFilters();
		nameSearch = '';
		selectedCities = [];
		selectedStatuses = [];
		minAge = undefined;
		maxAge = undefined;
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800 hover:bg-green-100';
			case 'inactive':
				return 'bg-red-100 text-red-800 hover:bg-red-100';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
			default:
				return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
		}
	}
</script>

<div class="not-prose">
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
		<!-- Filter Panel -->
		<div class="lg:col-span-1">
			<Card.Root class="sticky top-4">
				<Card.Header>
					<Card.Title class="text-lg">Filters</Card.Title>
					<Card.Description>
						Filter the data by multiple criteria
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<!-- Filter Status -->
					{#if filtering.hasActiveFilters}
						<div class="rounded-md bg-muted p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium">Active Filters</span>
								<Badge variant="secondary">{filtering.count}</Badge>
							</div>
							<Button
								onclick={clearAllFilters}
								variant="outline"
								size="sm"
								class="w-full"
							>
								<FilterX class="mr-2 h-4 w-4" />
								Clear All
							</Button>
						</div>
					{/if}

					<!-- Name Filter -->
					<div class="space-y-2">
						<Label for="name-search">Name Contains</Label>
						<Input
							id="name-search"
							type="text"
							bind:value={nameSearch}
							placeholder="Search names..."
						/>
					</div>

					<!-- Age Range Filter -->
					<div class="space-y-2">
						<Label>Age Range</Label>
						<div class="flex gap-2">
							<Input
								type="number"
								bind:value={minAge}
								placeholder="Min"
								class="w-20"
							/>
							<span class="self-center text-muted-foreground">to</span>
							<Input
								type="number"
								bind:value={maxAge}
								placeholder="Max"
								class="w-20"
							/>
						</div>
					</div>

					<!-- City Filter -->
					<div class="space-y-2">
						<Label>Cities</Label>
						<div class="space-y-2">
							{#each cities as city}
								<div class="flex items-center space-x-2">
									<Checkbox
										id={`city-${city}`}
										checked={selectedCities.includes(city)}
										onCheckedChange={(checked) => {
											if (checked) {
												selectedCities = [...selectedCities, city];
											} else {
												selectedCities = selectedCities.filter(c => c !== city);
											}
										}}
									/>
									<Label
										for={`city-${city}`}
										class="text-sm font-normal cursor-pointer"
									>
										{city}
									</Label>
								</div>
							{/each}
						</div>
					</div>

					<!-- Status Filter -->
					<div class="space-y-2">
						<Label>Status</Label>
						<div class="space-y-2">
							{#each statuses as status}
								<div class="flex items-center space-x-2">
									<Checkbox
										id={`status-${status}`}
										checked={selectedStatuses.includes(status)}
										onCheckedChange={(checked) => {
											if (checked) {
												selectedStatuses = [...selectedStatuses, status];
											} else {
												selectedStatuses = selectedStatuses.filter(s => s !== status);
											}
										}}
									/>
									<Label
										for={`status-${status}`}
										class="text-sm font-normal cursor-pointer capitalize"
									>
										{status}
									</Label>
								</div>
							{/each}
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Data Table -->
		<div class="lg:col-span-3">
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between">
						<div>
							<Card.Title>People</Card.Title>
							<Card.Description>
								Showing {table.rows.length} of {table.allRows.length} results
								{#if filtering.hasActiveFilters}
									<span class="text-primary">(filtered)</span>
								{/if}
							</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="rounded-md border">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									{#each table.headers as header}
										<Table.Head class="font-semibold">{header}</Table.Head>
									{/each}
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each table.rows as row}
									<Table.Row class="hover:bg-muted/50 transition-colors">
										{#each row.cells as cell}
											<Table.Cell>
												{#if cell.key === 'status'}
													<Badge
														variant="outline"
														class={getStatusColor(String(cell.value))}
													>
														{cell.value}
													</Badge>
												{:else}
													{cell.value}
												{/if}
											</Table.Cell>
										{/each}
									</Table.Row>
								{/each}
								{#if table.rows.length === 0}
									<Table.Row>
										<Table.Cell
											colspan={table.headers.length}
											class="h-32 text-center"
										>
											<div class="flex flex-col items-center justify-center text-muted-foreground">
												{#if filtering.hasActiveFilters}
													<p class="mb-2">No results match your current filters.</p>
													<Button
														variant="link"
														size="sm"
														onclick={clearAllFilters}
													>
														Clear filters
													</Button>
												{:else}
													<p>No data available</p>
												{/if}
											</div>
										</Table.Cell>
									</Table.Row>
								{/if}
							</Table.Body>
						</Table.Root>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
```

</TabItem>

<TabItem value="Preview">
	<FilteringExample />
</TabItem>

</Tabs>

## Key Features Demonstrated

### Text Search
The name filter uses substring matching (contains) with case-insensitive comparison by default:

```ts
filtering.setFilter('name', nameSearch.trim());
// Matches "alice" in "Alice Johnson"
```

### Range Filtering
The age filter uses the `range` helper for numeric range filtering:

```ts
filtering.setFilter('age', filterHelpers.range(minAge, maxAge));
// Filters ages between minAge and maxAge (inclusive)
```

### Array Filtering (IN Operation)
City and status filters use arrays for "IN" style filtering:

```ts
filtering.setFilter('city', selectedCities);
// Matches any city in the array
```

### Multiple Filters (AND Logic)
All filters are combined with AND logic - rows must match all active filters:

```ts
filtering.setFilters({
	name: 'john',
	city: ['New York', 'Chicago'],
	age: filterHelpers.range(25, 35)
});
// Only rows matching ALL conditions appear
```

### Reactive State
The filtering plugin provides reactive properties to monitor filter state:

```ts
filtering.count           // Number of active filters
filtering.hasActiveFilters // Boolean indicating if any filters are active
filtering.filters         // Read-only copy of all current filters
```

### Empty Value Handling
Filters are automatically removed when set to empty values:

```ts
filtering.setFilter('city', '');        // Removes filter
filtering.setFilter('city', []);        // Removes filter
filtering.setFilter('city', undefined); // Removes filter
```

## Related Documentation

- [Filtering Guide](/docs/filtering) - Comprehensive guide with all filtering capabilities
- [reactiveFiltering API](/docs/api/reactive-filtering) - Complete API reference
- [Filter Helpers](/docs/filtering#filter-helpers) - Built-in helper functions for common patterns
