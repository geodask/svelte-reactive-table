import type { Column } from './table.svelte.js';

/**
 * Column visibility state
 */
export type ColumnVisibility = {
	/**
	 * Keys of columns that should be hidden
	 */
	hiddenColumns: string[];
};

/**
 * The type of the column visibility object
 * @template T - The type of the data in the table
 */
export type ReactiveColumnVisibility<T> = {
	/**
	 * Array of hidden column accessors
	 */
	hiddenColumns: (keyof T)[];

	/**
	 * Check if a column is visible
	 * @param accessor - The column accessor
	 */
	isColumnVisible(accessor: keyof T): boolean;

	/**
	 * Set the visibility of a specific column
	 * @param accessor - The column accessor
	 * @param isVisible - Whether the column should be visible
	 */
	setColumnVisibility(accessor: keyof T, isVisible: boolean): void;

	/**
	 * Toggle the visibility of a specific column
	 * @param accessor - The column accessor
	 */
	toggleColumnVisibility(accessor: keyof T): void;

	/**
	 * Set multiple columns as visible
	 * @param accessors - Array of column accessors to make visible
	 */
	showColumns(accessors: (keyof T)[]): void;

	/**
	 * Set multiple columns as hidden
	 * @param accessors - Array of column accessors to hide
	 */
	hideColumns(accessors: (keyof T)[]): void;

	/**
	 * Set which columns should be visible, hiding all others
	 * @param accessors - Array of column accessors that should be visible
	 */
	setVisibleColumns(accessors: (keyof T)[]): void;

	/**
	 * Reset all columns to their default visibility
	 */
	resetColumnVisibility(): void;
};

/**
 * The type of the reactive column visibility output
 * @template T - The type of the data in the table
 */
export type ReactiveColumnVisibilityOutput<T> = {
	/**
	 * The filtered columns based on visibility settings
	 */
	columns: Column<T>[];

	/**
	 * The current column visibility state
	 */
	state: ReactiveColumnVisibility<T>;
};

/**
 * Factory function for creating a reactive column visibility object
 */
export type ReactiveColumnVisibilityFactory<T> = (
	getColumns: () => Column<T>[]
) => ReactiveColumnVisibilityOutput<T>;

/**
 * Creates a column visibility object that manages which columns are visible
 *
 * @internal
 * @template T - The type of the data in the table
 * @param getColumns - A getter for the columns
 * @param options - Options for the column visibility
 * @returns A column visibility object that manages which columns are visible
 */
function createColumnVisibility<T>(
	getColumns: () => Column<T>[],
	options: Partial<ColumnVisibility> = {}
): ReactiveColumnVisibilityOutput<T> {
	// Initialize state with hidden columns from options
	let _visibilityState = $state<ColumnVisibility>({
		hiddenColumns: options?.hiddenColumns ?? []
	});

	// Get all columns
	const columns = $derived(getColumns());

	function isColumnVisible(accessor: keyof T): boolean {
		return !_visibilityState.hiddenColumns.includes(accessor as string);
	}

	function setColumnVisibility(accessor: keyof T, isVisible: boolean): void {
		const accessorStr = accessor as string;
		if (isVisible) {
			// If making visible, remove from hidden columns
			_visibilityState.hiddenColumns = _visibilityState.hiddenColumns.filter(
				(col) => col !== accessorStr
			);
		} else {
			// If making hidden, add to hidden columns (if not already there)
			if (!_visibilityState.hiddenColumns.includes(accessorStr)) {
				_visibilityState.hiddenColumns.push(accessorStr);
			}
		}
	}

	function toggleColumnVisibility(accessor: keyof T): void {
		setColumnVisibility(accessor, !isColumnVisible(accessor));
	}

	function showColumns(accessors: (keyof T)[]): void {
		const accessorsStr = accessors.map((accessor) => accessor as string);
		_visibilityState.hiddenColumns = _visibilityState.hiddenColumns.filter(
			(col) => !accessorsStr.includes(col)
		);
	}

	function hideColumns(accessors: (keyof T)[]): void {
		const accessorsStr = accessors.map((accessor) => accessor as string);
		const newHidden = accessorsStr.filter((col) => !_visibilityState.hiddenColumns.includes(col));
		if (newHidden.length > 0) {
			_visibilityState.hiddenColumns.push(...newHidden);
		}
	}

	function setVisibleColumns(accessors: (keyof T)[]): void {
		const accessorsStr = accessors.map((accessor) => accessor as string);
		const allColumnKeys = columns.map((col) => col.accessor as string);

		// Hide all columns except those specified
		const newHiddenColumns = allColumnKeys.filter((col) => !accessorsStr.includes(col));
		_visibilityState.hiddenColumns = newHiddenColumns;
	}

	function resetColumnVisibility(): void {
		_visibilityState.hiddenColumns = [];
	}

	return {
		get columns() {
			return columns.filter((col) => isColumnVisible(col.accessor));
		},
		state: {
			get hiddenColumns() {
				return _visibilityState.hiddenColumns as (keyof T)[];
			},
			isColumnVisible,
			setColumnVisibility,
			toggleColumnVisibility,
			showColumns,
			hideColumns,
			setVisibleColumns,
			resetColumnVisibility
		}
	};
}

/**
 * Creates column visibility functionality for a reactive table
 *
 * @template T - The type of the data in the table
 * @param options - Options for the column visibility
 * @returns A factory function that creates a reactive column visibility object
 */
export function reactiveColumnVisibility<T>(
	options: Partial<ColumnVisibility> = {}
): ReactiveColumnVisibilityFactory<T> {
	return (getColumns: () => Column<T>[]) => createColumnVisibility(getColumns, options);
}
