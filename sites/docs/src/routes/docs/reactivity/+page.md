---
layout: docPage
---

# Reactivity

Reactivity is at the core of Svelte Reactive Table. Built with Svelte 5's runes system, the library automatically updates your table interface whenever your data changes.

## How It Works

When you create a table with `reactiveTable`, it establishes reactive bindings to your data. Any changes to your data or column definitions automatically reflect in the UI:

```svelte
<script lang="ts">
	import { reactiveTable } from 'svelte-reactive-table';

	// Initial data
	const data = [
		{ id: 1, name: 'John Doe', age: 30 },
		{ id: 2, name: 'Jane Smith', age: 25 }
	];

	const columns = [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' }
	];

	const table = reactiveTable(data, columns);

	// Adding a row will automatically update the table
	function addPerson() {
		table.data.push({
			id: table.data.length + 1,
			name: 'New Person',
			age: Math.floor(Math.random() * 40) + 20
		});
	}
</script>
```

## Reactive Properties

The table instance provides several reactive properties that update automatically:

- `data`: The source data array
- `columnDefs`: Column definitions array
- `headers`: Array of visible column headers
- `allRows`: Array of all rows with their cells
- `rows`: Rows after applying active features (pagination, sorting, etc.)
- `columns`: Array of currently visible columns

When these properties change, your UI updates automatically.

## Modifying Data

You can directly modify the table's data in any way:

```svelte
<script>
	// Directly modify a property
	function incrementAge(id) {
		const index = table.data.findIndex((item) => item.id === id);
		if (index !== -1) {
			table.data[index].age++;
		}
	}

	// Replace the entire dataset
	function loadNewData(newData) {
		table.data = newData;
	}

	// Sort the data
	function sortByAge() {
		table.data = [...table.data].sort((a, b) => a.age - b.age);
	}
</script>
```

## Feature Reactivity

Features like column visibility and pagination are also reactive:

```svelte
<script>
	// The UI automatically updates when visibility changes
	function toggleAgeColumn() {
		table.toggleColumnVisibility('age');
	}
</script>
```

With pagination enabled, all pagination state is reactive:

```svelte
<script>
	// This expression automatically updates when pagination changes
	const pageInfo = $derived(
		`Showing page ${table.pagination.page + 1} of ${table.pagination.pageCount}`
	);
</script>

<div>{pageInfo}</div>
```

## Benefits

This automatic reactivity provides several advantages:

1. **Less code**: No manual UI updates needed when data changes
2. **Fewer bugs**: No synchronization issues between data and UI
3. **Better performance**: Only the necessary parts of the UI update

The table stays automatically in sync with your data, letting you focus on building your application rather than managing table state.
