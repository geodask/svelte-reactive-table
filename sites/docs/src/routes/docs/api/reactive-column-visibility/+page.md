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

The `reactiveColumnVisibility` function creates a column visibility plugin for table instances, enabling dynamic control over which columns are displayed.

## Signature

```ts
function reactiveColumnVisibility<T>(
	options?: ColumnVisibilityOptions<T>
): TablePlugin<T, ColumnVisibilityState<T>, 'columnVisibility'>;
```

## Parameters

| Parameter | Type                         | Description                                           |
| --------- | ---------------------------- | ----------------------------------------------------- |
| `options` | `ColumnVisibilityOptions<T>` | Optional configuration for column visibility behavior |

### ColumnVisibilityOptions

| Property        | Type          | Default | Description                            |
| --------------- | ------------- | ------- | -------------------------------------- |
| `hiddenColumns` | `(keyof T)[]` | `[]`    | Array of column keys to hide initially |

## Return Value

Returns a TablePlugin that adds column visibility functionality when passed to the `use` method of the table.

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

	// Create a table with column visibility plugin
	const table = reactiveTable(data, columns).use(
		reactiveColumnVisibility({
			hiddenColumns: ['age'] // Initially hide the age column
		})
	);

	// Access the column visibility API through table.plugins
	const { columnVisibility } = table.plugins;
</script>

<!-- Column visibility controls -->
<div>
	<button onclick={() => columnVisibility.toggleVisibility('age')}>
		{columnVisibility.isVisible('age') ? 'Hide' : 'Show'} Age
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

When column visibility plugin is used, these properties are available:

| Property                         | Type          | Description                      |
| -------------------------------- | ------------- | -------------------------------- |
| `columnVisibility.hiddenColumns` | `(keyof T)[]` | Array of hidden column accessors |

## Column Visibility Methods

These methods are available on the columnVisibility plugin state:

| Method                                                 | Return Type | Description                                    |
| ------------------------------------------------------ | ----------- | ---------------------------------------------- |
| `isVisible(accessor: keyof T)`                         | `boolean`   | Check if a specific column is visible          |
| `setVisibility(accessor: keyof T, isVisible: boolean)` | `void`      | Set a specific column's visibility             |
| `toggleVisibility(accessor: keyof T)`                  | `void`      | Toggle visibility of a specific column         |
| `showColumn(accessor: keyof T)`                        | `void`      | Make a column visible                          |
| `hideColumn(accessor: keyof T)`                        | `void`      | Hide a column                                  |
| `showColumns(accessors: (keyof T)[])`                  | `void`      | Make multiple columns visible                  |
| `hideColumns(accessors: (keyof T)[])`                  | `void`      | Hide multiple columns                          |
| `setVisibleColumns(accessors: (keyof T)[])`            | `void`      | Show only specified columns, hiding all others |
| `resetVisibility()`                                    | `void`      | Reset all columns to their default visibility  |

## Example Controls

```svelte
<div class="column-controls">
	<!-- Toggle individual column -->
	<button onclick={() => columnVisibility.toggleVisibility('age')}> Toggle Age Column </button>

	<!-- Reset all column visibility -->
	<button onclick={columnVisibility.resetVisibility}> Show All Columns </button>

	<!-- Show only specific columns -->
	<button onclick={() => columnVisibility.setVisibleColumns(['name', 'email'])}>
		Show Only Name & Email
	</button>
</div>
```

## Column Selector Interface

Complete implementation of a column visibility selector:

```svelte
<div class="column-selector">
	<h3>Visible Columns</h3>
	<div class="column-checkboxes">
		{#each table.allColumns as column}
			<label class="column-toggle">
				<input
					type="checkbox"
					checked={columnVisibility.isVisible(column.accessor)}
					onchange={() => columnVisibility.toggleVisibility(column.accessor)}
				/>
				<span>{column.header}</span>
			</label>
		{/each}
	</div>

	<div class="column-actions">
		<button onclick={columnVisibility.resetVisibility}> Show All </button>
		<button onclick={() => columnVisibility.hideColumns(['age', 'email'])}>
			Hide Personal Info
		</button>
	</div>
</div>

<style>
	.column-selector {
		padding: 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		background: #f8fafc;
	}

	.column-checkboxes {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.column-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.column-actions {
		display: flex;
		gap: 0.5rem;
	}
</style>
```

## Batch Operations Example

```svelte
<script>
	// Predefined column groups for quick toggling
	const columnGroups = {
		personal: ['name', 'age', 'email'],
		work: ['department', 'position', 'salary'],
		contact: ['email', 'phone', 'address']
	};

	function showGroup(groupName) {
		const columns = columnGroups[groupName];
		columnVisibility.showColumns(columns);
	}

	function hideGroup(groupName) {
		const columns = columnGroups[groupName];
		columnVisibility.hideColumns(columns);
	}

	function showOnlyGroup(groupName) {
		const columns = columnGroups[groupName];
		columnVisibility.setVisibleColumns(columns);
	}
</script>

<div class="group-controls">
	{#each Object.keys(columnGroups) as groupName}
		<div class="group-actions">
			<span>{groupName}:</span>
			<button onclick={() => showGroup(groupName)}>Show</button>
			<button onclick={() => hideGroup(groupName)}>Hide</button>
			<button onclick={() => showOnlyGroup(groupName)}>Only</button>
		</div>
	{/each}
</div>
```

## TypeScript Support

```ts
import { reactiveTable, reactiveColumnVisibility } from 'svelte-reactive-table';

type User = {
	id: number;
	name: string;
	age: number;
	email: string;
};

const table = reactiveTable<User>(users, columns).use(
	reactiveColumnVisibility<User>({
		hiddenColumns: ['email']
	})
);

// TypeScript will infer the correct column visibility state type
const { columnVisibility } = table.plugins;
```
