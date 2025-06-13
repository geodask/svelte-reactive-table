/**
 * Filters plugin ID
 */
export type FiltersPluginId = 'filters';

/**
 * Comparison types for filter operations
 */
export type ComparisonType =
	| 'equals'
	| 'notEquals'
	| 'contains'
	| 'startsWith'
	| 'endsWith'
	| 'greaterThan'
	| 'lessThan'
	| 'greaterThanOrEqual'
	| 'lessThanOrEqual'
	| 'in'
	| 'notIn';

/**
 * String-based comparison types that work with string operations
 */
export type StringComparisonType = 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith';

/**
 * Numeric comparison types that work with numeric operations
 */
export type NumericComparisonType =
	| 'equals'
	| 'notEquals'
	| 'greaterThan'
	| 'lessThan'
	| 'greaterThanOrEqual'
	| 'lessThanOrEqual';

/**
 * Array-based comparison types
 */
export type ArrayComparisonType = 'in' | 'notIn';

/**
 * General comparison types for any value type
 */
export type GeneralComparisonType = 'equals' | 'notEquals';

/**
 * Helper type to determine the filter value type based on comparison type
 */
export type FilterValueType<T, C extends ComparisonType> = C extends ArrayComparisonType ? T[] : T;

/**
 * Strongly typed column filter that enforces value type based on comparison
 */
export interface StrictColumnFilter<T, K extends keyof T, C extends ComparisonType> {
	/**
	 * Key of the column to filter by
	 */
	key: K;
	/**
	 * Comparison type for the filter
	 */
	comparisonType: C;
	/**
	 * The value to filter by (type-safe based on comparison type)
	 */
	value: FilterValueType<T[K], C>;
}

/**
 * Column filter with array-based comparison types (in, notIn)
 */
export interface ArrayColumnFilter<T, K extends keyof T = keyof T> {
	/**
	 * Key of the column to filter by
	 */
	key: K;
	/**
	 * Array-based comparison type
	 */
	comparisonType: ArrayComparisonType;
	/**
	 * Array of values to filter by
	 */
	value: T[K][];
}

/**
 * Column filter with single-value comparison types
 */
export interface SingleColumnFilter<T, K extends keyof T = keyof T> {
	/**
	 * Key of the column to filter by
	 */
	key: K;
	/**
	 * Single-value comparison type
	 */
	comparisonType: Exclude<ComparisonType, ArrayComparisonType>;
	/**
	 * Single value to filter by
	 */
	value: T[K];
}

/**
 * Column filter with optional comparison type (defaults to equals with single value)
 */
export interface DefaultColumnFilter<T, K extends keyof T = keyof T> {
	/**
	 * Key of the column to filter by
	 */
	key: K;
	/**
	 * Optional comparison type (defaults to 'equals')
	 */
	comparisonType?: undefined;
	/**
	 * Single value to filter by (since default is 'equals')
	 */
	value: T[K];
}

/**
 * Union type for all possible column filter configurations
 */
export type ColumnFilter<T, K extends keyof T = keyof T> =
	| ArrayColumnFilter<T, K>
	| SingleColumnFilter<T, K>
	| DefaultColumnFilter<T, K>;

/**
 * Filters state for a table
 */
export type FiltersState<T, K extends keyof T = keyof T> = {
	/**
	 * Current filter group
	 */
	filterGroup?: FilterGroup<T, K>;

	/**
	 * Gets the total number of active filter conditions
	 */
	count: number;

	/**
	 * Checks if any filters are currently active
	 */
	hasActiveFilters: boolean;

	/**
	 * Sets the root filter group, replacing any existing filters
	 */
	setFilterGroup(filterGroup: FilterGroup<T, K> | undefined): FiltersState<T, K>;

	/**
	 * Adds a filter group using the specified logical operator
	 */
	addFilterGroup(filterGroup: FilterGroup<T, K>, operator: LogicalOperator): FiltersState<T, K>;

	/**
	 * Removes a filter group by its unique ID
	 */
	removeFilterGroup(id: string): FiltersState<T, K>;

	/**
	 * Clears all filters
	 */
	clearFilters(): FiltersState<T, K>;
};

/**
 * Function type for filtering values in a column
 */
export type FilterFunction<T, K extends keyof T = keyof T> = (
	value: T[K],
	filterValue: T[K] | T[K][]
) => boolean;

/**
 * Logical operators for combining filter groups
 */
export type LogicalOperator = 'AND' | 'OR';

/**
 * Represents a group of filters, which can be either a single filter or a logical combination of multiple filters
 */
export type FilterGroup<T, K extends keyof T = keyof T> =
	| { id: string; type: 'filter'; filter: ColumnFilter<T, K> }
	| {
			id: string;
			type: 'logical';
			operator: LogicalOperator;
			filterGroups: FilterGroup<T, K>[];
	  };

/**
 * Options for creating a filtering plugin
 */
export interface FiltersOptions<T, K extends keyof T = keyof T> {
	/**
	 * Initial filter group
	 */
	filterGroup?: FilterGroup<T, K>;
}
