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
			title: 'API Reference',
		},
		{
			title: 'reactiveFiltering'
		}
	])
</script>

# reactiveFiltering

The `reactiveFiltering` function creates a filtering plugin for table instances, enabling powerful data filtering with support for exact matches, array filters, and custom predicates.

## Signature

```ts
function reactiveFiltering<T>(
	options?: FilteringOptions<T>
): TablePlugin<T, FiltersState<T>, 'filtering'>;
```

## Parameters

| Parameter | Type                  | Description                                       |
| --------- | --------------------- | ------------------------------------------------- |
| `options` | `FilteringOptions<T>` | Optional configuration for the filtering behavior |

### FilteringOptions

| Property         | Type          | Default | Description                                            |
| ---------------- | ------------- | ------- | ------------------------------------------------------ |
| `initialFilters` | `Filters<T>`  | `{}`    | Initial filters to apply when the table is created     |
| `caseSensitive`  | `boolean`     | `false` | Whether string comparisons should be case-sensitive    |

### Filters Type

```ts
type Filters<T> = {
	[K in keyof T]?: FilterValue<T[K]>;
};
```

### FilterValue Type

```ts
type FilterValue<T> = T | T[] | ((value: T) => boolean);
```

Filter values can be:
- A single value for exact match (or substring for strings)
- An array of values for "IN" filtering
- A predicate function for custom logic

## Return Value

Returns a TablePlugin that adds filtering functionality when passed to the `use` method of the table.

## Basic Usage

```svelte
<script lang="ts">
	import { reactiveTable, reactiveFiltering } from 'svelte-reactive-table';

	const data = [
		{ id: 1, name: 'Alice', age: 28, city: 'New York' },
		{ id: 2, name: 'Bob', age: 35, city: 'Los Angeles' },
		{ id: 3, name: 'Charlie', age: 22, city: 'Chicago' }
	];

	const columns = [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'city', header: 'City' }
	];

	// Create a table with filtering plugin
	const table = reactiveTable(data, columns).use(reactiveFiltering());

	// Access the filtering API through table.plugins
	const { filtering } = table.plugins;
</script>

<!-- Filter controls -->
<input
	type="text"
	oninput={(e) => filtering.setFilter('name', e.target.value)}
	placeholder="Search names..."
/>

<!-- Table automatically shows filtered rows -->
<table>
	<tbody>
		{#each table.rows as row}
			<tr>
				{#each row.cells as cell}
					<td>{cell.value}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
```

## Filtering Properties

When filtering plugin is used, these reactive properties are available:

| Property              | Type         | Description                                  |
| --------------------- | ------------ | -------------------------------------------- |
| `filtering.filters`   | `Filters<T>` | Current active filters (read-only)           |
| `filtering.count`     | `number`     | Number of active filters                     |
| `filtering.hasActiveFilters` | `boolean` | Whether any filters are currently active |

## Filtering Methods

These methods are available on the filtering plugin state:

| Method                                                          | Return Type | Description                           |
| --------------------------------------------------------------- | ----------- | ------------------------------------- |
| `setFilter<K extends keyof T>(key: K, value: FilterValue<T[K]> \| undefined)` | `void` | Set a filter for a specific column |
| `setFilters(filters: Partial<Filters<T>>)`                     | `void`      | Set multiple filters at once          |
| `removeFilter<K extends keyof T>(key: K)`                      | `void`      | Remove a specific filter              |
| `clearFilters()`                                                | `void`      | Remove all filters                    |
| `getFilter<K extends keyof T>(key: K)`                         | `FilterValue<T[K]> \| undefined` | Get current filter value for a column |

## Filter Methods Examples

### setFilter

Set a single filter. Empty values (undefined, null, '', []) automatically remove the filter:

```svelte
<script>
	// Exact match
	filtering.setFilter('city', 'New York');

	// Array filter (IN operation)
	filtering.setFilter('status', ['active', 'pending']);

	// Predicate function
	filtering.setFilter('age', (age) => age >= 25 && age <= 35);

	// Remove filter by setting to empty value
	filtering.setFilter('city', undefined);
	filtering.setFilter('city', '');
	filtering.setFilter('city', []);
</script>
```

### setFilters

Set multiple filters simultaneously:

```svelte
<script>
	filtering.setFilters({
		city: 'New York',
		status: ['active', 'pending'],
		age: (age) => age >= 18
	});
</script>
```

### removeFilter

Remove a specific filter:

```svelte
<script>
	filtering.removeFilter('city');
</script>
```

### clearFilters

Remove all active filters:

```svelte
<script>
	filtering.clearFilters();
</script>
```

### getFilter

Retrieve the current filter value for a column:

```svelte
<script>
	const cityFilter = filtering.getFilter('city');
	// Returns the filter value or undefined if not set
</script>
```

## Filter Helpers

The library exports `filterHelpers` with utility functions for common filtering patterns:

```svelte
<script>
	import { filterHelpers } from 'svelte-reactive-table';
</script>
```

### range

Create a range filter for numbers or dates:

```ts
function range<T extends number | Date>(
	min?: T,
	max?: T
): ((value: T) => boolean) | undefined
```

```svelte
<script>
	// Age between 25 and 35
	filtering.setFilter('age', filterHelpers.range(25, 35));

	// Age 25 or higher
	filtering.setFilter('age', filterHelpers.range(25, undefined));

	// Date range
	filtering.setFilter('createdAt', filterHelpers.range(
		new Date('2024-01-01'),
		new Date('2024-12-31')
	));
</script>
```

### exactText

Create exact text match filter (case-sensitive):

```ts
function exactText(text: string): (value: string) => boolean
```

```svelte
<script>
	// Only match exactly "Alice"
	filtering.setFilter('name', filterHelpers.exactText('Alice'));
</script>
```

### startsWith

Create a starts-with filter:

```ts
function startsWith(
	prefix: string,
	caseSensitive?: boolean
): (value: string) => boolean
```

```svelte
<script>
	// Names starting with "A" (case-insensitive)
	filtering.setFilter('name', filterHelpers.startsWith('A'));

	// Case-sensitive starts with
	filtering.setFilter('name', filterHelpers.startsWith('A', true));
</script>
```

### endsWith

Create an ends-with filter:

```ts
function endsWith(
	suffix: string,
	caseSensitive?: boolean
): (value: string) => boolean
```

```svelte
<script>
	// Emails ending with "@company.com"
	filtering.setFilter('email', filterHelpers.endsWith('@company.com'));

	// Case-sensitive ends with
	filtering.setFilter('email', filterHelpers.endsWith('.COM', true));
</script>
```

### not

Invert any filter condition:

```ts
function not<T>(filterValue: FilterValue<T>): (value: T) => boolean
```

```svelte
<script>
	// Not in New York
	filtering.setFilter('city', filterHelpers.not('New York'));

	// Not active or inactive
	filtering.setFilter('status', filterHelpers.not(['active', 'inactive']));

	// Not in age range
	filtering.setFilter('age', filterHelpers.not(filterHelpers.range(18, 25)));
</script>
```

## Filter Behavior

### String Filtering

String filters perform **substring matching** (contains) by default:

```svelte
<script>
	// Matches "Alice", "Alice Johnson", etc.
	filtering.setFilter('name', 'alice');

	// Case-sensitive matching
	const table = reactiveTable(data, columns).use(
		reactiveFiltering({ caseSensitive: true })
	);
	// Now 'alice' won't match 'Alice'
</script>
```

### Multiple Filters (AND Logic)

Multiple filters use AND logic - rows must match all filters:

```svelte
<script>
	filtering.setFilters({
		city: 'New York',
		status: 'active',
		age: filterHelpers.range(25, 35)
	});
	// Only rows matching ALL three conditions will appear
</script>
```

## Complete Filtering Example

```svelte
<script lang="ts">
	import { reactiveTable, reactiveFiltering, filterHelpers } from 'svelte-reactive-table';

	type Person = {
		id: number;
		name: string;
		age: number;
		city: string;
		status: 'active' | 'inactive' | 'pending';
	};

	const data: Person[] = [
		/* your data */
	];

	const table = reactiveTable(data, columns).use(
		reactiveFiltering<Person>({
			initialFilters: {
				status: 'active'
			}
		})
	);

	const { filtering } = table.plugins;

	// Reactive form state
	let nameSearch = $state('');
	let selectedCities = $state<string[]>([]);
	let minAge = $state<number | undefined>();
	let maxAge = $state<number | undefined>();

	// Sync filters with form state using effects
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

<!-- Filter controls -->
<div class="filters">
	<input
		type="text"
		bind:value={nameSearch}
		placeholder="Search names..."
	/>

	<div>
		{#each ['New York', 'Los Angeles', 'Chicago'] as city}
			<label>
				<input type="checkbox" value={city} bind:group={selectedCities} />
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
			Clear All Filters ({filtering.count})
		</button>
	{/if}
</div>

<!-- Results info -->
<div class="results-info">
	Showing {table.rows.length} of {table.allRows.length} results
	{#if filtering.hasActiveFilters}
		<span class="filtered-badge">
			{filtering.count} filter{filtering.count === 1 ? '' : 's'} active
		</span>
	{/if}
</div>

<!-- Table -->
<table>
	<thead>
		<tr>
			{#each table.headers as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
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
				<td colspan={table.columns.length} class="no-results">
					No results match your filters. Try adjusting your search criteria.
				</td>
			</tr>
		{/if}
	</tbody>
</table>
```

## TypeScript Support

```ts
import { reactiveTable, reactiveFiltering, filterHelpers } from 'svelte-reactive-table';
import type { FilterValue } from 'svelte-reactive-table';

type User = {
	id: number;
	name: string;
	age: number;
	email: string;
	status: 'active' | 'inactive';
};

const table = reactiveTable<User>(users, columns).use(
	reactiveFiltering<User>({
		initialFilters: {
			status: 'active',
			age: filterHelpers.range(18, 65)
		}
	})
);

// TypeScript will infer the correct filtering state type
const { filtering } = table.plugins;

// Type-safe filter setting
filtering.setFilter('status', 'active'); // ✓ Valid
filtering.setFilter('status', 'invalid'); // ✗ Type error

// Type-safe filter helpers
const ageFilter: FilterValue<number> = filterHelpers.range(25, 35);
const nameFilter: FilterValue<string> = filterHelpers.startsWith('J');
```

## Integration with Other Plugins

Filtering works seamlessly with other plugins. The order of plugin application matters:

```svelte
<script>
	import {
		reactiveTable,
		reactiveFiltering,
		reactiveSorting,
		reactivePagination
	} from 'svelte-reactive-table';

	// Order: Filter → Sort → Paginate
	const table = reactiveTable(data, columns)
		.use(reactiveFiltering())
		.use(reactiveSorting())
		.use(reactivePagination({ pageSize: 10 }));

	// table.rows contains: filtered → sorted → paginated results
	// table.allRows contains: all data (before any plugin transformations)
</script>
```

When combined with pagination:
- Pagination resets to page 0 when filters change
- Page counts are based on filtered results
- Use `table.allRows.length` to show total record count

## Related

- [Filtering Guide](/docs/filtering) - Comprehensive guide with examples
- [Filtering Example](/docs/examples/filtering) - Interactive example
- [reactiveSorting](/docs/api/reactive-sorting) - Sorting plugin
- [reactivePagination](/docs/api/reactive-pagination) - Pagination plugin
