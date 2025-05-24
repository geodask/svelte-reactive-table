import type { PluginOutput, TablePlugin } from '$lib/core/index.js';
import type { PaginationOptions, PaginationPluginId, PaginationState } from './types/index.js';

/**
 * Returns a pagination plugin for the table
 *
 * @param options - Options for the pagination
 * @returns A pagination plugin
 */
export function reactivePagination<T>(
	options: PaginationOptions = {}
): TablePlugin<T, PaginationState, PaginationPluginId> {
	return {
		id: 'pagination' as const,

		init(getRows, getColumns) {
			let _page = $state(options.page || 0);
			let _pageSize = $state(options.pageSize || 10);

			const _totalItems = $derived(getRows().length);

			const rows = $derived.by(() => {
				const startIndex = _page * _pageSize;
				const endIndex = startIndex + _pageSize;
				return getRows().slice(startIndex, endIndex);
			});

			const state: PaginationState = {
				get page() {
					return _page;
				},

				get pageSize() {
					return _pageSize;
				},

				get totalItems() {
					return _totalItems;
				},

				get pageCount() {
					return Math.max(1, Math.ceil(_totalItems / _pageSize));
				},

				get hasPreviousPage() {
					return _page > 0;
				},

				get isFirstPage() {
					return _page === 0;
				},

				get isLastPage() {
					return _page === this.pageCount - 1;
				},

				get hasNextPage() {
					return _page < this.pageCount - 1;
				},

				goToPreviousPage() {
					if (this.hasPreviousPage) {
						_page--;
					}
				},

				goToNextPage() {
					if (this.hasNextPage) {
						_page++;
					}
				},

				goToFirstPage() {
					_page = 0;
				},
				goToLastPage() {
					_page = this.pageCount - 1;
				},

				setPage(page) {
					const newPage = Math.max(0, Math.min(page, this.pageCount - 1));
					_page = newPage;
				},

				setPageSize(pageSize) {
					if (pageSize > 0) {
						_pageSize = pageSize;

						const newPageCount = Math.ceil(_totalItems / _pageSize);
						if (_page >= newPageCount) {
							_page = Math.max(0, newPageCount - 1);
						}
					}
				},

				get pageItemRange() {
					const start = _page * _pageSize + 1;
					const end = Math.min(start + _pageSize - 1, _totalItems);
					return { start, end };
				}
			};

			const output: PluginOutput<T, PaginationState> = {
				state,
				get rows() {
					return rows;
				},
				get columns() {
					return getColumns();
				}
			};

			return output;
		}
	};
}
