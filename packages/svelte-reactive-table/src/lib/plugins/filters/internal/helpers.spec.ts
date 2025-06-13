import type { Row } from '$lib/core/index.js';
import { describe, expect, it, vi } from 'vitest';
import type { FilterGroup } from '../types/index.js';
import { removeFilterGroupById, countFilterConditions, evaluateFilterGroup } from './helpers.js';

// Define a simple type for testing
type TestItem = {
	id: number;
	name: string;
	category: string;
	price: number;
	active: boolean;
	description?: string;
};

// Create sample data for testing
const createTestRow = (data: TestItem): Row<TestItem> => ({
	id: data.id,
	original: data,
	cells: Object.entries(data).map(([key, value]) => ({ key: key as keyof TestItem, value }))
});

describe('helpers', () => {
	describe('removeFilterGroupById', () => {
		it('should remove a filter group by ID', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'group-1',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'filter-2',
						type: 'filter',
						filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
					},
					{
						id: 'filter-3',
						type: 'filter',
						filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
					}
				]
			};

			const updatedGroup = removeFilterGroupById(filterGroup, 'filter-1');
			expect(updatedGroup).toEqual({
				id: 'group-1',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-2',
						type: 'filter',
						filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
					},
					{
						id: 'filter-3',
						type: 'filter',
						filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
					}
				]
			});
		});

		it('should return the same group if ID does not match any filter', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'group-1',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'filter-2',
						type: 'filter',
						filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
					},
					{
						id: 'filter-3',
						type: 'filter',
						filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
					}
				]
			};

			const updatedGroup = removeFilterGroupById(filterGroup, 'non-existent-id');
			expect(updatedGroup).toEqual(filterGroup);
		});

		it('should return an simple filter group if it contains only one filter after removal', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'group-1',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'filter-2',
						type: 'filter',
						filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
					}
				]
			};
			const updatedGroup = removeFilterGroupById(filterGroup, 'filter-2');
			expect(updatedGroup).toEqual({
				id: 'filter-1',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			});
		});

		it('should handle nested logical groups', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'nested-group',
						type: 'logical',
						operator: 'OR',
						filterGroups: [
							{
								id: 'filter-2',
								type: 'filter',
								filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
							},
							{
								id: 'filter-3',
								type: 'filter',
								filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
							}
						]
					}
				]
			};

			const updatedGroup = removeFilterGroupById(filterGroup, 'filter-2');
			expect(updatedGroup).toEqual({
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'filter-3',
						type: 'filter',
						filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
					}
				]
			});
		});

		it('should return null when removing the root filter group', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			};

			const result = removeFilterGroupById(filterGroup, 'root');
			expect(result).toBeNull();
		});

		it('should return null when removing root logical group', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					}
				]
			};

			const result = removeFilterGroupById(filterGroup, 'root');
			expect(result).toBeNull();
		});

		it('should handle removing entire nested logical group', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'nested-group',
						type: 'logical',
						operator: 'OR',
						filterGroups: [
							{
								id: 'filter-2',
								type: 'filter',
								filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
							}
						]
					}
				]
			};

			const updatedGroup = removeFilterGroupById(filterGroup, 'nested-group');
			expect(updatedGroup).toEqual({
				id: 'filter-1',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			});
		});

		it('should return null when all child groups are removed', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					}
				]
			};

			const result = removeFilterGroupById(filterGroup, 'filter-1');
			expect(result).toBeNull();
		});

		it('should simplify logical group with single child even when removing non-existent ID', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					}
				]
			};

			const result = removeFilterGroupById(filterGroup, 'non-existent-id');
			// Should return the single child filter, not the original logical group
			expect(result).toEqual({
				id: 'filter-1',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			});
		});

		it('should simplify nested logical groups with single children even when removing non-existent ID', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'nested-group',
						type: 'logical',
						operator: 'OR',
						filterGroups: [
							{
								id: 'filter-1',
								type: 'filter',
								filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
							}
						]
					}
				]
			};

			const result = removeFilterGroupById(filterGroup, 'non-existent-id');
			// Should simplify by removing unnecessary nesting
			expect(result).toEqual({
				id: 'filter-1',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			});
		});

		it('should not simplify when logical group has multiple children and ID does not exist', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'filter-2',
						type: 'filter',
						filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
					}
				]
			};

			const result = removeFilterGroupById(filterGroup, 'non-existent-id');
			// Should return the original group unchanged since it has multiple children
			expect(result).toEqual(filterGroup);
		});

		it('should handle deeply nested single-child simplification with non-existent ID', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'level-1',
						type: 'logical',
						operator: 'OR',
						filterGroups: [
							{
								id: 'level-2',
								type: 'logical',
								operator: 'AND',
								filterGroups: [
									{
										id: 'filter-1',
										type: 'filter',
										filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
									}
								]
							}
						]
					}
				]
			};

			const result = removeFilterGroupById(filterGroup, 'non-existent-id');
			// Should collapse all the unnecessary nesting
			expect(result).toEqual({
				id: 'filter-1',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			});
		});

		it('should handle mixed scenario: remove existing ID and simplify remaining structure', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'to-remove',
						type: 'filter',
						filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
					},
					{
						id: 'nested-group',
						type: 'logical',
						operator: 'OR',
						filterGroups: [
							{
								id: 'filter-1',
								type: 'filter',
								filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
							}
						]
					}
				]
			};

			const result = removeFilterGroupById(filterGroup, 'to-remove');
			// Should remove the 'to-remove' filter and simplify the nested structure
			expect(result).toEqual({
				id: 'filter-1',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			});
		});

		it('should handle edge case: empty logical group after filtering with non-existent ID', () => {
			// This tests a theoretical edge case where a logical group could become empty
			// even when searching for a non-existent ID (though this shouldn't happen with current implementation)
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: []
			};

			const result = removeFilterGroupById(filterGroup, 'non-existent-id');
			// Should return null for empty logical groups
			expect(result).toBeNull();
		});
	});

	describe('countFilterConditions', () => {
		it('should count 1 for a simple filter', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'filter-1',
				type: 'filter',
				filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
			};

			const count = countFilterConditions(filterGroup);
			expect(count).toBe(1);
		});

		it('should count multiple filters in a logical group', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'group-1',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'filter-2',
						type: 'filter',
						filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
					},
					{
						id: 'filter-3',
						type: 'filter',
						filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
					}
				]
			};

			const count = countFilterConditions(filterGroup);
			expect(count).toBe(3);
		});

		it('should count filters in nested logical groups', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'root',
				type: 'logical',
				operator: 'AND',
				filterGroups: [
					{
						id: 'filter-1',
						type: 'filter',
						filter: { key: 'name', value: 'Test', comparisonType: 'equals' }
					},
					{
						id: 'nested-group',
						type: 'logical',
						operator: 'OR',
						filterGroups: [
							{
								id: 'filter-2',
								type: 'filter',
								filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
							},
							{
								id: 'filter-3',
								type: 'filter',
								filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
							}
						]
					}
				]
			};

			const count = countFilterConditions(filterGroup);
			expect(count).toBe(3);
		});

		it('should return 0 for empty logical group', () => {
			const filterGroup: FilterGroup<TestItem> = {
				id: 'empty-group',
				type: 'logical',
				operator: 'AND',
				filterGroups: []
			};

			const count = countFilterConditions(filterGroup);
			expect(count).toBe(0);
		});
	});

	describe('evaluateFilterGroup', () => {
		const testData: TestItem = {
			id: 1,
			name: 'Test Product',
			category: 'Electronics',
			price: 150,
			active: true,
			description: 'A test product'
		};

		const testRow = createTestRow(testData);

		describe('single filter evaluation', () => {
			it('should evaluate equals filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'Test Product', comparisonType: 'equals' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'name', value: 'Different Product', comparisonType: 'equals' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate greaterThan filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'price', value: 200, comparisonType: 'greaterThan' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should default to equals when no comparison type is provided', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'Test Product' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);
			});

			it('should evaluate notEquals filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'Different Product', comparisonType: 'notEquals' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'name', value: 'Test Product', comparisonType: 'notEquals' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate contains filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'test', comparisonType: 'contains' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'name', value: 'xyz', comparisonType: 'contains' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate startsWith filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'test', comparisonType: 'startsWith' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'name', value: 'product', comparisonType: 'startsWith' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate endsWith filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'product', comparisonType: 'endsWith' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'name', value: 'test', comparisonType: 'endsWith' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate lessThan filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'price', value: 200, comparisonType: 'lessThan' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'price', value: 100, comparisonType: 'lessThan' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate greaterThanOrEqual filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'price', value: 150, comparisonType: 'greaterThanOrEqual' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupTrue2: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'price', value: 100, comparisonType: 'greaterThanOrEqual' }
				};

				expect(evaluateFilterGroup(filterGroupTrue2, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-3',
					type: 'filter',
					filter: { key: 'price', value: 200, comparisonType: 'greaterThanOrEqual' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate lessThanOrEqual filter correctly', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'price', value: 150, comparisonType: 'lessThanOrEqual' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupTrue2: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'price', value: 200, comparisonType: 'lessThanOrEqual' }
				};

				expect(evaluateFilterGroup(filterGroupTrue2, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-3',
					type: 'filter',
					filter: { key: 'price', value: 100, comparisonType: 'lessThanOrEqual' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);
			});

			it('should evaluate in filter correctly', () => {
				const filterGroup = {
					id: 'filter-1',
					type: 'filter',
					filter: {
						key: 'category',
						value: ['Electronics', 'Books', 'Clothing'],
						comparisonType: 'in'
					}
				} as unknown as FilterGroup<TestItem>;

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'category', value: ['Books', 'Clothing'], comparisonType: 'in' }
				} as unknown as FilterGroup<TestItem>;

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);

				// Test with non-array filter value
				const filterGroupNonArray: FilterGroup<TestItem> = {
					id: 'filter-3',
					type: 'filter',
					filter: { key: 'category', value: 'Electronics', comparisonType: 'in' }
				};

				expect(evaluateFilterGroup(filterGroupNonArray, testRow)).toBe(false);
			});

			it('should evaluate notIn filter correctly', () => {
				const filterGroup = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'category', value: ['Books', 'Clothing'], comparisonType: 'notIn' }
				} as unknown as FilterGroup<TestItem>;

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse = {
					id: 'filter-2',
					type: 'filter',
					filter: {
						key: 'category',
						value: ['Electronics', 'Books', 'Clothing'],
						comparisonType: 'notIn'
					}
				} as unknown as FilterGroup<TestItem>;

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(false);

				// Test with non-array filter value
				const filterGroupNonArray: FilterGroup<TestItem> = {
					id: 'filter-3',
					type: 'filter',
					filter: { key: 'category', value: 'Electronics', comparisonType: 'notIn' }
				};

				expect(evaluateFilterGroup(filterGroupNonArray, testRow)).toBe(true);
			});

			it('should handle string comparison operations on non-string values gracefully', () => {
				// Test contains with number
				const filterGroupContains: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'price', value: '15', comparisonType: 'contains' }
				};

				expect(evaluateFilterGroup(filterGroupContains, testRow)).toBe(false);

				// Test startsWith with boolean
				const filterGroupStartsWith: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'active', value: 'true', comparisonType: 'startsWith' }
				};

				expect(evaluateFilterGroup(filterGroupStartsWith, testRow)).toBe(false);
			});

			it('should handle date comparisons', () => {
				// Extend test data with dates for this test
				const testDataWithDates = {
					...testData,
					createdAt: new Date('2023-01-01'),
					updatedAt: new Date('2023-06-01')
				};

				const testRowWithDates = createTestRow(testDataWithDates);

				const filterGroupGreater = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'createdAt', value: new Date('2022-12-01'), comparisonType: 'greaterThan' }
				} as unknown as FilterGroup<TestItem>;

				expect(evaluateFilterGroup(filterGroupGreater, testRowWithDates)).toBe(true);

				const filterGroupLess = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'updatedAt', value: new Date('2023-12-01'), comparisonType: 'lessThan' }
				} as unknown as FilterGroup<TestItem>;

				expect(evaluateFilterGroup(filterGroupLess, testRowWithDates)).toBe(true);
			});

			it('should handle string comparisons with localeCompare', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'Apple Product', comparisonType: 'greaterThan' }
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupFalse: FilterGroup<TestItem> = {
					id: 'filter-2',
					type: 'filter',
					filter: { key: 'name', value: 'Zebra Product', comparisonType: 'lessThan' }
				};

				expect(evaluateFilterGroup(filterGroupFalse, testRow)).toBe(true);
			});
		});

		describe('logical AND evaluation', () => {
			it('should return true when all conditions are met', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'and-group',
					type: 'logical',
					operator: 'AND',
					filterGroups: [
						{
							id: 'filter-1',
							type: 'filter',
							filter: { key: 'name', value: 'Test Product', comparisonType: 'equals' }
						},
						{
							id: 'filter-2',
							type: 'filter',
							filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
						},
						{
							id: 'filter-3',
							type: 'filter',
							filter: { key: 'active', value: true, comparisonType: 'equals' }
						}
					]
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);
			});

			it('should return false when any condition is not met', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'and-group',
					type: 'logical',
					operator: 'AND',
					filterGroups: [
						{
							id: 'filter-1',
							type: 'filter',
							filter: { key: 'name', value: 'Test Product', comparisonType: 'equals' }
						},
						{
							id: 'filter-2',
							type: 'filter',
							filter: { key: 'price', value: 200, comparisonType: 'greaterThan' }
						}
					]
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(false);
			});
		});

		describe('logical OR evaluation', () => {
			it('should return true when any condition is met', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'or-group',
					type: 'logical',
					operator: 'OR',
					filterGroups: [
						{
							id: 'filter-1',
							type: 'filter',
							filter: { key: 'name', value: 'Different Product', comparisonType: 'equals' }
						},
						{
							id: 'filter-2',
							type: 'filter',
							filter: { key: 'price', value: 100, comparisonType: 'greaterThan' }
						}
					]
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);
			});

			it('should return false when no conditions are met', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'or-group',
					type: 'logical',
					operator: 'OR',
					filterGroups: [
						{
							id: 'filter-1',
							type: 'filter',
							filter: { key: 'name', value: 'Different Product', comparisonType: 'equals' }
						},
						{
							id: 'filter-2',
							type: 'filter',
							filter: { key: 'price', value: 200, comparisonType: 'greaterThan' }
						}
					]
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(false);
			});
		});

		describe('nested logical evaluation', () => {
			it('should handle complex nested AND/OR logic', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'root',
					type: 'logical',
					operator: 'AND',
					filterGroups: [
						{
							id: 'filter-1',
							type: 'filter',
							filter: { key: 'active', value: true, comparisonType: 'equals' }
						},
						{
							id: 'nested-or',
							type: 'logical',
							operator: 'OR',
							filterGroups: [
								{
									id: 'filter-2',
									type: 'filter',
									filter: { key: 'category', value: 'Electronics', comparisonType: 'equals' }
								},
								{
									id: 'filter-3',
									type: 'filter',
									filter: { key: 'price', value: 200, comparisonType: 'greaterThan' }
								}
							]
						}
					]
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);
			});

			it('should handle empty filter groups', () => {
				const filterGroup: FilterGroup<TestItem> = {
					id: 'empty-and',
					type: 'logical',
					operator: 'AND',
					filterGroups: []
				};

				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);

				const filterGroupOr: FilterGroup<TestItem> = {
					id: 'empty-or',
					type: 'logical',
					operator: 'OR',
					filterGroups: []
				};

				expect(evaluateFilterGroup(filterGroupOr, testRow)).toBe(false);
			});
		});

		describe('edge cases and error handling', () => {
			it('should handle unknown comparison types gracefully', () => {
				const filterGroup = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'name', value: 'Test Product', comparisonType: 'unknownType' }
				} as unknown as FilterGroup<TestItem>;

				// Should default to equals comparison
				expect(evaluateFilterGroup(filterGroup, testRow)).toBe(true);
			});

			it('should handle null and undefined values', () => {
				const testDataWithNull: TestItem = {
					id: 2,
					name: 'Test Product',
					category: 'Electronics',
					price: 150,
					active: true,
					description: undefined
				};

				const testRowWithNull = createTestRow(testDataWithNull);

				const filterGroup: FilterGroup<TestItem> = {
					id: 'filter-1',
					type: 'filter',
					filter: { key: 'description', value: undefined, comparisonType: 'equals' }
				};

				expect(evaluateFilterGroup(filterGroup, testRowWithNull)).toBe(true);
			});

			it('should handle different data types correctly', () => {
				const filterGroupBoolean: FilterGroup<TestItem> = {
					id: 'filter-boolean',
					type: 'filter',
					filter: { key: 'active', value: false, comparisonType: 'equals' }
				};

				expect(evaluateFilterGroup(filterGroupBoolean, testRow)).toBe(false);

				const filterGroupNumber: FilterGroup<TestItem> = {
					id: 'filter-number',
					type: 'filter',
					filter: { key: 'id', value: 1, comparisonType: 'equals' }
				};

				expect(evaluateFilterGroup(filterGroupNumber, testRow)).toBe(true);
			});

			it('should return true for unknown filter group types', () => {
				const unknownFilterGroup = {
					id: 'unknown',
					type: 'unknown',
					someProperty: 'value'
				} as unknown as FilterGroup<TestItem>;

				expect(evaluateFilterGroup(unknownFilterGroup, testRow)).toBe(true);
			});
		});

		describe('console warning for unknown logical operators', () => {
			it('should handle unknown logical operators and default to AND', () => {
				const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

				const filterGroup = {
					id: 'unknown-operator',
					type: 'logical',
					operator: 'XOR',
					filterGroups: [
						{
							id: 'filter-1',
							type: 'filter',
							filter: { key: 'name', value: 'Test Product', comparisonType: 'equals' }
						},
						{
							id: 'filter-2',
							type: 'filter',
							filter: { key: 'active', value: true, comparisonType: 'equals' }
						}
					]
				} as unknown as FilterGroup<TestItem>;

				const result = evaluateFilterGroup(filterGroup, testRow);

				expect(result).toBe(true); // Should default to AND behavior
				expect(consoleSpy).toHaveBeenCalledWith(
					'Unknown logical operator: XOR. Defaulting to AND.'
				);

				consoleSpy.mockRestore();
			});
		});
	});
});
