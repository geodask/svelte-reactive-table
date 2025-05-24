/**
 * Column visibility plugin ID
 */
export type ColumnVisibilityPluginId = 'columnVisibility';

/**
 * Column visibility state
 */
export type ColumnVisibilityState<T> = {
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

/**
 * Options for creating a column visibility plugin
 */
export interface ColumnVisibilityOptions<T> {
	/**
	 * Initial hidden columns
	 */
	hiddenColumns?: (keyof T)[];
}
