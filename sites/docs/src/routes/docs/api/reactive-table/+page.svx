---
layout: docPage
---

# reactiveTable

The `reactiveTable` function is the core API of Svelte Reactive Table. It creates a fully reactive table instance that automatically updates when your data changes.

## Signature

```ts
function reactiveTable<T, Options extends TableOptions<T> = {}>(
	initialData: T[],
	columnDefs: ColumnDef<T>[],
	options?: Options
): ReactiveTable<T, Options>;
```

## Parameters

| Parameter     | Type              | Description                                        |
| ------------- | ----------------- | -------------------------------------------------- |
| `initialData` | `T[]`             | Array of data items to populate the table          |
| `columnDefs`  | `ColumnDef<T>[]`  | Column definitions specifying what data to display |
| `options`     | `TableOptions<T>` | Optional configuration settings (e.g., pagination) |

## Return Value

Returns a `ReactiveTable<T, Options>` instance with reactive properties and methods.

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

## Adding Pagination

To add pagination to your table:

```svelte
<script>
	import { reactiveTable, reactivePagination } from 'svelte-reactive-table';

	const table = reactiveTable(data, columns, {
		pagination: reactivePagination({
			pageSize: 10,
			page: 0
		})
	});
</script>
```

For detailed pagination properties and methods, see the [reactivePagination API reference](/docs/api/reactive-pagination).

## Properties

| Property     | Type             | Description                                                     |
| ------------ | ---------------- | --------------------------------------------------------------- |
| `data`       | `T[]`            | Current data array (reactive)                                   |
| `columnDefs` | `ColumnDef<T>[]` | Current column definitions (reactive)                           |
| `allColumns` | `Column<T>[]`    | All columns with their full configuration                       |
| `columns`    | `Column<T>[]`    | Only columns that are currently visible                         |
| `headers`    | `string[]`       | Array of header texts from visible columns                      |
| `allRows`    | `Row<T>[]`       | Array of all rows with their cells                              |
| `rows`       | `Row<T>[]`       | Rows after applying active features (pagination, sorting, etc.) |

## Methods

| Method                                                       | Return Type | Description                            |
| ------------------------------------------------------------ | ----------- | -------------------------------------- |
| `setColumnVisibility(accessor: keyof T, isVisible: boolean)` | `void`      | Show or hide a specific column         |
| `toggleColumnVisibility(accessor: keyof T)`                  | `void`      | Toggle visibility of a specific column |

## Examples

### Basic Table

```svelte
const table = reactiveTable(data, columns);
```

### With Pagination

```svelte
const table = reactiveTable(
  data,
  columns,
  {
    pagination: reactivePagination({ pageSize: 10 })
  }
);
```

### With TypeScript

```ts
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
