import { log, messages } from './internal/logger/index.js';
import { type ReactivePagination, type ReactivePaginationFactory } from './pagination.svelte.js';

export type ReactiveTable<T> = {
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
	 * The currently visible columns.
	 * This is a subset of the columns array, based on the current visibility settings.
	 */
	visibleColumns: ColumnDef<T>[];
	/**
	 * The pagination object that manages the current page, page size, and the rows that are currently visible.
	 */
	pagination: ReactivePagination<T>;

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
 * Creates a reactive table that automatically updates with data changes.
 *
 * @param initialData - Initial array of data items to populate the table
 * @param columnDefs - Column definitions that specify how to display and interact with data
 * @param initialPagination - Optional initial pagination settings
 * @returns A fully reactive table
 */
export function reactiveTable<T>(
	initialData: T[],
	columnDefs: ColumnDef<T>[],
	paginationFactory: ReactivePaginationFactory<T>
): ReactiveTable<T> {
	let _data = $state(initialData);
	let _columnDefs = $state(columnDefs);

	let columns: Column<T>[] = $derived(
		columnDefs.map((col) => ({
			...col,
			visible: col.visible ?? true,
			isIdentifier: col.isIdentifier ?? false
		}))
	);

	const identifierColumn = columnDefs.find((col) => col.isIdentifier);

	if (!identifierColumn) {
		log.warn(messages.no_identifier_column());
	}

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

	return {
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
		get visibleColumns() {
			return visibleColumns;
		},
		// Column visibility methods
		setColumnVisibility,
		toggleColumnVisibility,
		pagination: paginationFactory(() => allRows)
	};
}
