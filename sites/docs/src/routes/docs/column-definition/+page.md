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
			title: 'Column Definition'
		}
	])
</script>

# Column Definition

Column definitions are the blueprint for your table - they tell Svelte Reactive Table what data to display and how to organize it. Don't worry, it's simpler than it sounds!

## Quick Reference

Every column needs just two things:

- **`accessor`**: The property name from your data (like `'name'` or `'email'`)
- **`header`**: The text to show in the column header (like `'Full Name'` or `'Email Address'`)

```js
const columns = [
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'email', header: 'Email' }
];
```

That's it for the basics! Let's dive into the details.

## Your First Column Definition

## Your First Column Definition

Here's how simple it is to set up columns for your data:

```svelte
<script lang="ts">
	import { reactiveTable } from 'svelte-reactive-table';

	const data = [
		{ id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
		{ id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' }
	];

	const columns = [
		{ accessor: 'id', header: 'ID' },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'age', header: 'Age' },
		{ accessor: 'email', header: 'Email' }
	];

	const table = reactiveTable(data, columns);
</script>
```

Each column maps directly to a property in your data objects. The `accessor` tells the table which data to show, and the `header` is what your users see at the top of each column.

## The Important Bit: Row Identification

For the best experience, mark one column as your row identifier:

```svelte
const columns = [
  { accessor: 'id', header: 'ID', isIdentifier: true },
  { accessor: 'name', header: 'Name' },
  // ...other columns
];
```

> **Why does this matter?** The identifier helps the table track individual rows reliably, especially when data changes. Think of it like a unique ID for each row.

If you don't specify an identifier, the first column becomes the identifier by default - but it's better to be explicit!

## Controlling Initial Visibility

Want some columns hidden when the table first loads? Use the column visibility plugin:

```svelte
import { reactiveTable, reactiveColumnVisibility } from 'svelte-reactive-table';

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

See the [Column Visibility](/docs/column-visibility) section for more details on managing column visibility.

## Dynamic Column Changes

You can update column definitions at any time:

```svelte
<script>
	function updateColumns() {
		table.columnDefs = [
			{ accessor: 'id', header: 'User ID', isIdentifier: true },
			{ accessor: 'name', header: 'Full Name' },
			{ accessor: 'age', header: 'Years' }
			// Email column removed
		];
	}
</script>
```

## TypeScript Support

When using TypeScript, columns are type-checked against your data:

```ts
type User = {
	id: number;
	name: string;
	age: number;
	email: string;
};

// Type error if you try to access a non-existent property
const columns: ColumnDef<User>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'age', header: 'Age' },
	{ accessor: 'email', header: 'Email' },
	{ accessor: 'phone', header: 'Phone' } // Error: property doesn't exist
];
```

## Working with Nested Data

When working with nested data, you'll need to flatten it for the table:

```svelte
<script>
	// Nested data structure
	const nestedData = [
		{
			id: 1,
			name: 'John Doe',
			contact: {
				email: 'john@example.com',
				phone: '555-1234'
			}
		}
	];

	// Flatten for the table
	const flattenedData = nestedData.map((item) => ({
		id: item.id,
		name: item.name,
		email: item.contact.email,
		phone: item.contact.phone
	}));

	const columns = [
		{ accessor: 'id', header: 'ID', isIdentifier: true },
		{ accessor: 'name', header: 'Name' },
		{ accessor: 'email', header: 'Email' },
		{ accessor: 'phone', header: 'Phone' }
	];

	const table = reactiveTable(flattenedData, columns);
</script>
```

## Column Information

The table provides properties for working with columns:

```svelte
<script>
	// All columns with their full definitions
	const allColumns = table.allColumns;

	// Only visible columns
	const visibleColumns = table.columns;

	// Column headers (from visible columns only)
	const headers = table.headers;
</script>
```

With proper column definitions, you have full control over what data is displayed and how it's organized in your table.
