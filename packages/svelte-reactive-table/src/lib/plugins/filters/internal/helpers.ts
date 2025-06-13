import type { ComparisonType, FilterGroup } from '../types/index.js';
import { comparisonFunctions } from './comparisonFunctions.js';

/**
 * Removes a filter group by ID from a filter tree
 *
 * @internal
 *
 * @template T - The data type of the table row
 * @param filterGroup - The root filter group
 * @param idToRemove - The ID of the filter group to remove
 * @returns The updated filter group, or null if the root was removed
 */
export function removeFilterGroupById<T, K extends keyof T, C extends ComparisonType>(
	filterGroup: FilterGroup<T, K, C>,
	idToRemove: string
): FilterGroup<T, K, C> | null {
	if (filterGroup.id === idToRemove) {
		return null;
	}

	if (filterGroup.type === 'filter') {
		return filterGroup;
	}

	const updatedGroups = filterGroup.filterGroups
		.map((group) => removeFilterGroupById(group, idToRemove))
		.filter((group): group is FilterGroup<T, K, C> => group !== null);

	if (updatedGroups.length === 0) {
		return null;
	}

	if (updatedGroups.length === 1) {
		return updatedGroups[0];
	}

	return {
		...filterGroup,
		filterGroups: updatedGroups
	};
}

/**
 * Counts the total number of filter conditions in a filter group
 *
 * @internal
 *
 * @template T - The data type of the table row
 * @param filterGroup - The filter group to count
 * @returns The total number of filter conditions
 */
export function countFilterConditions<T, K extends keyof T, C extends ComparisonType>(
	filterGroup: FilterGroup<T, K, C>
): number {
	if (filterGroup.type === 'filter') {
		return 1;
	}

	return filterGroup.filterGroups.reduce((total, group) => total + countFilterConditions(group), 0);
}

/**
 * Evaluates a filter group against a table row
 * @internal
 * @template T - The data type of the table row
 * @param filterGroup - The filter group to evaluate
 * @param row - The table row to test against
 * @returns True if the row passes the filter, false otherwise
 */
export function evaluateFilterGroup<T, K extends keyof T, C extends ComparisonType>(
	filterGroup: FilterGroup<T, K, C>,
	row: { original: T }
): boolean {
	if (filterGroup.type === 'filter') {
		return evaluateSingleFilter(filterGroup.filter, row.original);
	}

	if (filterGroup.type === 'logical') {
		return evaluateLogicalGroup(filterGroup, row);
	}

	return true;
}

/**
 * Evaluates a single filter condition against a data object
 * @internal
 * @template T - The data type of the table row
 * @param filter - The filter condition to evaluate
 * @param data - The data object to test
 * @returns True if the data passes the filter, false otherwise
 */
function evaluateSingleFilter<T>(
	filter: { key: keyof T; value: T[keyof T] | T[keyof T][]; comparisonType?: ComparisonType },
	data: T
): boolean {
	const { key, value: filterValue, comparisonType = 'equals' } = filter;
	const actualValue = data[key];

	const comparisonFunction = comparisonFunctions[comparisonType];
	if (!comparisonFunction) {
		return comparisonFunctions.equals(actualValue, filterValue);
	}

	return comparisonFunction(actualValue, filterValue);
}

/**
 * Evaluates a logical group of filters against a table row
 * @internal
 * @template T - The data type of the table row
 * @param logicalGroup - The logical group to evaluate
 * @param row - The table row to test against
 * @returns True if the row passes the logical group, false otherwise
 */
function evaluateLogicalGroup<T, K extends keyof T, C extends ComparisonType>(
	logicalGroup: { operator: 'AND' | 'OR'; filterGroups: FilterGroup<T, K, C>[] },
	row: { original: T }
): boolean {
	const { operator, filterGroups } = logicalGroup;
	const results = filterGroups.map((group) => evaluateFilterGroup(group, row));

	switch (operator) {
		case 'AND':
			return results.every(Boolean);
		case 'OR':
			return results.some(Boolean);
		default:
			console.warn(`Unknown logical operator: ${operator}. Defaulting to AND.`);
			return results.every(Boolean);
	}
}
