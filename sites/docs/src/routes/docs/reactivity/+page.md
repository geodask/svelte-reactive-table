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

One of the most powerful aspects of Svelte Reactive Table is how it automatically keeps your UI in sync with your data. Built on Svelte 5's runes system, the library makes your tables reactive without any extra work from you.

## How it works

When you create a table with `reactiveTable`, something special happens: the library establishes reactive connections to your data. This means any changes you make to your data automatically flow through to your table's display.

Here's what this looks like in practice:

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

Pretty amazing, right? Just by pushing new data to the array, the table automatically shows the new row. No manual updates, no complex state management - it just works!

## What Updates Automatically

The table provides several reactive properties that stay perfectly in sync:

- `data`: The source data array
- `columnDefs`: Column definitions array
- `headers`: Array of visible column headers
- `allRows`: Array of all rows with their cells
- `rows`: Rows after applying active features (pagination, sorting, etc.)
- `columns`: Array of currently visible columns

When these properties change, your UI updates automatically. It's like having a personal assistant that keeps everything organized for you!

## All the Ways You Can Update Data

You have complete freedom in how you modify your table's data. Here are some common patterns:

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

Every approach works perfectly - choose whatever feels most natural for your application!

## Features Are Reactive Too

It's not just data that's reactive. All table features respond instantly to changes:

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

## Why This Matters

This automatic reactivity provides several huge advantages for you as a developer:

1. **Write Less Code**: No manual UI updates when data changes - the table handles it all
2. **Fewer Bugs**: No synchronization issues between your data and what users see
3. **Better Performance**: Only the parts that actually changed get updated
4. **Focus on Your App**: Spend time on features, not on managing table state

The table stays automatically in sync with your data, letting you focus on building amazing user experiences rather than wrestling with table mechanics.

## Pro Tips for Reactive Tables

Here are some patterns that work particularly well with reactive tables:

```svelte
<script>
	// Use derived values for computed properties
	const totalUsers = $derived(table.data.length);
	const averageAge = $derived(
		table.data.reduce((sum, user) => sum + user.age, 0) / table.data.length
	);

	// Reactive filtering (the table updates automatically)
	function filterAdults() {
		table.data = table.data.filter((user) => user.age >= 18);
	}

	// Batch updates work perfectly
	function loadNewDataset(newUsers) {
		table.data = newUsers; // One update, perfect reactivity
	}
</script>

<div class="stats">
	<p>Total Users: {totalUsers}</p>
	<p>Average Age: {averageAge.toFixed(1)}</p>
</div>
```

The beauty of Svelte Reactive Table is that it gets out of your way and lets Svelte's reactivity do what it does best - keep your UI perfectly in sync with your data.
