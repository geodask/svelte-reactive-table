import { describe, expect, it } from 'vitest';
import { and, condition, or } from './builders.js';
import type { FilterGroup } from './types/index.js';

// Custom assertion helpers for type narrowing
function expectFilterType<T, K extends keyof T = keyof T>(
	filterGroup: FilterGroup<T, K>
): asserts filterGroup is Extract<FilterGroup<T, K>, { type: 'filter' }> {
	expect(filterGroup.type).toBe('filter');
}

function expectLogicalType<T, K extends keyof T = keyof T>(
	filterGroup: FilterGroup<T, K>
): asserts filterGroup is Extract<FilterGroup<T, K>, { type: 'logical' }> {
	expect(filterGroup.type).toBe('logical');
}

// Define a simple type for testing
type TestItem = {
	id: number;
	name: string;
	category: string;
	price: number;
	active: boolean;
	tags: string[];
	description?: string;
	createdAt: Date;
};

describe('builders', () => {
	describe('condition', () => {
		it('should create a simple filter condition with correct structure', () => {
			const filterCondition = condition<TestItem, 'name'>('name', 'equals', 'Test Item');

			expectFilterType(filterCondition);
			expect(filterCondition.filter.key).toBe('name');
			expect(filterCondition.filter.value).toBe('Test Item');
			expect(filterCondition.filter.comparisonType).toBe('equals');
			expect(filterCondition.id).toBeDefined();
			expect(typeof filterCondition.id).toBe('string');
		});

		// Test single-value comparison types
		it('should create condition with equals comparison', () => {
			const filter = condition<TestItem, 'name'>('name', 'equals', 'John');
			expectFilterType(filter);
			expect(filter.filter.key).toBe('name');
			expect(filter.filter.comparisonType).toBe('equals');
			expect(filter.filter.value).toBe('John');
		});

		it('should create condition with notEquals comparison', () => {
			const filter = condition<TestItem, 'name'>('name', 'notEquals', 'Jane');
			expectFilterType(filter);
			expect(filter.filter.key).toBe('name');
			expect(filter.filter.comparisonType).toBe('notEquals');
			expect(filter.filter.value).toBe('Jane');
		});

		it('should create condition with contains comparison', () => {
			const filter = condition<TestItem, 'name'>('name', 'contains', 'oh');
			expectFilterType(filter);
			expect(filter.filter.key).toBe('name');
			expect(filter.filter.comparisonType).toBe('contains');
			expect(filter.filter.value).toBe('oh');
		});

		it('should create condition with startsWith comparison', () => {
			const filter = condition<TestItem, 'name'>('name', 'startsWith', 'Jo');
			expectFilterType(filter);
			expect(filter.filter.key).toBe('name');
			expect(filter.filter.comparisonType).toBe('startsWith');
			expect(filter.filter.value).toBe('Jo');
		});

		it('should create condition with endsWith comparison', () => {
			const filter = condition<TestItem, 'name'>('name', 'endsWith', 'hn');
			expectFilterType(filter);
			expect(filter.filter.key).toBe('name');
			expect(filter.filter.comparisonType).toBe('endsWith');
			expect(filter.filter.value).toBe('hn');
		});

		it('should create condition with greaterThan comparison', () => {
			const filter = condition<TestItem, 'price'>('price', 'greaterThan', 100);
			expectFilterType(filter);
			expect(filter.filter.key).toBe('price');
			expect(filter.filter.comparisonType).toBe('greaterThan');
			expect(filter.filter.value).toBe(100);
		});

		it('should create condition with lessThan comparison', () => {
			const filter = condition<TestItem, 'price'>('price', 'lessThan', 500);
			expectFilterType(filter);
			expect(filter.filter.key).toBe('price');
			expect(filter.filter.comparisonType).toBe('lessThan');
			expect(filter.filter.value).toBe(500);
		});

		it('should create condition with greaterThanOrEqual comparison', () => {
			const filter = condition<TestItem, 'price'>('price', 'greaterThanOrEqual', 100);
			expectFilterType(filter);
			expect(filter.filter.key).toBe('price');
			expect(filter.filter.comparisonType).toBe('greaterThanOrEqual');
			expect(filter.filter.value).toBe(100);
		});

		it('should create condition with lessThanOrEqual comparison', () => {
			const filter = condition<TestItem, 'price'>('price', 'lessThanOrEqual', 500);
			expectFilterType(filter);
			expect(filter.filter.key).toBe('price');
			expect(filter.filter.comparisonType).toBe('lessThanOrEqual');
			expect(filter.filter.value).toBe(500);
		});

		it('should create condition with in comparison', () => {
			const filter = condition<TestItem, 'category'>('category', 'in', ['electronics', 'books']);
			expectFilterType(filter);
			expect(filter.filter.key).toBe('category');
			expect(filter.filter.comparisonType).toBe('in');
			expect(filter.filter.value).toEqual(['electronics', 'books']);
		});

		it('should create condition with notIn comparison', () => {
			const filter = condition<TestItem, 'category'>('category', 'notIn', [
				'furniture',
				'clothing'
			]);
			expectFilterType(filter);
			expect(filter.filter.key).toBe('category');
			expect(filter.filter.comparisonType).toBe('notIn');
			expect(filter.filter.value).toEqual(['furniture', 'clothing']);
		}); // Edge case tests
		it('should handle undefined values', () => {
			const filter = condition<TestItem, 'description'>('description', 'equals', undefined);
			expectFilterType(filter);
			expect(filter.filter.value).toBeUndefined();
		});

		it('should handle empty string values', () => {
			const filter = condition<TestItem, 'name'>('name', 'equals', '');
			expectFilterType(filter);
			expect(filter.filter.value).toBe('');
		});

		it('should handle empty array values', () => {
			const filter = condition<TestItem, 'tags'>('tags', 'in', []);
			expectFilterType(filter);
			expect(filter.filter.value).toEqual([]);
		});

		it('should handle date values', () => {
			const testDate = new Date('2023-01-01');
			const filter = condition<TestItem, 'createdAt'>('createdAt', 'equals', testDate);
			expectFilterType(filter);
			expect(filter.filter.value).toBe(testDate);
		});

		it('should generate unique IDs for each condition', () => {
			const filter1 = condition<TestItem, 'name'>('name', 'equals', 'test');
			const filter2 = condition<TestItem, 'name'>('name', 'equals', 'test');
			expect(filter1.id).not.toBe(filter2.id);
		});
	});

	describe('and', () => {
		it('should create an AND logical group with multiple conditions', () => {
			const filter1 = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			const filter2 = condition<TestItem, 'price'>('price', 'lessThan', 100);
			const andGroup = and(filter1, filter2);

			expectLogicalType(andGroup);
			expect(andGroup.operator).toBe('AND');
			expect(andGroup.filterGroups.length).toBe(2);
			expect(andGroup.filterGroups[0]).toEqual(filter1);
			expect(andGroup.filterGroups[1]).toEqual(filter2);
		});

		it('should return the single filter if only one is provided', () => {
			const singleFilter = condition<TestItem, 'name'>('name', 'equals', 'test');
			const result = and(singleFilter);
			expect(result).toBe(singleFilter);
		});

		it('should throw error when no filters provided', () => {
			expect(() => and()).toThrow('AND group must contain at least one filter');
		});

		it('should handle multiple filters (more than 2)', () => {
			const filter1 = condition<TestItem, 'name'>('name', 'contains', 'John');
			const filter2 = condition<TestItem, 'price'>('price', 'greaterThanOrEqual', 50);
			const filter3 = condition<TestItem, 'category'>('category', 'in', ['developer', 'manager']);
			const andGroup = and(filter1, filter2, filter3);

			expectLogicalType(andGroup);
			expect(andGroup.filterGroups).toHaveLength(3);
			expect(andGroup.filterGroups[0]).toEqual(filter1);
			expect(andGroup.filterGroups[1]).toEqual(filter2);
			expect(andGroup.filterGroups[2]).toEqual(filter3);
		});

		it('should generate unique IDs for different AND groups', () => {
			const filter1 = condition<TestItem, 'name'>('name', 'equals', 'test');
			const filter2 = condition<TestItem, 'price'>('price', 'equals', 100);
			const andGroup1 = and(filter1, filter2);
			const andGroup2 = and(filter1, filter2);
			expect(andGroup1.id).not.toBe(andGroup2.id);
		});
	});

	describe('or', () => {
		it('should create an OR logical group with multiple conditions', () => {
			const filter1 = condition<TestItem, 'category'>('category', 'equals', 'Books');
			const filter2 = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			const orGroup = or(filter1, filter2);

			expectLogicalType(orGroup);
			expect(orGroup.operator).toBe('OR');
			expect(orGroup.filterGroups.length).toBe(2);
			expect(orGroup.filterGroups[0]).toEqual(filter1);
			expect(orGroup.filterGroups[1]).toEqual(filter2);
		});

		it('should return the single filter if only one is provided', () => {
			const singleFilter = condition<TestItem, 'active'>('active', 'equals', false);
			const result = or(singleFilter);
			expect(result).toBe(singleFilter);
		});

		it('should throw error when no filters provided', () => {
			expect(() => or()).toThrow('OR group must contain at least one filter');
		});

		it('should handle multiple filters (more than 2)', () => {
			const filter1 = condition<TestItem, 'category'>('category', 'equals', 'Books');
			const filter2 = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			const filter3 = condition<TestItem, 'category'>('category', 'equals', 'Clothing');
			const orGroup = or(filter1, filter2, filter3);

			expectLogicalType(orGroup);
			expect(orGroup.filterGroups).toHaveLength(3);
			expect(orGroup.filterGroups[0]).toEqual(filter1);
			expect(orGroup.filterGroups[1]).toEqual(filter2);
			expect(orGroup.filterGroups[2]).toEqual(filter3);
		});

		it('should generate unique IDs for different OR groups', () => {
			const filter1 = condition<TestItem, 'name'>('name', 'equals', 'test');
			const filter2 = condition<TestItem, 'price'>('price', 'equals', 100);
			const orGroup1 = or(filter1, filter2);
			const orGroup2 = or(filter1, filter2);
			expect(orGroup1.id).not.toBe(orGroup2.id);
		});
	});

	describe('Complex nesting scenarios', () => {
		it('should handle deep nesting: and(or(condition, and(condition, condition)), condition)', () => {
			const filter1 = condition<TestItem, 'name'>('name', 'equals', 'John');
			const filter2 = condition<TestItem, 'price'>('price', 'greaterThan', 100);
			const filter3 = condition<TestItem, 'active'>('active', 'equals', true);
			const filter4 = condition<TestItem, 'category'>('category', 'equals', 'Electronics');

			const innerAnd = and(filter2, filter3);
			const orGroup = or(filter1, innerAnd);
			const outerAnd = and(orGroup, filter4);

			expectLogicalType(outerAnd);
			expect(outerAnd.operator).toBe('AND');
			expect(outerAnd.filterGroups).toHaveLength(2);
			expect(outerAnd.filterGroups[0]).toBe(orGroup);
			expect(outerAnd.filterGroups[1]).toBe(filter4);

			expectLogicalType(orGroup);
			expect(orGroup.operator).toBe('OR');
			expect(orGroup.filterGroups).toHaveLength(2);
			expect(orGroup.filterGroups[0]).toBe(filter1);
			expect(orGroup.filterGroups[1]).toBe(innerAnd);

			expectLogicalType(innerAnd);
			expect(innerAnd.operator).toBe('AND');
			expect(innerAnd.filterGroups).toHaveLength(2);
			expect(innerAnd.filterGroups[0]).toBe(filter2);
			expect(innerAnd.filterGroups[1]).toBe(filter3);
		});

		it('should handle or(and(condition, condition), and(condition, condition))', () => {
			const filter1 = condition<TestItem, 'name'>('name', 'equals', 'Admin');
			const filter2 = condition<TestItem, 'category'>('category', 'equals', 'IT');
			const filter3 = condition<TestItem, 'price'>('price', 'greaterThanOrEqual', 100);
			const filter4 = condition<TestItem, 'active'>('active', 'equals', true);

			const andGroup1 = and(filter1, filter2);
			const andGroup2 = and(filter3, filter4);
			const orGroup = or(andGroup1, andGroup2);

			expectLogicalType(orGroup);
			expect(orGroup.operator).toBe('OR');
			expect(orGroup.filterGroups).toHaveLength(2);
			expect(orGroup.filterGroups[0]).toBe(andGroup1);
			expect(orGroup.filterGroups[1]).toBe(andGroup2);
		});

		it('should handle multiple levels of nesting with different operators', () => {
			// ((name = 'John' OR name = 'Jane') AND price > 25) OR (active = true AND (category = 'books' OR category = 'electronics'))
			const nameJohn = condition<TestItem, 'name'>('name', 'equals', 'John');
			const nameJane = condition<TestItem, 'name'>('name', 'equals', 'Jane');
			const priceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 25);
			const activeFilter = condition<TestItem, 'active'>('active', 'equals', true);
			const categoryBooks = condition<TestItem, 'category'>('category', 'equals', 'books');
			const categoryElectronics = condition<TestItem, 'category'>(
				'category',
				'equals',
				'electronics'
			);

			const nameOr = or(nameJohn, nameJane);
			const leftAnd = and(nameOr, priceFilter);
			const categoryOr = or(categoryBooks, categoryElectronics);
			const rightAnd = and(activeFilter, categoryOr);
			const finalOr = or(leftAnd, rightAnd);

			expectLogicalType(finalOr);
			expect(finalOr.operator).toBe('OR');
			expect(finalOr.filterGroups).toHaveLength(2);

			// Verify left side structure
			expectLogicalType(leftAnd);
			expect(leftAnd.filterGroups[0]).toBe(nameOr);
			expect(leftAnd.filterGroups[1]).toBe(priceFilter);

			// Verify right side structure
			expectLogicalType(rightAnd);
			expect(rightAnd.filterGroups[0]).toBe(activeFilter);
			expect(rightAnd.filterGroups[1]).toBe(categoryOr);

			expectLogicalType(categoryOr);
			expect(categoryOr.filterGroups).toHaveLength(2);
		});
	});

	describe('Performance and edge cases', () => {
		it('should handle large number of conditions in AND group', () => {
			const filters = Array.from({ length: 50 }, (_, i) =>
				condition<TestItem, 'name'>('name', 'equals', `value${i}`)
			);
			const andGroup = and(...filters);

			expectLogicalType(andGroup);
			expect(andGroup.filterGroups).toHaveLength(50);
			expect(andGroup.operator).toBe('AND');
		});

		it('should handle large number of conditions in OR group', () => {
			const filters = Array.from({ length: 50 }, (_, i) =>
				condition<TestItem, 'category'>('category', 'equals', `category${i}`)
			);
			const orGroup = or(...filters);

			expectLogicalType(orGroup);
			expect(orGroup.filterGroups).toHaveLength(50);
			expect(orGroup.operator).toBe('OR');
		});

		it('should maintain referential integrity in complex structures', () => {
			const baseFilter = condition<TestItem, 'name'>('name', 'equals', 'shared');
			const group1 = and(baseFilter, condition<TestItem, 'price'>('price', 'equals', 100));
			const group2 = or(baseFilter, condition<TestItem, 'category'>('category', 'equals', 'test'));

			expectLogicalType(group1);
			expectLogicalType(group2);
			expect(group1.filterGroups[0]).toBe(baseFilter);
			expect(group2.filterGroups[0]).toBe(baseFilter);
			expect(group1.filterGroups[0]).toBe(group2.filterGroups[0]);
		});
	});
});
