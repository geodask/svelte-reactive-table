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

/**
 * Base type for a reactive table.
 *
 * @internal
 */
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
	 * All columns with their complete definitions
	 */
	allColumns: Column<T>[];
	/**
	 * The currently visible columns
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
};
