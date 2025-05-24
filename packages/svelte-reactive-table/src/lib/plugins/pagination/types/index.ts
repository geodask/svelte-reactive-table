/**
 * Pagination plugin ID
 */
export type PaginationPluginId = 'pagination';

/**
 * Pagination state for a table
 */
export type PaginationState = {
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
	 * Whether the current page is the last page
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

/**
 * Options for creating a pagination plugin
 */
export interface PaginationOptions {
	/**
	 * Initial page index (0-based)
	 */
	page?: number;

	/**
	 * Initial number of items per page
	 */
	pageSize?: number;
}
