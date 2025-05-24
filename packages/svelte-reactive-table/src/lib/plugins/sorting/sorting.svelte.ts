import type { PluginOutput, TablePlugin } from '$lib/core/index.js';
import type {
	ColumnSorting,
	SortingOptions,
	SortingPluginId,
	SortingState
} from './types/index.js';

/**
 * Default comparator function for sorting
 */
function defaultComparator(a: unknown, b: unknown): number {
	if (a === b) return 0;
	if (a === undefined) return 1;
	if (b === undefined) return -1;
	if (a === null) return 1;
	if (b === null) return -1;

	if (typeof a === 'string' && typeof b === 'string') {
		return a.localeCompare(b);
	} else if (typeof a === 'number' && typeof b === 'number') {
		return a - b;
	} else {
		return String(a).localeCompare(String(b));
	}
}

/**
 * Returns a sorting plugin for the table
 *
 * @param options - Options for the sorting
 * @returns A sorting plugin
 */
export function reactiveSorting<T>(
	options: SortingOptions<T> = {}
): TablePlugin<T, SortingState<T>, SortingPluginId> {
	return {
		id: 'sorting' as const,

		init(getRows, getColumns) {
			let _columnSortings = $state<ColumnSorting[]>(options.columnSortings?.slice() || []);
			const _multiSort = $state(options.multiSort || false);

			const state: SortingState<T> = {
				get columnSortings() {
					return _columnSortings;
				},

				get multiSort() {
					return _multiSort;
				},

				setSort(accessor, direction) {
					const accessorStr = String(accessor);
					const existingIndex = _columnSortings.findIndex((s) => s.key === accessorStr);

					if (existingIndex !== -1) {
						if (direction === 'none') {
							_columnSortings = _columnSortings.filter((s) => s.key !== accessorStr);
						} else {
							const newSortings = [..._columnSortings];
							newSortings[existingIndex] = { key: accessorStr, direction };
							_columnSortings = newSortings;
						}
					} else if (direction !== 'none') {
						if (_multiSort) {
							_columnSortings = [..._columnSortings, { key: accessorStr, direction }];
						} else {
							_columnSortings = [{ key: accessorStr, direction }];
						}
					}
				},

				toggleSort(accessor) {
					const currentDirection = this.getSortDirection(accessor);

					if (currentDirection === 'none') {
						this.setSort(accessor, 'asc');
					} else if (currentDirection === 'asc') {
						this.setSort(accessor, 'desc');
					} else {
						this.setSort(accessor, 'none');
					}
				},

				clearSort() {
					_columnSortings = [];
				},

				getSortDirection(accessor) {
					const accessorStr = String(accessor);
					const sort = _columnSortings.find((s) => s.key === accessorStr);
					return sort ? sort.direction : 'none';
				}
			};

			// Create the plugin output
			const output: PluginOutput<T, SortingState<T>> = {
				state,

				get columns() {
					return getColumns();
				},

				get rows() {
					if (_columnSortings.length === 0) {
						return getRows();
					}

					// Create a copy of rows to sort
					const sortedRows = [...getRows()];

					sortedRows.sort((rowA, rowB) => {
						for (const { key, direction } of _columnSortings) {
							const valueA = rowA.original[key as keyof T];
							const valueB = rowB.original[key as keyof T];
							const comparator = options.comparators?.[key as keyof T] || defaultComparator;

							let result = comparator(valueA, valueB);

							if (direction === 'desc') {
								result = -result;
							}

							if (result !== 0) {
								return result;
							}
						}

						return 0;
					});

					return sortedRows;
				}
			};

			return output;
		}
	};
}
