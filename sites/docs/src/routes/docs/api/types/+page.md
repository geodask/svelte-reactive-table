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
			title: 'API Reference',
		},
		{
			title: 'Types'
		}
	])
</script>

# Types

Svelte Reactive Table exports several TypeScript types that help you build type-safe tables. This reference documents the main types you'll encounter when working with the library.

## Core Types

### ColumnDef

Defines a column in the table.

```ts
type ColumnDef<T> = {
	/**
	 * Key of the data property to display in this column
	 */
	accessor: keyof T;

	/**
	 * Text to display in the column header
	 */
	header: string;

	/**
	 * Indicates whether this column contains the unique identifier for the row
	 * @default false
	 */
	isIdentifier?: boolean;
};
```

### Column

Represents a fully resolved column with all required properties.

```ts
type Column<T> = {
	accessor: keyof T;
	header: string;
	isIdentifier: boolean;
};
```

### Cell

Represents a cell in the table.

```ts
type Cell<T> = {
	/**
	 * The accessor key for this cell's column
	 */
	key: keyof T;

	/**
	 * The data value for this cell
	 */
	value: T[keyof T];
};
```

### Row

Represents a row in the table.

```ts
type Row<T> = {
	/**
	 * Unique identifier for the row
	 */
	id: T[keyof T];

	/**
	 * Reference to the original data item
	 */
	original: T;

	/**
	 * Array of cell objects for visible columns
	 */
	cells: Cell<T>[];
};
```

## Table Types

### ReactiveTable

The main type returned by the `reactiveTable` function.

```ts
type ReactiveTable<T, Options extends TableOptions<T> = {}> = {
	/**
	 * The current data array
	 */
	data: T[];

	/**
	 * The current column definitions
	 */
	columnDefs: ColumnDef<T>[];

	/**
	 * The current headers for visible columns
	 */
	headers: string[];

	/**
	 * All columns with their full configuration
	 */
	allColumns: Column<T>[];

	/**
	 * Only columns that are currently visible
	 */
	columns: Column<T>[];

	/**
	 * All rows, including those not visible due to pagination
	 */
	allRows: Row<T>[];

	/**
	 * Rows after applying active features (pagination, sorting, etc.)
	 */
	rows: Row<T>[];

	/**
	 * Pagination properties and methods (only when pagination is enabled)
	 */
	pagination?: ReactivePagination<T>;

	/**
	 * Column visibility properties and methods (only when column visibility is enabled)
	 */
	columnVisibility?: ReactiveColumnVisibility<T>;
};
```

### TableOptions

Configuration options for the table.

```ts
type TableOptions<T> = {
	/**
	 * Optional pagination factory
	 */
	pagination?: ReactivePaginationFactory<T>;

	/**
	 * Optional column visibility factory
	 */
	columnVisibility?: ReactiveColumnVisibilityFactory<T>;
};
```

## Pagination Types

### ReactivePagination

The pagination interface that provides pagination functionality.

```ts
type ReactivePagination<T> = {
	/**
	 * Current page index (0-based)
	 */
	page: number;

	/**
	 * Number of items per page
	 */
	pageSize: number;

	/**
	 * Total number of pages
	 */
	pageCount: number;

	/**
	 * Go to the next page
	 * @returns Whether the page was changed
	 */
	nextPage(): boolean;

	/**
	 * Go to the previous page
	 * @returns Whether the page was changed
	 */
	previousPage(): boolean;

	/**
	 * Go to the first page
	 */
	firstPage(): void;

	/**
	 * Go to the last page
	 */
	lastPage(): void;

	/**
	 * Go to a specific page
	 */
	setPage(page: number): void;

	/**
	 * Change the page size
	 * @param resetPage If true (default), resets to first page
	 */
	setPageSize(size: number, resetPage?: boolean): void;
};
```

### PaginationOptions

Options for configuring pagination behavior.

```ts
type PaginationOptions = {
	/**
	 * Number of items per page
	 * @default 10
	 */
	pageSize?: number;

	/**
	 * Initial page index (0-based)
	 * @default 0
	 */
	page?: number;
};
```

## Importing Types

Import the types you need from the library:

```ts
import {
	type ColumnDef,
	type ReactiveTable,
	type Row,
	type Cell
	// Other types as needed
} from 'svelte-reactive-table';
```

## TypeScript Example

```ts
import {
	reactiveTable,
	reactivePagination,
	reactiveColumnVisibility,
	type ColumnDef,
	type ReactiveTable
} from 'svelte-reactive-table';

// Define your data type
type User = {
	id: number;
	name: string;
	email: string;
};

// Type-safe column definitions
const columns: ColumnDef<User>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'email', header: 'Email' }
];

// Create a typed table with pagination and column visibility
const table: ReactiveTable<User> = reactiveTable(users, columns, {
	pagination: reactivePagination<User>({ pageSize: 10 }),
	columnVisibility: reactiveColumnVisibility<User>()
});

// TypeScript provides full type-checking for column visibility
table.columnVisibility.toggleColumnVisibility('email'); // ✓ Valid
table.columnVisibility.toggleColumnVisibility('phone'); // ❌ Error: 'phone' not in User

// Pagination is properly typed
if (table.pagination) {
	table.pagination.nextPage();
}

// Access the current page of rows
const currentPageRows = table.rows;
```

## Plugin Types

### TablePlugin

Core interface for implementing plugins:

```ts
interface TablePlugin<T, TPluginState, TPluginId extends string = string> {
	readonly id: TPluginId;
	init(getRows: () => Row<T>[], getColumns: () => Column<T>[]): PluginOutput<T, TPluginState>;
}
```

| Type Parameter | Description                          |
| -------------- | ------------------------------------ |
| `T`            | Type of data items in the table      |
| `TPluginState` | Type of state managed by this plugin |
| `TPluginId`    | String literal type for plugin ID    |

#### Properties

| Name | Type        | Description                      |
| ---- | ----------- | -------------------------------- |
| `id` | `TPluginId` | Unique identifier for the plugin |

#### Methods

| Name   | Parameters                                                   | Return Type                     | Description                                                |
| ------ | ------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------- |
| `init` | `getRows: () => Row<T>[]`<br>`getColumns: () => Column<T>[]` | `PluginOutput<T, TPluginState>` | Initialize plugin and return its state and transformations |

### PluginOutput

Interface defining plugin initialization output:

```ts
interface PluginOutput<T, TPluginState = unknown> {
	state: TPluginState;
	rows: Row<T>[];
	columns: Column<T>[];
}
```

| Property  | Type           | Description                                                  |
| --------- | -------------- | ------------------------------------------------------------ |
| `state`   | `TPluginState` | Plugin state that will be accessible via `table.plugins[id]` |
| `rows`    | `Row<T>[]`     | Transformed rows that will be used for rendering             |
| `columns` | `Column<T>[]`  | Transformed columns that will be used for rendering          |

### ReactiveTableWithPlugins

Type definition for a table instance with plugins:

```ts
type ReactiveTableWithPlugins<
	T,
	TPluginsMap extends Record<string, unknown> = EmptyPluginsMap
> = ReactiveTable<T> & {
	plugins: TPluginsMap;
	use<TPluginId extends string, TPluginState>(
		plugin: TablePlugin<T, TPluginState, TPluginId>
	): ReactiveTableWithPlugins<T, TPluginsMap & Record<TPluginId, TPluginState>>;
};
```

| Property  | Type                                                                                                     | Description                                            |
| --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `plugins` | `TPluginsMap`                                                                                            | Registry of installed plugins and their state          |
| `use`     | `<TPluginId, TPluginState>(plugin: TablePlugin<T, TPluginState, TPluginId>) => ReactiveTableWithPlugins` | Install a new plugin and return updated table instance |

### EmptyPluginsMap

Type representing an empty plugin registry:

```ts
type EmptyPluginsMap = Record<string, never>;
```
