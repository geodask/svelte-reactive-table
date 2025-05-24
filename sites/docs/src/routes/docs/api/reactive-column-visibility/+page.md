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
			title: 'API Reference'
		},
		{
			title: 'reactiveColumnVisibility'
		}
	]);
</script>

# reactiveColumnVisibility

The `reactiveColumnVisibility` function creates column visibility management functionality for Svelte Reactive Table, allowing you to show and hide specific columns dynamically.

## Signature

```ts
function reactiveColumnVisibility<T>(
	options?: ColumnVisibilityOptions
): ReactiveColumnVisibilityFactory<T>;
```

## Parameters

| Parameter | Type                      | Description                                           |
| --------- | ------------------------- | ----------------------------------------------------- |
| `options` | `ColumnVisibilityOptions` | Optional configuration for column visibility behavior |

### ColumnVisibilityOptions

| Property        | Type       | Default | Description                            |
| --------------- | ---------- | ------- | -------------------------------------- |
| `hiddenColumns` | `string[]` | `[]`    | Array of column keys to hide initially |

## Return Value

Returns a factory function that creates column visibility functionality when passed to `reactiveTable`.

## Basic Usage

```svelte
<script lang="ts">
	import { reactiveTable, reactiveColumnVisibility } from 'svelte-reactive-table';

	const data = [
		/* Your data array */
	];
	const columns = [
		/* Your column definitions */
	];

	const table = reactiveTable(data, columns, {
		columnVisibility: reactiveColumnVisibility({
			hiddenColumns: ['age'] // Initially hide the age column
		})
	});
</script>

<!-- Column visibility controls -->
<div>
	<button onclick={() => table.columnVisibility.toggleColumnVisibility('age')}>
		{table.columnVisibility.isColumnVisible('age') ? 'Hide' : 'Show'} Age
	</button>
</div>

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

## Column Visibility Properties

When column visibility is enabled, these properties are available:

| Property                               | Type          | Description                      |
| -------------------------------------- | ------------- | -------------------------------- |
| `table.columnVisibility.hiddenColumns` | `(keyof T)[]` | Array of hidden column accessors |

## Column Visibility Methods

These methods are available on the table's `columnVisibility` object:

| Method                                                       | Return Type | Description                                    |
| ------------------------------------------------------------ | ----------- | ---------------------------------------------- |
| `isColumnVisible(accessor: keyof T)`                         | `boolean`   | Check if a specific column is visible          |
| `setColumnVisibility(accessor: keyof T, isVisible: boolean)` | `void`      | Set a specific column's visibility             |
| `toggleColumnVisibility(accessor: keyof T)`                  | `void`      | Toggle visibility of a specific column         |
| `showColumns(accessors: (keyof T)[])`                        | `void`      | Make multiple columns visible                  |
| `hideColumns(accessors: (keyof T)[])`                        | `void`      | Hide multiple columns                          |
| `setVisibleColumns(accessors: (keyof T)[])`                  | `void`      | Show only specified columns, hiding all others |
| `resetColumnVisibility()`                                    | `void`      | Reset all columns to their default visibility  |

## Example Controls

```svelte
<div class="column-controls">
	<!-- Toggle individual column -->
	<button onclick={() => table.columnVisibility.toggleColumnVisibility('age')}>
		Toggle Age Column
	</button>

	<!-- Reset all column visibility -->
	<button onclick={table.columnVisibility.resetColumnVisibility}> Show All Columns </button>

	<!-- Show only specific columns -->
	<button onclick={() => table.columnVisibility.setVisibleColumns(['name', 'email'])}>
		Show Only Name & Email
	</button>
</div>
```

## TypeScript Support

```ts
type User = {
	id: number;
	name: string;
	age: number;
	email: string;
};

const columnVisibility = reactiveColumnVisibility<User>({
	hiddenColumns: ['email']
});

const table = reactiveTable<User>(users, columns, { columnVisibility });
```
