import type { TablePlugin } from '$lib/core/index.js';
import type {
	FiltersState,
	FilterValue,
	Filters,
	FilteringOptions,
	FilteringPluginId
} from './types/index.js';

/**
 * Determines if a filter value should be considered empty and thus removed
 */
function isEmptyFilterValue<T>(value: FilterValue<T> | undefined): boolean {
	// Explicit null or undefined
	if (value == null) return true;

	// Empty string
	if (typeof value === 'string' && value === '') return true;

	// Empty array
	if (Array.isArray(value) && value.length === 0) return true;

	// All other cases are considered non-empty
	return false;
}

/**
 * Simple filtering function that handles all comparison types intelligently
 */
function matchesFilter<T>(value: T, filterValue: FilterValue<T>, caseSensitive = false): boolean {
	if (value == null) {
		return filterValue == null;
	}

	if (typeof filterValue === 'function' && !Array.isArray(filterValue)) {
		const result = (filterValue as (value: T) => boolean)(value);
		return result;
	}

	if (Array.isArray(filterValue)) {
		const result = filterValue.some((fv) => value === fv);
		return result;
	}

	if (typeof value === 'string' && typeof filterValue === 'string') {
		const valueStr = caseSensitive ? value : value.toLowerCase();
		const filterStr = caseSensitive ? filterValue : filterValue.toLowerCase();
		return valueStr.includes(filterStr);
	}

	return value === filterValue;
}

/**
 * Creates a simple, intuitive filtering plugin
 */
export function reactiveFiltering<T>(
	options: FilteringOptions<T> = {}
): TablePlugin<T, FiltersState<T>, FilteringPluginId> {
	return {
		id: 'filtering',

		init(getRows, getColumns) {
			let _filters = $state<Filters<T>>(options.initialFilters || {});
			const caseSensitive = options.caseSensitive ?? false;

			const state: FiltersState<T> = {
				get filters() {
					return { ..._filters };
				},

				get count() {
					return Object.keys(_filters).length;
				},

				get hasActiveFilters() {
					return Object.keys(_filters).length > 0;
				},

				setFilter<K extends keyof T>(key: K, value: FilterValue<T[K]> | undefined) {
					if (isEmptyFilterValue(value)) {
						delete _filters[key];
					} else {
						_filters[key] = value;
					}
				},

				setFilters(filters: Partial<Filters<T>>) {
					for (const [key, value] of Object.entries(filters)) {
						this.setFilter(key as keyof T, value as FilterValue<T[keyof T]>);
					}
				},

				removeFilter<K extends keyof T>(key: K) {
					delete _filters[key];
				},

				clearFilters() {
					_filters = {};
				},

				getFilter<K extends keyof T>(key: K): FilterValue<T[K]> | undefined {
					return _filters[key];
				}
			};

			return {
				state,

				get columns() {
					return getColumns();
				},

				get rows() {
					const activeFilters = _filters;
					const allRows = getRows();

					if (Object.keys(activeFilters).length === 0) {
						return allRows;
					}

					return allRows.filter((row) => {
						for (const [key, filterValue] of Object.entries(activeFilters)) {
							const columnValue = row.original[key as keyof T];

							if (!matchesFilter(columnValue, filterValue, caseSensitive)) {
								return false;
							}
						}

						return true;
					});
				}
			};
		}
	};
}

/**
 * Convenience functions for common filter patterns
 */
export const filterHelpers = {
	/**
	 * Create a range filter for numbers or dates
	 */
	range<T extends number | Date>(min?: T, max?: T): ((value: T) => boolean) | undefined {
		if (min == null && max == null) return undefined;

		return (value: T) => {
			if (min != null && value < min) return false;
			if (max != null && value > max) return false;
			return true;
		};
	},

	/**
	 * Create a case-sensitive string filter
	 */
	exactText(text: string): (value: string) => boolean {
		return (value: string) => value === text;
	},

	/**
	 * Create a starts-with filter
	 */
	startsWith(prefix: string, caseSensitive = false): (value: string) => boolean {
		return (value: string) => {
			const val = caseSensitive ? value : value.toLowerCase();
			const pre = caseSensitive ? prefix : prefix.toLowerCase();
			return val.startsWith(pre);
		};
	},

	/**
	 * Create an ends-with filter
	 */
	endsWith(suffix: string, caseSensitive = false): (value: string) => boolean {
		return (value: string) => {
			const val = caseSensitive ? value : value.toLowerCase();
			const suf = caseSensitive ? suffix : suffix.toLowerCase();
			return val.endsWith(suf);
		};
	},

	/**
	 * Create a NOT filter
	 */
	not<T>(filterValue: FilterValue<T>): (value: T) => boolean {
		return (value: T) => !matchesFilter(value, filterValue);
	}
};
