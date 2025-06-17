/**
 * Filtering plugin ID
 */
export type FilteringPluginId = 'filtering';

/**
 * The filter value can be a single value, an array for "in" filtering,
 */
export type FilterValue<T> = T | T[] | ((value: T) => boolean);

export type Filters<T> = {
	[K in keyof T]?: FilterValue<T[K]>;
};

export type FiltersState<T> = {
	/**
	 * Current active filters
	 */
	readonly filters: Filters<T>;

	/**
	 * Number of active filters
	 */
	readonly count: number;

	/**
	 * Whether any filters are active
	 */
	readonly hasActiveFilters: boolean;

	/**
	 * Set a filter for a specific column
	 * @param key - Column key
	 * @param value - Filter value (single value, array for "in" filtering, or predicate function)
	 */
	setFilter<K extends keyof T>(key: K, value: FilterValue<T[K]> | undefined): void;

	/**
	 * Set multiple filters at once
	 * @param filters - Object with column keys and filter values
	 */
	setFilters(filters: Partial<Filters<T>>): void;

	/**
	 * Remove a specific filter
	 * @param key - Column key to remove filter for
	 */
	removeFilter<K extends keyof T>(key: K): void;

	/**
	 * Clear all filters
	 */
	clearFilters(): void;

	/**
	 * Get the current filter value for a column
	 * @param key - Column key
	 * @returns Current filter value or undefined
	 */
	getFilter<K extends keyof T>(key: K): FilterValue<T[K]> | undefined;
};

export type FilteringOptions<T> = {
	/**
	 * Initial filters to apply
	 */
	initialFilters?: Filters<T>;

	/**
	 * Custom string comparison (case-sensitive by default)
	 * @default false
	 */
	caseSensitive?: boolean;
};
