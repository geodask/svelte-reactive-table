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
			title: 'Column Visibility'
		}
	])
</script>

# Column Visibility

One of the key features of Svelte Reactive Table is the ability to dynamically control which columns are visible in your table. This feature allows users to customize their view by showing only the information they need.

## Adding Column Visibility to Your Table

To enable column visibility management in your table, use the `reactiveColumnVisibility` function when creating your table:

```ts
// In your Svelte component
import { reactiveTable, reactiveColumnVisibility } from 'svelte-reactive-table';

const data = [
	{ id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' }
];

const columns = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'age', header: 'Age' },
	{ accessor: 'email', header: 'Email' }
];

const table = reactiveTable(data, columns, {
	columnVisibility: reactiveColumnVisibility({
		hiddenColumns: ['email'] // Initially hide the email column
	})
});
```

## Controlling Column Visibility

The table instance provides several methods for controlling column visibility through the `columnVisibility` object:

### 1. Toggle Column Visibility

```js
// Toggle the email column between visible and hidden
function toggleEmailColumn() {
	table.columnVisibility.toggleColumnVisibility('email');
}
```

### 2. Set Specific Visibility

```js
// Show the email column
function showEmailColumn() {
	table.columnVisibility.setColumnVisibility('email', true);
}

// Hide the age column
function hideAgeColumn() {
	table.columnVisibility.setColumnVisibility('age', false);
}
```

### 3. Working with Multiple Columns

```js
// Show multiple columns at once
function showUserInfo() {
	table.columnVisibility.showColumns(['name', 'email']);
}

// Hide multiple columns at once
function hideUserInfo() {
	table.columnVisibility.hideColumns(['name', 'email']);
}

// Show only specific columns, hiding all others
function showOnlyBasics() {
	table.columnVisibility.setVisibleColumns(['id', 'name']);
}

// Reset column visibility to show all columns
function showAllColumns() {
	table.columnVisibility.resetColumnVisibility();
}
```

## Building a Column Selector UI

Here's a practical example of a column selector component:

```svelte
<div class="column-toggles">
	{#each table.allColumns as column}
		<label class="toggle">
			<input
				type="checkbox"
				checked={table.columnVisibility.isColumnVisible(column.accessor)}
				on:change={() => table.columnVisibility.toggleColumnVisibility(column.accessor)}
			/>
			{column.header}
		</label>
	{/each}
</div>
```

## How Reactivity Works

When you change column visibility:

1. The table's `columns` array updates automatically to include only visible columns
2. The `headers` array updates to include only visible column headers
3. The `rows` and `allRows` properties update their `cells` arrays to reflect the current visibility settings

Your UI will reflect these changes instantly without any manual synchronization code.

## Checking Column Visibility State

To check if a column is currently visible or to build UI based on visibility:

```js
// Check if a specific column is visible
const isAgeVisible = table.columnVisibility.isColumnVisible('age');

// Get all currently hidden columns
const hiddenColumns = table.columnVisibility.hiddenColumns;

// Create a derived value that updates when visibility changes
const visibleColumnCount = $derived(table.columns.length);
```

Column visibility control helps you build tables that adapt to your users' needs, creating a more focused and effective data display.

## TypeScript Support

Column visibility is fully typed, ensuring type safety when working with your table:

```ts
type User = {
	id: number;
	name: string;
	age: number;
	email: string;
};

const table = reactiveTable<User>(users, columns, {
	columnVisibility: reactiveColumnVisibility<User>({
		hiddenColumns: ['email']
	})
});

// TypeScript will ensure you only reference valid column keys
table.columnVisibility.toggleColumnVisibility('name'); // ✓ Valid
table.columnVisibility.toggleColumnVisibility('invalid'); // ❌ Type error
```
