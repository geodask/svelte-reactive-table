---
layout: docPage
breadcrumb: ["Core Concepts", "Basic Usage"]
---

# Basic Usage

This guide covers the fundamentals of creating and working with Svelte Reactive Table. You'll learn how to set up a simple table and understand its core concepts.

## Creating Your First Table

Creating a table requires three components:

1. Your data (an array of objects)
2. Column definitions (specify what to display)
3. The `reactiveTable` function

Here's a minimal example:

```svelte
<script lang="ts">
	import { reactiveTable } from 'svelte-reactive-table';

	// 1. Your data
	const users = [
		{ id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
		{ id: 2, name: 'Bob Smith', email: 'bob@example.com' },
		{ id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
	];

	// 2. Column definitions
	const columns = [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'email', header: 'Email' }
	];

	// 3. Create the table
	const table = reactiveTable(users, columns);
</script>

<!-- Render the table -->
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
	</tbody>
</table>
```

This creates a fully functional, reactive table instance.

## Understanding the Structure

Let's break down what's happening:

### Data Format

Your data should be an array of objects where each object represents a row:

```js
const data = [
	{ id: 1, name: 'Alice', age: 30 }, // Row 1
	{ id: 2, name: 'Bob', age: 25 } // Row 2
];
```

### Column Definitions

Each column needs an `accessor` (the property name) and a `header` (display text):

```js
const columns = [
	{ accessor: 'id', header: 'User ID', isIdentifier: true },
	{ accessor: 'name', header: 'Full Name' },
	{ accessor: 'age', header: 'Age' }
];
```

> **Pro tip**: Always mark one column as `isIdentifier: true`. This helps the table track rows efficiently.

### Table Properties

The table instance provides several reactive properties:

- `table.headers` - Array of column headers for the `<thead>`
- `table.rows` - Array of row objects for the `<tbody>`
- `table.data` - Your original data (reactive)
- `table.columns` - Your column definitions

## Working with Dynamic Data

The table automatically updates when your data changes. Here's how to add and remove rows:

```svelte
<script>
	// Same table setup as above...

	function addUser() {
		// Push to the array - the table updates automatically
		table.data.push({
			id: table.data.length + 1,
			name: 'New User',
			email: 'newuser@example.com'
		});
	}

	function removeUser(userId) {
		// Filter the array - the table updates automatically
		table.data = table.data.filter((user) => user.id !== userId);
	}
</script>

<button onclick={addUser}>Add User</button>

<table>
	<!-- Same table structure as above -->
	<tbody>
		{#each table.rows as row}
			<tr>
				{#each row.cells as cell}
					<td>{cell.value}</td>
				{/each}
				<td>
					<button onclick={() => removeUser(row.id)}>Remove</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
```

The table automatically reflects any changes to your data without manual updates.

## Styling Your Table

Since Svelte Reactive Table is headless, you have complete control over styling. Here's an example with some basic CSS:

```svelte
<table class="user-table">
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
	</tbody>
</table>

<style>
	.user-table {
		width: 100%;
		border-collapse: collapse;
	}

	.user-table th,
	.user-table td {
		padding: 12px;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}

	.user-table th {
		background-color: #f8f9fa;
		font-weight: 600;
	}

	.user-table tr:hover {
		background-color: #f8f9fa;
	}
</style>
```

## Handling Empty States

Don't forget to handle the case when there's no data:

```svelte
{#if table.rows.length > 0}
	<table>
		<!-- Your table structure -->
	</table>
{:else}
	<div class="empty-state">
		<p>No data available</p>
	</div>
{/if}
```

## What's Next?

Now that you know the basics, explore more features:

- **[Reactivity](/docs/reactivity)** - Understand how automatic updates work
- **[Column Definition](/docs/column-definition)** - Configure columns in depth
- **[Quick Start](/docs/quick-start)** - Add plugins for pagination, sorting, and filtering
