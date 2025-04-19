import { log, messages } from './internal/logger/index.js';

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
	 * The current rows of the table after applying pagination
	 * This is a subset of the allRows array, based on the current pagination settings.
	 */
	rows: Row<T>[];
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
	 * The current pagination state
	 */
	pagination: Pagination;
	/**
	 * The total number of pages based on the current pagination settings
	 */
	pageCount: number;
	/**
	 * The current page index (0-based)
	 */
	page: number;
	/**
	 * The number of rows per page
	 */
	pageSize: number;
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
	/**
	 * Set the current page index
	 * @param page - The new page index (0-based)
	 */
	setpage(page: number): void;
	/**
	 * Set the page size and optionally reset to the first page
	 * @param pageSize - The new page size
	 * @param resetpage - Whether to reset to the first page (default: true)
	 */
	setPageSize(pageSize: number, resetpage?: boolean): void;
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

export type Pagination = {
	/**
	 * Current page index (0-based)
	 */
	page: number;
	/**
	 * Number of rows per page
	 */
	pageSize: number;
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
	initialPagination?: Partial<Pagination>
): ReactiveTable<T> {
	let _data = $state(initialData);
	let _columnDefs = $state(columnDefs);
	let _pagination = $state<Pagination>({
		page: initialPagination?.page ?? 0,
		pageSize: initialPagination?.pageSize ?? 10
	});

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

	// Pagination derived values
	const pageCount = $derived(Math.ceil(allRows.length / _pagination.pageSize));
	const startRowIndex = $derived(_pagination.page * _pagination.pageSize);
	const endRowIndex = $derived(
		Math.min((_pagination.page + 1) * _pagination.pageSize, allRows.length)
	);

	const rows = $derived(allRows.slice(startRowIndex, endRowIndex));

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

	function setPage(page: number) {
		if (page < 0 || page >= pageCount) {
			log.warn(messages.invalid_page(page, pageCount));
			return;
		}
		_pagination = { ..._pagination, page: page };
	}

	function nextPage(): boolean {
		if (_pagination.page < pageCount - 1) {
			_pagination = { ..._pagination, page: _pagination.page + 1 };
			return true;
		}
		return false;
	}

	function previousPage(): boolean {
		if (_pagination.page > 0) {
			_pagination = { ..._pagination, page: _pagination.page - 1 };
			return true;
		}
		return false;
	}

	function firstPage() {
		_pagination = { ..._pagination, page: 0 };
	}

	function lastPage() {
		_pagination = { ..._pagination, page: Math.max(0, pageCount - 1) };
	}

	function setPageSize(pageSize: number, resetpage = true) {
		if (pageSize < 1) {
			log.warn(messages.invalid_page_size(pageSize));
			return;
		}

		_pagination = {
			..._pagination,
			pageSize,
			page: resetpage ? 0 : _pagination.page
		};
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
		get pagination() {
			return _pagination;
		},
		set pagination(value: Pagination) {
			_pagination = value;
		},
		get headers() {
			return headers;
		},
		get rows() {
			return rows;
		},
		get allRows() {
			return allRows;
		},
		get visibleColumns() {
			return visibleColumns;
		},
		get pageCount() {
			return pageCount;
		},
		get page() {
			return _pagination.page;
		},
		get pageSize() {
			return _pagination.pageSize;
		},
		// Column visibility methods
		setColumnVisibility,
		toggleColumnVisibility,
		// Pagination methods
		setpage: setPage,
		setPageSize,
		nextPage,
		previousPage,
		firstPage,
		lastPage
	};
}
