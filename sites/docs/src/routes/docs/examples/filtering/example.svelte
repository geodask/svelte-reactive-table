<script lang="ts">
	import { Button } from '$shared/ui/shadcn/button';
	import { Input } from '$shared/ui/shadcn/input';
	import { Label } from '$shared/ui/shadcn/label';
	import { Badge } from '$shared/ui/shadcn/badge';
	import { Checkbox } from '$shared/ui/shadcn/checkbox';
	import * as Table from '$shared/ui/shadcn/table';
	import * as Card from '$shared/ui/shadcn/card';
	import { FilterX } from '@lucide/svelte';
	import { reactiveTable, reactiveFiltering, filterHelpers } from 'svelte-reactive-table';
	import { initialData, type Person } from '../data';

	const table = reactiveTable(initialData, [
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
	let selectedStatuses = $state<NonNullable<Person['status']>[]>([]);
	let minAge = $state<number | undefined>();
	let maxAge = $state<number | undefined>();

	const cities = [
		'Gotham City',
		'Metropolis',
		'Themyscira',
		'Central City',
		'Coast City',
		'Atlantis',
		'Jump City'
	];
	const statuses: NonNullable<Person['status']>[] = ['active', 'inactive', 'pending'];

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

	function getStatusColor(status: string | number | undefined) {
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
					<Card.Description>Filter the data by multiple criteria</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<!-- Filter Status -->
					{#if filtering.hasActiveFilters}
						<div class="rounded-md bg-muted p-3">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium">Active Filters</span>
								<Badge variant="secondary">{filtering.count}</Badge>
							</div>
							<Button onclick={clearAllFilters} variant="outline" size="sm" class="w-full">
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
							<Input type="number" bind:value={minAge} placeholder="Min" class="w-20" />
							<span class="self-center text-muted-foreground">to</span>
							<Input type="number" bind:value={maxAge} placeholder="Max" class="w-20" />
						</div>
					</div>

					<!-- City Filter -->
					<div class="space-y-2">
						<Label>Cities</Label>
						<div class="space-y-2 max-h-48 overflow-y-auto">
							{#each cities as city}
								<div class="flex items-center space-x-2">
									<Checkbox
										id={`city-${city}`}
										checked={selectedCities.includes(city)}
										onCheckedChange={(checked) => {
											if (checked) {
												selectedCities = [...selectedCities, city];
											} else {
												selectedCities = selectedCities.filter((c) => c !== city);
											}
										}}
									/>
									<Label for={`city-${city}`} class="text-sm font-normal cursor-pointer">
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
												selectedStatuses = selectedStatuses.filter((s) => s !== status);
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
							<Card.Title>Heroes & Villains</Card.Title>
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
													<Badge variant="outline" class={getStatusColor(cell.value)}>
														{cell.value || 'N/A'}
													</Badge>
												{:else}
													{cell.value ?? 'N/A'}
												{/if}
											</Table.Cell>
										{/each}
									</Table.Row>
								{/each}
								{#if table.rows.length === 0}
									<Table.Row>
										<Table.Cell colspan={table.headers.length} class="h-32 text-center">
											<div class="flex flex-col items-center justify-center text-muted-foreground">
												{#if filtering.hasActiveFilters}
													<p class="mb-2">No results match your current filters.</p>
													<Button variant="link" size="sm" onclick={clearAllFilters}>
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
