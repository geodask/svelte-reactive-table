import { log, messages } from './internal/logger/index.js';
import {
	type ReactivePagination,
	type ReactivePaginationFactory,
	type ReactivePaginationOutput
} from './pagination.svelte.js';

// --------- Basic Data Types ---------

/**
 * Represents the definition of a column in the table.
 */
export type ColumnDef<T> = {
	/**
	 * Indicates whether this column contains the unique identifier for the row
	 * If not specified, defaults to `false`
	 */
	isIdentifier?: boolean;
	/**
	 * Key of the data property to access the value for this column
	 */
	accessor: keyof T;
	/**
	 * Text to display in the column header
	 */
	header: string;
	/**
	 * Controls whether the column is shown in the table
	 * If not specified, defaults to `true`
	 */
	visible?: boolean;
};

/**
 * Represents a column in the table.
 */
export type Column<T> = {
	[K in keyof Required<ColumnDef<T>>]: ColumnDef<T>[K];
};

/**
 * Represents a cell in the table.
 */
export type Cell<T> = {
	/**
	 * The accessor key for this cell's column
	 */
	key: keyof T;
	/**
	 * The data value for this cell
	 */
	value: T[keyof T];
};

/**
 * Represents a row in the table.
 */
export type Row<T> = {
	/**
	 * Unique identifier for the row, derived from the column marked as identifier or the first column
	 */
	id: T[keyof T];
	/**
	 * Reference to the original data item
	 */
	original: T;
	/**
	 * Array of cell objects containing the values for each visible column
	 */
	cells: Cell<T>[];
};

// --------- Configuration Types ---------

/**
 * Configuration options for the table
 */
export type TableOptions<T> = {
	pagination?: ReactivePaginationFactory<T>;
	// Future options can be added here
};

// --------- Feature Types ---------

/**
 * Feature type for pagination in a reactive table.
 *
 * @internal
 */
type PaginationFeature<T> = {
	/**
	 * The pagination object that returns the current state of pagination and provides methods to control it.
	 */
	pagination: ReactivePagination<T>;
};

// --------- Core Table Types ---------

/**
 * Base type for a reactive table.
 *
 * @internal
 */
type ReactiveTableBase<T> = {
	/**
	 * The current data array. This is the source of truth for the table.
	 * It is reactive, meaning that any changes to this array will automatically update the table.
	 */
	data: T[];
	/**
	 * The current column definitions. These define how the data is displayed in the table.
	 * It is reactive, meaning that any changes to this array will automatically update the table.
	 */
	columnDefs: ColumnDef<T>[];
	/**
	 * The current headers for the table
	 */
	headers: string[];
	/**
	 * The current columns of the table
	 */
	columns: Column<T>[];
	/**
	 * All rows of the table, including those that are not currently visible due to pagination
	 */
	allRows: Row<T>[];
	/**
	 * The currently visible rows of the table after applying features e.g. pagination, sorting, etc.
	 */
	rows: Row<T>[];
	/**
	 * The currently visible columns.
	 * This is a subset of the columns array, based on the current visibility settings.
	 */
	visibleColumns: ColumnDef<T>[];
	/**
	 * Set the visibility of a specific column
	 * @param accessor - The column accessor key
	 * @param isVisible - Whether the column should be visible
	 */
	setColumnVisibility(accessor: keyof T, isVisible: boolean): void;
	/**
	 * Toggle the visibility of a specific column
	 * @param accessor - The column accessor key
	 */
	toggleColumnVisibility(accessor: keyof T): void;
};

/**
 * Type representing a `Reactive Table` with optional features.
 *
 * @template T - The type of data items in the table
 * @template Options - Configuration options for the table, defaults to empty object
 */
export type ReactiveTable<T, Options extends TableOptions<T> = {}> = ReactiveTableBase<T> &
	(Options['pagination'] extends ReactivePaginationFactory<T> ? PaginationFeature<T> : {});

/**
 * Creates a reactive table that automatically updates with data changes.
 *
 * @param initialData - Initial array of data items to populate the table
 * @param columnDefs - Column definitions that specify how to display and interact with data
 * @param options - Optional configuration settings
 * @returns A fully reactive table with features based on provided options
 */
export function reactiveTable<T, Options extends TableOptions<T> = {}>(
	initialData: T[],
	columnDefs: ColumnDef<T>[],
	options: Options = {} as Options
): ReactiveTable<T, Options> {
	let _data = $state(initialData);
	let _columnDefs = $state(columnDefs);

	let columns: Column<T>[] = $derived(
		_columnDefs.map((col) => ({
			...col,
			visible: col.visible ?? true,
			isIdentifier: col.isIdentifier ?? false
		}))
	);

	const identifierColumn = $derived.by(() => {
		const identifier = _columnDefs.find((col) => col.isIdentifier);
		if (!identifier) {
			log.warn(messages.no_identifier_column());
		}
		return identifier;
	});

	const items = $derived(_data);

	// Only include visible columns (defaulting to true if not specified)
	const visibleColumns = $derived(columns.filter((column) => column.visible !== false));

	const headers = $derived<string[]>(visibleColumns.map((column) => column.header));

	const allRows = $derived.by(() => {
		return items.map((item) => {
			const identifierAccessor = identifierColumn?.accessor || columns[0].accessor;

			if (item[identifierAccessor] === undefined || item[identifierAccessor] === null) {
				log.error(
					messages.missing_identifier_value(String(identifierAccessor)),
					$state.snapshot(item)
				);
			}

			return {
				id: item[identifierAccessor],
				original: item,
				cells: visibleColumns.map((column) => {
					return {
						key: column.accessor,
						value: item[column.accessor]
					};
				})
			};
		});
	});

	function setColumnVisibility(accessor: keyof T, isVisible: boolean) {
		columns = columns.map((col) => {
			if (col.accessor === accessor) {
				return { ...col, visible: isVisible };
			}
			return col;
		});
	}

	function toggleColumnVisibility(accessor: keyof T) {
		columns = columns.map((col) => {
			if (col.accessor === accessor) {
				return { ...col, visible: col.visible === false ? true : false };
			}
			return col;
		});
	}

	// Apply features and get the processed rows
	// Start with all rows
	let getDisplayRows = () => allRows;

	// Add pagination if option is provided
	let paginationOutput: ReactivePaginationOutput<T> | undefined;
	if (options.pagination) {
		paginationOutput = options.pagination(() => allRows);
		getDisplayRows = () => paginationOutput!.rows;
	}

	// Future features would be applied here in the proper order:
	// 1. Sorting would be applied to allRows
	// 2. Pagination would be applied to the sorted rows
	// 3. etc.

	// Now create the table object with the proper rows getter
	const table: ReactiveTableBase<T> = {
		set data(value: T[]) {
			_data = value;
		},
		get data() {
			return _data;
		},
		set columnDefs(value: ColumnDef<T>[]) {
			_columnDefs = value;
		},
		get columnDefs() {
			return _columnDefs;
		},
		get columns() {
			return columns;
		},
		get headers() {
			return headers;
		},
		get allRows() {
			return allRows;
		},
		get rows() {
			return getDisplayRows();
		},
		get visibleColumns() {
			return visibleColumns;
		},
		// Column visibility methods
		setColumnVisibility,
		toggleColumnVisibility
	};

	// Add features to the table
	const tableWithFeatures = table as unknown as ReactiveTable<T, Options>;

	// Add pagination object to the table if it was provided
	if (paginationOutput) {
		(tableWithFeatures as ReactiveTableBase<T> & PaginationFeature<T>).pagination =
			paginationOutput.state;
	}

	return tableWithFeatures;
}
