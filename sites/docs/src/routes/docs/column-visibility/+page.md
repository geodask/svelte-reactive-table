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
			title: 'Column Visibility'
		}
	])
</script>

# Column Visibility

The column visibility plugin enables dynamic control over which columns appear in your table. Users can customize their view by showing only relevant information.

## Enable Column Visibility

Add column visibility management using the `reactiveColumnVisibility` plugin:

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

// Create table instance with column visibility plugin
const table = reactiveTable(data, columns).use(
	reactiveColumnVisibility({
		hiddenColumns: ['email'] // Initially hide the email column
	})
);

// Access column visibility controls through plugins
const { columnVisibility } = table.plugins;
```

## Visibility Control Methods

The plugin provides methods for controlling column visibility:

### Toggle Column Visibility

```js
// Toggle email column between visible and hidden
function toggleEmailColumn() {
	columnVisibility.toggleVisibility('email');
}
```

### Set Specific Visibility

```js
// Show the email column
function showEmailColumn() {
	columnVisibility.showColumn('email');
}

// Hide the age column
function hideAgeColumn() {
	columnVisibility.hideColumn('age');
}
```

### Multiple Column Operations

```js
// Show multiple columns at once
function showUserInfo() {
	columnVisibility.showColumns(['name', 'email']);
}

// Hide multiple columns at once
function hideUserInfo() {
	columnVisibility.hideColumns(['name', 'email']);
}

// Show only specific columns, hiding all others
function showOnlyBasics() {
	columnVisibility.setVisibleColumns(['id', 'name']);
}

// Reset column visibility to show all columns
function showAllColumns() {
	columnVisibility.resetVisibility();
}
```

## Column Selector Interface

Example implementation of a column selector component:

```svelte
<div class="column-toggles">
	{#each table.allColumns as column}
		<label class="toggle">
			<input
				type="checkbox"
				checked={columnVisibility.isVisible(column.accessor)}
				onchange={() => columnVisibility.toggleVisibility(column.accessor)}
			/>
			{column.header}
		</label>
	{/each}
</div>
```

## Automatic Reactivity

When column visibility changes:

1. The table's `columns` array updates automatically to include only visible columns
2. The `headers` array updates to include only visible column headers
3. The `rows` and `allRows` properties update their `cells` arrays to reflect current visibility settings

UI reflects these changes instantly without manual synchronization.

## Visibility State Access

Methods for checking and working with visibility state:

```js
// Check if a specific column is visible
const isAgeVisible = columnVisibility.isVisible('age');

// Get all currently hidden columns
const hiddenColumns = columnVisibility.hiddenColumns;

// Create derived value that updates when visibility changes
const visibleColumnCount = $derived(table.columns.length);
```

## API Reference

For complete property and method documentation, see the [reactiveColumnVisibility API reference](/docs/api/reactive-column-visibility).