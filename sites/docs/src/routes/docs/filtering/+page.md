---
layout: docPage
---

<script lang="ts">
	import { reactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte'
	import { BookOpen } from '@lucide/svelte';

	const breadcrumb = reactiveBreadcrumb();
	breadcrumb.setItems([
		{
			icon: BookOpen,
			href: '/docs/introduction'
		},
		{
			title: 'Plugins',
		},
		{
			title: 'Filtering'
		}
	])
</script>

# Filtering

The filtering plugin provides powerful, flexible data filtering with an intuitive API. Filter by exact matches, multiple values, custom predicates, or use built-in helpers for common patterns like ranges and text matching.

## Enable Filtering

Add filtering using the `reactiveFiltering` plugin:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveFiltering } from 'svelte-reactive-table';

	const data = [
		{ id: 1, name: 'Alice', age: 28, city: 'New York', status: 'active' },
		{ id: 2, name: 'Bob', age: 35, city: 'Los Angeles', status: 'inactive' },
		{ id: 3, name: 'Charlie', age: 22, city: 'Chicago', status: 'pending' }
	];

	const columns = [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' },
		{ accessor: 'status', header: 'Status' }
	];

	// Create table instance with filtering
	const table = reactiveTable(data, columns).use(reactiveFiltering());

	// Access filtering controls through plugins
	const { filtering } = table.plugins;
</script>
```

The `table.rows` property automatically contains only rows that match all active filters.

## Filter Types

The filtering plugin supports three types of filters, automatically detected based on the value you provide:

### Exact Match Filtering

Filter by exact equality for strings, numbers, or other values:

```svelte
<script>
	// Filter by exact city match
	filtering.setFilter('city', 'New York');

	// Filter by exact status
	filtering.setFilter('status', 'active');

	// Filter by exact age
	filtering.setFilter('age', 28);
</script>
```

### Array Filtering (IN Operation)

Provide an array to match any of the values (like SQL's IN operator):

```svelte
<script>
	// Filter for multiple cities
	filtering.setFilter('city', ['New York', 'Chicago']);

	// Filter for multiple statuses
	filtering.setFilter('status', ['active', 'pending']);
</script>
```

### Predicate Function Filtering

Use a custom function for complex filtering logic:

```svelte
<script>
	// Filter by age range
	filtering.setFilter('age', (age) => age >= 25 && age <= 35);

	// Filter by name length
	filtering.setFilter('name', (name) => name.length > 5);

	// Filter by complex conditions
	filtering.setFilter('email', (email) => email.endsWith('@company.com'));
</script>
```

## String Filtering

String filters are special - they perform **substring matching** (contains) by default:

```svelte
<script>
	// Matches any name containing "alice" (case-insensitive)
	filtering.setFilter('name', 'alice');
	// Matches: "Alice", "Alice Johnson", "alice smith", etc.

	// Matches any city containing "york"
	filtering.setFilter('city', 'york');
	// Matches: "New York", "York", "Yorkshire", etc.
</script>
```

String matching is **case-insensitive by default**. You can enable case-sensitive matching:

```svelte
<script>
	const table = reactiveTable(data, columns).use(
		reactiveFiltering({
			caseSensitive: true
		})
	);

	// Now 'alice' won't match 'Alice'
	filtering.setFilter('name', 'alice');
</script>
```

## Filter Helpers

The plugin includes helper functions for common filtering patterns:

### Range Filter

Perfect for numbers, dates, or any comparable values:

```svelte
<script>
	import { filterHelpers } from 'svelte-reactive-table';

	// Age between 25 and 35 (inclusive)
	filtering.setFilter('age', filterHelpers.range(25, 35));

	// Age 25 or higher (no max)
	filtering.setFilter('age', filterHelpers.range(25, undefined));

	// Age 35 or lower (no min)
	filtering.setFilter('age', filterHelpers.range(undefined, 35));

	// Date range
	filtering.setFilter('createdAt', filterHelpers.range(
		new Date('2024-01-01'),
		new Date('2024-12-31')
	));
</script>
```

### Text Pattern Helpers

Match text patterns with precision:

```svelte
<script>
	import { filterHelpers } from 'svelte-reactive-table';

	// Exact text match (case-sensitive)
	filtering.setFilter('name', filterHelpers.exactText('Alice'));

	// Starts with (case-insensitive by default)
	filtering.setFilter('name', filterHelpers.startsWith('A'));

	// Ends with
	filtering.setFilter('email', filterHelpers.endsWith('@company.com'));

	// Case-sensitive starts with
	filtering.setFilter('name', filterHelpers.startsWith('A', true));
</script>
```

### NOT Filter

Invert any filter condition:

```svelte
<script>
	import { filterHelpers } from 'svelte-reactive-table';

	// Not in New York
	filtering.setFilter('city', filterHelpers.not('New York'));

	// Not active or inactive
	filtering.setFilter('status', filterHelpers.not(['active', 'inactive']));

	// Not in age range
	filtering.setFilter('age', filterHelpers.not(filterHelpers.range(18, 25)));
</script>
```

## Multiple Filters

Multiple filters use **AND logic** - rows must match all filters to appear:

```svelte
<script>
	// Set multiple filters at once
	filtering.setFilters({
		city: 'New York',
		status: 'active',
		age: filterHelpers.range(25, 35)
	});

	// Or set filters individually
	filtering.setFilter('city', 'New York');
	filtering.setFilter('status', 'active');
	// Both filters must match
</script>
```

## Managing Filter State

The plugin provides methods to control filter state:

### Set and Remove Filters

```svelte
<script>
	// Set a single filter
	filtering.setFilter('city', 'New York');

	// Set multiple filters
	filtering.setFilters({
		city: 'New York',
		status: 'active'
	});

	// Remove a specific filter
	filtering.removeFilter('city');

	// Clear all filters
	filtering.clearFilters();

	// Get current filter value
	const cityFilter = filtering.getFilter('city');
</script>
```

### Empty Values Auto-Remove

Filters are automatically removed when set to empty values:

```svelte
<script>
	// These all remove the filter:
	filtering.setFilter('city', undefined);
	filtering.setFilter('city', null);
	filtering.setFilter('city', '');
	filtering.setFilter('city', []);
</script>
```

## Reactive Filter State

Access reactive properties to monitor filter state:

```svelte
<script>
	// Number of active filters
	const filterCount = filtering.count;

	// Whether any filters are active
	const hasFilters = filtering.hasActiveFilters;

	// All current filters (read-only)
	const currentFilters = filtering.filters;
</script>

<!-- Show filter status in UI -->
{#if filtering.hasActiveFilters}
	<div class="filter-status">
		{filtering.count} filter{filtering.count === 1 ? '' : 's'} active
		<button onclick={() => filtering.clearFilters()}>Clear All</button>
	</div>
{/if}
```

## Complete Filter UI Example

Here's a practical example combining multiple filter types:

```svelte
<script lang="ts">
	import { reactiveTable, reactiveFiltering, filterHelpers } from 'svelte-reactive-table';

	const table = reactiveTable(data, columns).use(reactiveFiltering());
	const { filtering } = table.plugins;

	// Reactive form state
	let nameSearch = $state('');
	let selectedCities = $state<string[]>([]);
	let minAge = $state<number | undefined>();
	let maxAge = $state<number | undefined>();

	// Sync filters with form state
	$effect(() => {
		filtering.setFilter('name', nameSearch.trim());
	});

	$effect(() => {
		filtering.setFilter('city', selectedCities);
	});

	$effect(() => {
		filtering.setFilter('age', filterHelpers.range(minAge, maxAge));
	});
</script>

<!-- Filter Controls -->
<div class="filters">
	<input
		type="text"
		bind:value={nameSearch}
		placeholder="Search names..."
	/>

	<div>
		{#each cities as city}
			<label>
				<input
					type="checkbox"
					value={city}
					bind:group={selectedCities}
				/>
				{city}
			</label>
		{/each}
	</div>

	<input type="number" bind:value={minAge} placeholder="Min age" />
	<input type="number" bind:value={maxAge} placeholder="Max age" />

	{#if filtering.hasActiveFilters}
		<button onclick={() => {
			filtering.clearFilters();
			nameSearch = '';
			selectedCities = [];
			minAge = undefined;
			maxAge = undefined;
		}}>
			Clear Filters ({filtering.count})
		</button>
	{/if}
</div>

<!-- Results Summary -->
<div class="results">
	Showing {table.rows.length} of {table.allRows.length} results
	{#if filtering.hasActiveFilters}
		<span>(filtered)</span>
	{/if}
</div>

<!-- Table -->
<table>
	<tbody>
		{#each table.rows as row}
			<tr>
				{#each row.cells as cell}
					<td>{cell.value}</td>
				{/each}
			</tr>
		{/each}
		{#if table.rows.length === 0 && filtering.hasActiveFilters}
			<tr>
				<td colspan={table.columns.length}>
					No results match your filters
				</td>
			</tr>
		{/if}
	</tbody>
</table>
```

## Integration with Other Plugins

Filtering works seamlessly with other plugins:

```svelte
<script>
	import {
		reactiveTable,
		reactiveFiltering,
		reactiveSorting,
		reactivePagination
	} from 'svelte-reactive-table';

	// Filters are applied first, then sorting, then pagination
	const table = reactiveTable(data, columns)
		.use(reactiveFiltering())
		.use(reactiveSorting())
		.use(reactivePagination({ pageSize: 10 }));

	// table.rows contains: filtered → sorted → paginated results
	// table.allRows contains: all data (useful for "showing X of Y")
</script>
```

When combined with pagination:
- Pagination automatically resets to page 0 when filters change
- Page counts update based on filtered results
- `table.rows` shows the current page of filtered results
- `table.allRows` shows all data before filtering

## Initial Filters

Set filters when creating the table:

```svelte
<script>
	const table = reactiveTable(data, columns).use(
		reactiveFiltering({
			initialFilters: {
				status: 'active',
				city: ['New York', 'Chicago']
			}
		})
	);
</script>
```

## Automatic Updates

The filtering system automatically:

- Re-filters when data items change
- Re-filters when filter values change
- Updates `count` and `hasActiveFilters` properties
- Works reactively with Svelte 5's `$state` and `$derived`

## API Reference

For complete property and method documentation, see the [reactiveFiltering API reference](/docs/api/reactive-filtering).
