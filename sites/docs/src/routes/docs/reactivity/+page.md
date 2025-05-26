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
			title: 'Core Concepts',
		},
		{
			title: 'Reactivity'
		}
	])
</script>

# Reactivity

Svelte Reactive Table automatically keeps your UI synchronized with your data through Svelte 5's runes system. Changes to your data propagate to the table interface without manual intervention.

## How Reactivity Works

When you create a table instance with `reactiveTable`, the library establishes reactive connections to your data. Changes to your data automatically update the table display.

Example implementation:

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

	// Adding a row automatically updates the table display
	function addPerson() {
		table.data.push({
			id: table.data.length + 1,
			name: 'New Person',
			age: Math.floor(Math.random() * 40) + 20
		});
	}
</script>
```

Adding new data to the array automatically displays the new row without manual updates or complex state management.

## Reactive Properties

The table instance provides several reactive properties that automatically update:

- `data`: The source data array
- `columnDefs`: Column definitions array
- `headers`: Array of visible column headers
- `allRows`: Array of all rows with their cells
- `rows`: Rows after applying active plugins (pagination, sorting, etc.)
- `columns`: Columns after applying active plugins (column visibility etc.)

When these properties change, your UI updates automatically.

## Data Update Patterns

You can modify your table's data using various approaches:

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

All approaches work with the reactive system - choose what fits your application best.

## Plugin Reactivity

All table plugins respond automatically to changes:

```svelte
<script>
	// UI updates automatically when visibility changes
	function toggleAgeColumn() {
		table.plugins.columnVisibility.toggleVisibility('age');
	}
</script>
```

With pagination enabled, pagination state is reactive:

```svelte
<script>
	// Expression automatically updates when pagination changes
	const pageInfo = $derived(
		`Showing page ${table.plugins.pagination.page + 1} of ${table.plugins.pagination.pageCount}`
	);
</script>

<div>{pageInfo}</div>
```

## Benefits of Reactive Tables

Automatic reactivity provides several advantages:

1. **Reduced Code**: No manual UI updates when data changes
2. **Fewer Bugs**: No synchronization issues between data and display
3. **Better Performance**: Only changed parts get updated
4. **Focus on Features**: Spend time on application logic, not table state management

## Reactive Patterns

Effective patterns for reactive tables:

```svelte
<script>
	// Use derived values for computed properties
	const totalUsers = $derived(table.data.length);
	const averageAge = $derived(
		table.data.reduce((sum, user) => sum + user.age, 0) / table.data.length
	);

	// Reactive filtering updates table automatically
	function filterAdults() {
		table.data = table.data.filter((user) => user.age >= 18);
	}

	// Batch updates work efficiently
	function loadNewDataset(newUsers) {
		table.data = newUsers; // Single update, automatic reactivity
	}
</script>

<div class="stats">
	<p>Total Users: {totalUsers}</p>
	<p>Average Age: {averageAge.toFixed(1)}</p>
</div>
```

Svelte Reactive Table leverages Svelte's reactivity system to keep your UI synchronized with your data automatically.
