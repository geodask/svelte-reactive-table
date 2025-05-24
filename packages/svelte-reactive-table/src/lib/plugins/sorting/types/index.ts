/**
 * Sorting plugin ID
 */
export type SortingPluginId = 'sorting';

/**
 * Direction of sorting
 */
export type SortDirection = 'asc' | 'desc' | 'none';

/**
 * Represents a column sorting configuration
 */
export type ColumnSorting = {
	/**
	 * Key of the column to sort by
	 */
	key: string;

	/**
	 * Direction of the sort
	 */
	direction: SortDirection;
};

/**
 * Sorting state for a table
 */
export type SortingState<T> = {
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

/**
 * Function that compares two values for sorting
 */
export type Comparator<T, K extends keyof T = keyof T> = (a: T[K], b: T[K]) => number;

/**
 * Options for creating a sorting plugin
 */
export interface SortingOptions<T> {
	/**
	 * Initial column sortings
	 */
	columnSortings?: ColumnSorting[];

	/**
	 * Whether multiple column sorting is enabled
	 */
	multiSort?: boolean;

	/**
	 * Custom comparators for specific columns
	 */
	comparators?: {
		[K in keyof T]?: Comparator<T, K>;
	};
}
