import { SvelteMap } from 'svelte/reactivity';
import type { Row } from '../../core/table.svelte.js';

/**
 * Direction of sorting
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort state for a column
 */
export type ColumnSorting = {
	/**
	 * The key of the column to sort by
	 */
	key: string;
	/**
	 * The direction of the sort
	 */
	direction: SortDirection;
};

/**
 * Sorting state
 */
export type Sorting = {
	/**
	 * The active sortings for the columns
	 */
	columnSortings: ColumnSorting[];
	/**
	 * Whether multi-column sorting is enabled
	 */
	multiSort: boolean;
	/**
	 * Custom comparator functions for columns
	 */
	comparators?: Record<string, Comparator<any>>;
};

/**
 * Comparator function for sorting rows
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * The type of the sorting object
 * @template T - The type of the data in the table
 */
export type ReactiveSorting<T> = {
	/**
	 * The current sort states
	 */
	columnSortings: ColumnSorting[];
	/**
	 * Whether multi-column sorting is enabled
	 */
	multiSort: boolean;
	/**
	 * Toggle sort direction for a column
	 * @param accessor - The column accessor
	 */
	toggleSort(accessor: keyof T): void;
	/**
	 * Clear all sorting
	 */
	clearSort(): void;
};

/**
 * The type of the reactive sorting output
 * @template T - The type of the data in the table
 */
export type ReactiveSortingOutput<T> = {
	/**
	 * The sorted rows
	 */
	rows: Row<T>[];

	/**
	 * The current sorting state
	 */
	state: ReactiveSorting<T>;
};

/**
 * Factory function for creating a reactive sorting object
 */
export type ReactiveSortingFactory<T> = (getRows: () => Row<T>[]) => ReactiveSortingOutput<T>;

/**
 * Default comparator function for sorting values
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns Negative if a < b, positive if a > b, zero if equal
 */
function defaultComparator<T>(a: T, b: T): number {
	if (a === b) return 0;
	if (a === null || a === undefined) return -1;
	if (b === null || b === undefined) return 1;

	if (typeof a === 'string' && typeof b === 'string') {
		return a.localeCompare(b);
	}

	return a < b ? -1 : 1;
}

/**
 * Creates a sorting object that manages the current sort state and the rows that are currently sorted
 *
 * @internal
 * @template T - The type of the data in the table
 * @param getRows - A getter for the rows to be sorted
 * @param getColumns - A getter for the columns
 * @param options - Options for the sorting
 * @returns A sorting object that manages the current sort state and the rows that are currently sorted
 */
function createSorting<T>(
	getRows: () => Row<T>[],
	options: Partial<Sorting> = {}
): ReactiveSortingOutput<T> {
	const comparators = new SvelteMap<keyof T, Comparator<any>>();

	// Initialize custom comparators if provided in options
	if (options.comparators) {
		for (const [key, comparator] of Object.entries(options.comparators)) {
			comparators.set(key as keyof T, comparator);
		}
	}

	// Create the state with direct mutation for reactivity
	const _sortingState = $state<Sorting>({
		columnSortings: options?.columnSortings ?? [],
		multiSort: options?.multiSort ?? false
	});

	const rows = $derived(getRows());

	function toggleSort(accessor: keyof T): void {
		const columnSortingIndex = _sortingState.columnSortings.findIndex(
			(sorting) => sorting.key === accessor
		);
		const exists = columnSortingIndex !== -1;

		// Clear existing sorts if not in multi-sort mode and we're setting a new sort
		if (!_sortingState.multiSort && !exists) {
			clearSort();
		}

		if (exists) {
			const columnSorting = _sortingState.columnSortings[columnSortingIndex];

			if (columnSorting.direction === 'asc') {
				columnSorting.direction = 'desc';
				// Move to end for highest priority in multi-sort mode
				if (_sortingState.multiSort) {
					_sortingState.columnSortings.splice(columnSortingIndex, 1);
					_sortingState.columnSortings.push(columnSorting);
				}
			} else {
				// Either remove from array in multi-sort or clear in single-sort
				_sortingState.multiSort
					? _sortingState.columnSortings.splice(columnSortingIndex, 1)
					: clearSort();
			}
		} else {
			// Add new sort with 'asc' direction
			_sortingState.columnSortings.push({
				key: accessor as string,
				direction: 'asc'
			});
		}
	}

	function clearSort(): void {
		_sortingState.columnSortings.length = 0;
	}

	// Get sort function for a column (use default if none provided)
	function getSortFn(key: keyof T): Comparator<any> {
		return comparators.has(key) ? comparators.get(key)! : defaultComparator;
	}

	// Sort the rows based on the current sort states
	const sortedRows = $derived.by(() => {
		if (!_sortingState.columnSortings.length) return rows;

		return [...rows].sort((rowA, rowB) => {
			for (const { key, direction } of _sortingState.columnSortings) {
				const valueA = rowA.original[key as keyof T];
				const valueB = rowB.original[key as keyof T];
				const sortFn = getSortFn(key as keyof T);
				const result = sortFn(valueA, valueB);

				if (result !== 0) {
					return direction === 'asc' ? result : -result;
				}
			}
			return 0; // Maintain original order if all criteria equal
		});
	});

	return {
		get rows() {
			return sortedRows;
		},
		state: {
			get columnSortings() {
				return _sortingState.columnSortings;
			},
			get multiSort() {
				return _sortingState.multiSort;
			},
			toggleSort,
			clearSort
		}
	};
}

/**
 * Creates sorting functionality for a reactive table
 *
 * @template T - The type of the data in the table
 * @param options - Options for the sorting
 * @param options.columnSortings - Initial column sorting states
 * @param options.multiSort - Whether multi-column sorting is enabled
 * @param options.comparators - Custom comparator functions for columns, keyed by column accessor
 * @returns A factory function that creates a reactive sorting object
 *
 * @example
 * ```svelte
 * <script>
 *   import { reactiveSorting } from 'svelte-reactive-table';
 *
 *   // Initialize with custom sorting functions
 *   const sorting = reactiveSorting({
 *     columnSortings: [{ key: 'name', direction: 'asc' }],
 *     multiSort: true,
 *     comparators: {
 *       // Custom case-insensitive string comparison
 *       name: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
 *       // Custom date comparison
 *       date: (a, b) => new Date(a).getTime() - new Date(b).getTime()
 *     }
 *   });
 * </script>
 * ```
 */
export function reactiveSorting<T>(options: Partial<Sorting> = {}): ReactiveSortingFactory<T> {
	return (getRows: () => Row<T>[]) => createSorting(getRows, options);
}
