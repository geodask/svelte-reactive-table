---
layout: docPage
breadcrumb: ['Examples', 'Filtering']
prev: { title: 'Column Visibility Example', href: '/docs/examples/column-visibility' }
next: { title: 'Pagination Example', href: '/docs/examples/pagination' }
---

<script lang="ts">
	import Example from './example.svelte';
	import { ExampleViewer } from '$widgets/example-viewer';
	import { page } from '$app/state';
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

<ExampleViewer source={page.data.doc?.examples?.[0]?.source ?? ''} title="Filtering Demo">
{#snippet preview()}
<Example />
{/snippet}
</ExampleViewer>

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
filtering.count; // Number of active filters
filtering.hasActiveFilters; // Boolean indicating if any filters are active
filtering.filters; // Read-only copy of all current filters
```

### Empty Value Handling

Filters are automatically removed when set to empty values:

```ts
filtering.setFilter('city', ''); // Removes filter
filtering.setFilter('city', []); // Removes filter
filtering.setFilter('city', undefined); // Removes filter
```

## Related Documentation

- [Filtering Guide](/docs/filtering) - Comprehensive guide with all filtering capabilities
- [reactiveFiltering API](/docs/api/reactive-filtering) - Complete API reference
- [Filter Helpers](/docs/filtering#filter-helpers) - Built-in helper functions for common patterns
