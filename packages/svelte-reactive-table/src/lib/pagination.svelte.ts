import { log, messages } from './internal/logger/index.js';
import type { Row } from './table.svelte.js';

/**
 * The type of the pagination object
 * @template T - The type of the data in the table
 */
export type ReactivePagination<T> = {
	/**
	 * The current page index (0-based)
	 */
	page: number;
	/**
	 * The number of rows per page
	 */
	pageSize: number;
	/**
	 * The total number of pages based on the current pagination settings
	 */
	pageCount: number;
	/**
	 * The rows based on the current pagination settings
	 */
	rows: Row<T>[];
	/**
	 * Set the current page index
	 * @param page - The new page index (0-based)
	 */
	setPage(page: number): void;
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
 * Pagination options for the table
 */
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
 * Creates a pagination object that manages the current page, page size, and the rows that are currently visible
 * 
 * @internal
 * @template T - The type of the data in the table
 * @param getAllRows - A function that returns all rows in the table
 * @param initialPagination - Initial pagination options
 * @returns A pagination object that manages the current page, page size, and the rows that are currently visible
 */
function createPagination<T>(
	getAllRows: () => Row<T>[],
	initialPagination: Partial<Pagination>
): ReactivePagination<T> {
	//Move row into a separate file
	let _pagination = $state<Pagination>({
		page: initialPagination?.page ?? 0,
		pageSize: initialPagination?.pageSize ?? 10
	});

	const allRows = $derived(getAllRows());

	const pageCount = $derived(Math.ceil(allRows.length / _pagination.pageSize));
	const startRowIndex = $derived(_pagination.page * _pagination.pageSize);
	const endRowIndex = $derived(
		Math.min((_pagination.page + 1) * _pagination.pageSize, allRows.length)
	);

	const rows = $derived(allRows.slice(startRowIndex, endRowIndex));

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
		get pageCount() {
			return pageCount;
		},
		get page() {
			return _pagination.page;
		},
		get pageSize() {
			return _pagination.pageSize;
		},
		get rows() {
			return rows;
		},
		setPage,
		setPageSize,
		nextPage,
		previousPage,
		firstPage,
		lastPage
	};
}

/**
 * Factory function for creating a reactive pagination object
 */
export type ReactivePaginationFactory<T> = (getAllRows: () => Row<T>[]) => ReactivePagination<T>;

/**
 * Creates pagination functionality for a reactive table
 *
 * @template T - The type of the data in the table
 * @param initialOptions - Initial pagination options including page and pageSize
 * @returns A factory function that creates a reactive pagination object
 */
export function reactivePagination<T>(
	initialOptions?: Partial<Pagination>
): ReactivePaginationFactory<T> {
	const options = {
		page: initialOptions?.page ?? 0,
		pageSize: initialOptions?.pageSize ?? 10
	};

	return (getAllRows: () => Row<T>[]) => createPagination(getAllRows, options);
}
