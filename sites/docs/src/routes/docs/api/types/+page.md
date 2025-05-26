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

Svelte Reactive Table exports comprehensive TypeScript types that enable you to build fully type-safe tables with plugins. This reference documents all the types you'll encounter when working with the library.

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

The base type for a reactive table (internal use).

```ts
type ReactiveTable<T> = {
	/**
	 * The current data array (reactive)
	 */
	data: T[];

	/**
	 * The current column definitions (reactive)
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
};
```

### ReactiveTableWithPlugins

The main type returned by the `reactiveTable` function with plugin support.

```ts
type ReactiveTableWithPlugins<T, TPluginsMap = EmptyPluginsMap> = ReactiveTable<T> & {
	/**
	 * Registry of all installed plugins and their state
	 * Type-safe access to plugin states based on plugin ID
	 */
	plugins: TPluginsMap;

	/**
	 * Install a new plugin to the table
	 */
	use<TPluginId extends string, TPluginState>(
		plugin: TablePlugin<T, TPluginState, TPluginId>
	): ReactiveTableWithPlugins<T, TPluginsMap & Record<TPluginId, TPluginState>>;
};
```

## Plugin Types

### TablePlugin

Interface for creating plugins that extend table functionality.

```ts
interface TablePlugin<T, TPluginState, TPluginId extends string = string> {
	/**
	 * Unique identifier for this plugin
	 */
	readonly id: TPluginId;

	/**
	 * Initialize the plugin state
	 */
	init(getRows: () => Row<T>[], getColumns: () => Column<T>[]): PluginOutput<T, TPluginState>;
}
```

### PluginOutput

The output of initializing a plugin.

```ts
interface PluginOutput<T, TPluginState = unknown> {
	/**
	 * The state of the plugin which will be accessible via table.plugins[id]
	 */
	state: TPluginState;

	/**
	 * The rows transformed by the plugin
	 */
	rows: Row<T>[];

	/**
	 * The columns transformed by the plugin
	 */
	columns: Column<T>[];
}
```

### EmptyPluginsMap

Type representing no plugins installed.

```ts
type EmptyPluginsMap = Record<string, never>;
```

## Pagination Types

### PaginationState

The pagination state interface that provides pagination functionality.

```ts
type PaginationState = {
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
	 * Total number of items
	 */
	totalItems: number;

	/**
	 * Whether there is a previous page
	 */
	hasPreviousPage: boolean;

	/**
	 * Whether there is a next page
	 */
	hasNextPage: boolean;

	/**
	 * Whether the current page is the first page
	 */
	isFirstPage: boolean;

	/**
	 * Whether the current page is the last page
	 */
	isLastPage: boolean;

	/**
	 * Go to the previous page
	 */
	goToPreviousPage: () => void;

	/**
	 * Go to the next page
	 */
	goToNextPage: () => void;

	/**
	 * Go to the first page
	 */
	goToFirstPage: () => void;

	/**
	 * Go to the last page
	 */
	goToLastPage: () => void;

	/**
	 * Go to a specific page
	 */
	setPage: (page: number) => void;

	/**
	 * Set the page size
	 */
	setPageSize: (pageSize: number) => void;

	/**
	 * Range of items being displayed (1-based, inclusive)
	 */
	pageItemRange: {
		start: number;
		end: number;
	};
};
```

### PaginationOptions

Options for configuring pagination behavior.

```ts
interface PaginationOptions {
	/**
	 * Initial page index (0-based)
	 * @default 0
	 */
	page?: number;

	/**
	 * Initial number of items per page
	 * @default 10
	 */
	pageSize?: number;
}
```

## Column Visibility Types

### ColumnVisibilityState

The column visibility state interface.

```ts
type ColumnVisibilityState<T> = {
	/**
	 * Keys of columns that should be hidden
	 */
	hiddenColumns: (keyof T)[];

	/**
	 * Check if a column is visible
	 */
	isVisible: (accessor: keyof T) => boolean;

	/**
	 * Set the visibility of a specific column
	 */
	setVisibility: (accessor: keyof T, isVisible: boolean) => void;

	/**
	 * Toggle the visibility of a specific column
	 */
	toggleVisibility: (accessor: keyof T) => void;

	/**
	 * Set multiple columns as visible
	 */
	showColumns: (accessors: (keyof T)[]) => void;

	/**
	 * Set multiple columns as hidden
	 */
	hideColumns: (accessors: (keyof T)[]) => void;

	/**
	 * Set which columns should be visible, hiding all others
	 */
	setVisibleColumns: (accessors: (keyof T)[]) => void;

	/**
	 * Reset all columns to their default visibility
	 */
	resetVisibility: () => void;
};
```

### ColumnVisibilityOptions

Options for configuring column visibility behavior.

```ts
interface ColumnVisibilityOptions<T> {
	/**
	 * Initial hidden columns
	 */
	hiddenColumns?: (keyof T)[];
}
```

## Sorting Types

### SortDirection

Direction of sorting.

```ts
type SortDirection = 'asc' | 'desc' | 'none';
```

### ColumnSorting

Represents a column sorting configuration.

```ts
type ColumnSorting = {
	/**
	 * Key of the column to sort by
	 */
	key: string;

	/**
	 * Direction of the sort
	 */
	direction: SortDirection;
};
```

### SortingState

The sorting state interface.

```ts
type SortingState<T> = {
	/**
	 * Current column sortings
	 */
	columnSortings: ColumnSorting[];

	/**
	 * Whether multiple column sorting is enabled
	 */
	multiSort: boolean;

	/**
	 * Set the sorting for a column
	 */
	setSort: (accessor: keyof T, direction: SortDirection) => void;

	/**
	 * Toggle sort for a column (none -> asc -> desc -> none)
	 */
	toggleSort: (accessor: keyof T) => void;

	/**
	 * Clear all sorting
	 */
	clearSort: () => void;

	/**
	 * Get the current sort direction for a column
	 */
	getSortDirection: (accessor: keyof T) => SortDirection | 'none';
};
```

### Comparator

Function that compares two values for sorting.

```ts
type Comparator<T, K extends keyof T = keyof T> = (a: T[K], b: T[K]) => number;
```

### SortingOptions

Options for configuring sorting behavior.

```ts
interface SortingOptions<T> {
	/**
	 * Initial column sortings
	 */
	columnSortings?: ColumnSorting[];

	/**
	 * Whether multiple column sorting is enabled
	 * @default false
	 */
	multiSort?: boolean;

	/**
	 * Custom comparators for specific columns
	 */
	comparators?: {
		[K in keyof T]?: Comparator<T, K>;
	};
}
```

## Importing Types

Import the types you need from the library:

```ts
import {
	type ColumnDef,
	type ReactiveTableWithPlugins,
	type Row,
	type Cell,
	type PaginationState,
	type ColumnVisibilityState,
	type SortingState
	// Other types as needed
} from 'svelte-reactive-table';
```

## TypeScript Examples

### Basic Table with Types

```ts
import {
	reactiveTable,
	type ColumnDef,
	type ReactiveTableWithPlugins
} from 'svelte-reactive-table';

// Define your data type
type User = {
	id: number;
	name: string;
	email: string;
	age: number;
};

// Type-safe column definitions
const columns: ColumnDef<User>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'email', header: 'Email' },
	{ accessor: 'age', header: 'Age' }
];

// Create a basic typed table
const table: ReactiveTableWithPlugins<User> = reactiveTable(users, columns);
```

### Table with Plugins

```ts
import {
	reactiveTable,
	reactivePagination,
	reactiveColumnVisibility,
	reactiveSorting,
	type ColumnDef,
	type ReactiveTableWithPlugins,
	type PaginationState,
	type ColumnVisibilityState,
	type SortingState
} from 'svelte-reactive-table';

type User = {
	id: number;
	name: string;
	email: string;
	age: number;
};

const columns: ColumnDef<User>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'email', header: 'Email' },
	{ accessor: 'age', header: 'Age' }
];

// Create table with plugins - TypeScript infers the correct plugin types
const table = reactiveTable<User>(users, columns)
	.use(reactivePagination<User>({ pageSize: 10 }))
	.use(reactiveColumnVisibility<User>({ hiddenColumns: ['email'] }))
	.use(reactiveSorting<User>({ multiSort: true }));

// Access plugins with full type safety
const { pagination, columnVisibility, sorting } = table.plugins;

// All methods are properly typed
pagination.goToNextPage();
columnVisibility.toggleVisibility('email'); // ✓ Valid
columnVisibility.toggleVisibility('phone'); // ❌ Error: 'phone' not in User
sorting.setSort('age', 'desc');

// Access the current page of rows
const currentPageRows = table.rows;
```
