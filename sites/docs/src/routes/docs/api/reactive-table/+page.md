---
layout: docPage
---

<script lang="ts">
	import { reactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte'
	import WhatsNext from '$widgets/whats-next/whats-next.svelte'
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
			title: 'reactiveTable',
			route: '/docs/api/reactive-table'
		}
	])
</script>

# reactiveTable

The `reactiveTable` function is the core of Svelte Reactive Table. It creates a fully reactive table instance that automatically updates when your data changes and can be extended with plugins to add features like sorting, pagination, and column visibility.

## Signature

```ts
function reactiveTable<T>(
	initialData: T[],
	columnDefs: ColumnDef<T>[]
): ReactiveTableWithPlugins<T>;
```

## Parameters

| Parameter     | Type             | Description                                        |
| ------------- | ---------------- | -------------------------------------------------- |
| `initialData` | `T[]`            | Array of data items to populate the table          |
| `columnDefs`  | `ColumnDef<T>[]` | Column definitions specifying what data to display |

## Return Value

Returns a `ReactiveTableWithPlugins<T>` instance with reactive properties, methods, and plugin support.

## Basic Usage

```svelte
<script lang="ts">
	import { reactiveTable } from 'svelte-reactive-table';

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
</script>

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

## Adding Plugins

Svelte Reactive Table uses a flexible plugin architecture to extend functionality. Plugins are added using the `use` method:

```svelte
<script>
	import { reactiveTable, reactivePagination } from 'svelte-reactive-table';

	const table = reactiveTable(data, columns).use(
		reactivePagination({
			pageSize: 10,
			page: 0
		})
	);

	// Access the pagination API through table.plugins
	const { pagination } = table.plugins;
</script>
```

For detailed pagination properties and methods, see the [reactivePagination API reference](/docs/api/reactive-pagination).

## Properties

| Property     | Type                      | Description                                                     |
| ------------ | ------------------------- | --------------------------------------------------------------- |
| `data`       | `T[]`                     | Current data array (reactive)                                   |
| `columnDefs` | `ColumnDef<T>[]`          | Current column definitions (reactive)                           |
| `allColumns` | `Column<T>[]`             | All columns with their full configuration                       |
| `columns`    | `Column<T>[]`             | Only columns that are currently visible                         |
| `headers`    | `string[]`                | Array of header texts from visible columns                      |
| `allRows`    | `Row<T>[]`                | Array of all rows with their cells                              |
| `rows`       | `Row<T>[]`                | Rows after applying active features (pagination, sorting, etc.) |
| `plugins`    | `Record<string, unknown>` | Registry of all installed plugins and their state               |

## Methods

| Method        | Return Type                   | Description                   |
| ------------- | ----------------------------- | ----------------------------- |
| `use(plugin)` | `ReactiveTableWithPlugins<T>` | Install a plugin to the table |

## Examples

### Basic Table

```svelte
const table = reactiveTable(data, columns);
```

### With Plugins

```svelte
const table = reactiveTable(data, columns)
  .use(reactiveColumnVisibility())
  .use(reactiveSorting())
  .use(reactivePagination({ pageSize: 10 }));

// Access plugins through the plugins property
const { columnVisibility, sorting, pagination } = table.plugins;
```

### With TypeScript

```ts
import {
	reactiveTable,
	type ColumnDef,
	type ReactiveTableWithPlugins
} from 'svelte-reactive-table';

type User = {
	id: number;
	name: string;
	age: number;
};

const columns: ColumnDef<User>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'age', header: 'Age' }
];

const table = reactiveTable<User>(users, columns);
```
