import { generateId } from './internal/id.js';
import type {
	ColumnFilter,
	FilterGroup,
	ComparisonType,
	ArrayComparisonType
} from './types/index.js';

/**
 * Creates a filter condition with array comparison type (in, notIn)
 */
export function condition<T, K extends keyof T>(
	key: K,
	comparisonType: ArrayComparisonType,
	value: T[K][]
): FilterGroup<T, K>;

/**
 * Creates a filter condition with single-value comparison type
 */
export function condition<T, K extends keyof T>(
	key: K,
	comparisonType: Exclude<ComparisonType, ArrayComparisonType>,
	value: T[K]
): FilterGroup<T, K>;

/**
 * Creates a filter condition with default comparison type (equals)
 */
export function condition<T, K extends keyof T>(key: K, value: T[K]): FilterGroup<T, K>;

/**
 * Implementation of the condition function
 */
export function condition<T, K extends keyof T>(
	keyOrValue: K,
	comparisonTypeOrValue?: ComparisonType | T[K],
	value?: T[K] | T[K][]
): FilterGroup<T, K> {
	// Handle the case where only key and value are provided (default to 'equals')
	if (arguments.length === 2) {
		return {
			id: generateId(),
			type: 'filter',
			filter: {
				key: keyOrValue,
				comparisonType: undefined, // Will default to 'equals'
				value: comparisonTypeOrValue as T[K]
			} as ColumnFilter<T, K>
		};
	}

	// Handle the case where key, comparisonType, and value are provided
	return {
		id: generateId(),
		type: 'filter',
		filter: {
			key: keyOrValue,
			comparisonType: comparisonTypeOrValue as ComparisonType,
			value: value as T[K] | T[K][]
		} as ColumnFilter<T, K>
	};
}

/**
 * Creates an AND logical group of filter conditions
 *
 * @template T - The data type of the table row
 * @param filterGroups - The filter conditions to combine with AND
 * @returns A logical filter group using AND operator
 */
export function and<T, K extends keyof T = keyof T>(
	...filterGroups: FilterGroup<T, K>[]
): FilterGroup<T, K> {
	if (filterGroups.length === 0) {
		throw new Error('AND group must contain at least one filter');
	}

	if (filterGroups.length === 1) {
		return filterGroups[0];
	}

	return {
		id: generateId(),
		type: 'logical',
		operator: 'AND',
		filterGroups
	};
}

/**
 * Creates an OR logical group of filter conditions
 *
 * @template T - The data type of the table row
 * @param filterGroups - The filter conditions to combine with OR
 * @returns A logical filter group using OR operator
 */
export function or<T, K extends keyof T = keyof T>(
	...filterGroups: FilterGroup<T, K>[]
): FilterGroup<T, K> | undefined {
	if (filterGroups.length === 0) {
		return undefined;
	}

	if (filterGroups.length === 1) {
		return filterGroups[0];
	}

	return {
		id: generateId(),
		type: 'logical',
		operator: 'OR',
		filterGroups
	};
}

/**
 * Type-safe filter builders with specific comparison types
 * These provide better IntelliSense and compile-time type checking
 */

/**
 * Creates an equals filter (single value)
 */
export function equals<T, K extends keyof T>(key: K, value: T[K]): FilterGroup<T, K> {
	return condition(key, 'equals', value);
}

/**
 * Creates a contains filter (single value, typically for strings)
 */
export function contains<T, K extends keyof T>(key: K, value: T[K]): FilterGroup<T, K> {
	return condition(key, 'contains', value);
}

/**
 * Creates a startsWith filter (single value, typically for strings)
 */
export function startsWith<T, K extends keyof T>(key: K, value: T[K]): FilterGroup<T, K> {
	return condition(key, 'startsWith', value);
}

/**
 * Creates an endsWith filter (single value, typically for strings)
 */
export function endsWith<T, K extends keyof T>(key: K, value: T[K]): FilterGroup<T, K> {
	return condition(key, 'endsWith', value);
}

/**
 * Creates a greaterThan filter (single value, typically for numbers)
 */
export function greaterThan<T, K extends keyof T>(key: K, value: T[K]): FilterGroup<T, K> {
	return condition(key, 'greaterThan', value);
}

/**
 * Creates a lessThan filter (single value, typically for numbers)
 */
export function lessThan<T, K extends keyof T>(key: K, value: T[K]): FilterGroup<T, K> {
	return condition(key, 'lessThan', value);
}

/**
 * Creates an 'in' filter (array of values) - TypeScript enforces array type
 */
export function isIn<T, K extends keyof T>(key: K, values: T[K][]): FilterGroup<T, K> {
	return condition(key, 'in', values);
}

/**
 * Creates a 'notIn' filter (array of values) - TypeScript enforces array type
 */
export function notIn<T, K extends keyof T>(key: K, values: T[K][]): FilterGroup<T, K> {
	return condition(key, 'notIn', values);
}
