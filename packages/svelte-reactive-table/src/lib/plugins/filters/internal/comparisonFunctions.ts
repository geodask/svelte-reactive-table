import type { ComparisonType } from '../types/index.js';

/**
 * Collection of comparison functions indexed by comparison type
 */
export const comparisonFunctions: Record<
	ComparisonType,
	(value: unknown, filterValue: unknown) => boolean
> = {
	/**
	 * Exact equality comparison
	 */
	equals: (value, filterValue) => value === filterValue,

	/**
	 * Inequality comparison
	 */
	notEquals: (value, filterValue) => value !== filterValue,

	/**
	 * Case-insensitive substring search for strings
	 */
	contains: (value, filterValue) => {
		if (typeof value !== 'string' || typeof filterValue !== 'string') {
			return false;
		}
		return value.toLowerCase().includes(filterValue.toLowerCase());
	},

	/**
	 * Case-insensitive prefix check for strings
	 */
	startsWith: (value, filterValue) => {
		if (typeof value !== 'string' || typeof filterValue !== 'string') {
			return false;
		}
		return value.toLowerCase().startsWith(filterValue.toLowerCase());
	},

	/**
	 * Case-insensitive suffix check for strings
	 */
	endsWith: (value, filterValue) => {
		if (typeof value !== 'string' || typeof filterValue !== 'string') {
			return false;
		}
		return value.toLowerCase().endsWith(filterValue.toLowerCase());
	},

	/**
	 * Greater than comparison for numbers and dates
	 */
	greaterThan: (value, filterValue) => {
		if (typeof value === 'number' && typeof filterValue === 'number') {
			return value > filterValue;
		}
		if (value instanceof Date && filterValue instanceof Date) {
			return value.getTime() > filterValue.getTime();
		}
		if (typeof value === 'string' && typeof filterValue === 'string') {
			return value.localeCompare(filterValue) > 0;
		}
		return false;
	},

	/**
	 * Less than comparison for numbers and dates
	 */
	lessThan: (value, filterValue) => {
		if (typeof value === 'number' && typeof filterValue === 'number') {
			return value < filterValue;
		}
		if (value instanceof Date && filterValue instanceof Date) {
			return value.getTime() < filterValue.getTime();
		}
		if (typeof value === 'string' && typeof filterValue === 'string') {
			return value.localeCompare(filterValue) < 0;
		}
		return false;
	},

	/**
	 * Greater than or equal comparison for numbers and dates
	 */
	greaterThanOrEqual: (value, filterValue) => {
		if (typeof value === 'number' && typeof filterValue === 'number') {
			return value >= filterValue;
		}
		if (value instanceof Date && filterValue instanceof Date) {
			return value.getTime() >= filterValue.getTime();
		}
		if (typeof value === 'string' && typeof filterValue === 'string') {
			return value.localeCompare(filterValue) >= 0;
		}
		return false;
	},

	/**
	 * Less than or equal comparison for numbers and dates
	 */
	lessThanOrEqual: (value, filterValue) => {
		if (typeof value === 'number' && typeof filterValue === 'number') {
			return value <= filterValue;
		}
		if (value instanceof Date && filterValue instanceof Date) {
			return value.getTime() <= filterValue.getTime();
		}
		if (typeof value === 'string' && typeof filterValue === 'string') {
			return value.localeCompare(filterValue) <= 0;
		}
		return false;
	},

	/**
	 * Array inclusion check - checks if value is in the filterValue array
	 */
	in: (value, filterValue) => {
		if (!Array.isArray(filterValue)) {
			return false;
		}
		return filterValue.includes(value);
	},

	/**
	 * Array exclusion check - checks if value is not in the filterValue array
	 */
	notIn: (value, filterValue) => {
		if (!Array.isArray(filterValue)) {
			return true;
		}
		return !filterValue.includes(value);
	}
};
