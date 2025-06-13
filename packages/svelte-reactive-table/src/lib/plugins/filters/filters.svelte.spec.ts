import type { PluginOutput, Row } from '$lib/core/index.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { and, condition, or } from './builders.js';
import { reactiveFiltering } from './index.js';
import type { FiltersState } from './types/index.js';

// Define a simple type for testing
type TestItem = {
	id: number;
	name: string;
	category: string;
	price: number;
	active: boolean;
	description?: string;
};

// Create sample rows for testing
const createTestRows = (): Row<TestItem>[] => [
	{
		id: 1,
		original: {
			id: 1,
			name: 'Product A',
			category: 'Electronics',
			price: 99.99,
			active: true,
			description: 'Great product'
		},
		cells: [
			{ key: 'id', value: 1 },
			{ key: 'name', value: 'Product A' },
			{ key: 'category', value: 'Electronics' },
			{ key: 'price', value: 99.99 },
			{ key: 'active', value: true },
			{ key: 'description', value: 'Great product' }
		]
	},
	{
		id: 2,
		original: {
			id: 2,
			name: 'Product B',
			category: 'Books',
			price: 19.99,
			active: false,
			description: 'Nice book'
		},
		cells: [
			{ key: 'id', value: 2 },
			{ key: 'name', value: 'Product B' },
			{ key: 'category', value: 'Books' },
			{ key: 'price', value: 19.99 },
			{ key: 'active', value: false },
			{ key: 'description', value: 'Nice book' }
		]
	},
	{
		id: 3,
		original: {
			id: 3,
			name: 'Product C',
			category: 'Electronics',
			price: 149.99,
			active: true,
			description: 'Amazing gadget'
		},
		cells: [
			{ key: 'id', value: 3 },
			{ key: 'name', value: 'Product C' },
			{ key: 'category', value: 'Electronics' },
			{ key: 'price', value: 149.99 },
			{ key: 'active', value: true },
			{ key: 'description', value: 'Amazing gadget' }
		]
	},
	{
		id: 4,
		original: { id: 4, name: 'Product D', category: 'Books', price: 29.99, active: true },
		cells: [
			{ key: 'id', value: 4 },
			{ key: 'name', value: 'Product D' },
			{ key: 'category', value: 'Books' },
			{ key: 'price', value: 29.99 },
			{ key: 'active', value: true },
			{ key: 'description', value: undefined }
		]
	}
];

describe('reactiveFiltering', () => {
	let rows: Row<TestItem>[];
	let filteringPlugin: ReturnType<typeof reactiveFiltering<TestItem>>;
	let filteringOutput: PluginOutput<TestItem, FiltersState<TestItem>>;

	beforeEach(() => {
		rows = createTestRows();
		filteringPlugin = reactiveFiltering<TestItem>();
		filteringOutput = filteringPlugin.init(
			() => rows,
			() => []
		);
	});

	describe('initialization', () => {
		it('should initialize with default values', () => {
			expect(filteringOutput.state.filterGroup).toBeUndefined();
			expect(filteringOutput.state.count).toBe(0);
			expect(filteringOutput.state.hasActiveFilters).toBe(false);
			expect(filteringOutput.rows).toHaveLength(4);
		});

		it('should initialize with provided filter group', () => {
			const initialFilter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			const pluginWithFilter = reactiveFiltering<TestItem>({ filterGroup: initialFilter });
			const output = pluginWithFilter.init(
				() => rows,
				() => []
			);

			expect(output.state.filterGroup).toEqual(initialFilter);
			expect(output.state.count).toBe(1);
			expect(output.state.hasActiveFilters).toBe(true);
			expect(output.rows).toHaveLength(2); // Only Electronics products
		});
	});

	describe('filtering functionality', () => {
		it('should filter by exact match', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			filteringOutput.state.setFilterGroup(categoryFilter);

			expect(filteringOutput.state.hasActiveFilters).toBe(true);
			expect(filteringOutput.state.count).toBe(1);
			expect(filteringOutput.rows).toHaveLength(2);
			expect(filteringOutput.rows.every((row) => row.original.category === 'Electronics')).toBe(
				true
			);
		});

		it('should filter by contains', () => {
			const nameFilter = condition<TestItem, 'name'>('name', 'contains', 'Product');
			filteringOutput.state.setFilterGroup(nameFilter);

			expect(filteringOutput.rows).toHaveLength(4); // All products contain "Product"
		});

		it('should filter by greater than', () => {
			const priceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 50);
			filteringOutput.state.setFilterGroup(priceFilter);

			expect(filteringOutput.rows).toHaveLength(2); // Products A and C
			expect(filteringOutput.rows.every((row) => row.original.price > 50)).toBe(true);
		});

		it('should filter by boolean values', () => {
			const activeFilter = condition<TestItem, 'active'>('active', 'equals', true);
			filteringOutput.state.setFilterGroup(activeFilter);

			expect(filteringOutput.rows).toHaveLength(3); // Products A, C, and D
			expect(filteringOutput.rows.every((row) => row.original.active === true)).toBe(true);
		});

		it('should handle empty filter gracefully', () => {
			filteringOutput.state.setFilterGroup(undefined);

			expect(filteringOutput.state.hasActiveFilters).toBe(false);
			expect(filteringOutput.state.count).toBe(0);
			expect(filteringOutput.rows).toHaveLength(4); // All rows should be visible
		});
	});

	describe('logical operations', () => {
		it('should handle AND operations', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			const priceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 100);
			const andFilter = and(categoryFilter, priceFilter);

			filteringOutput.state.setFilterGroup(andFilter);

			expect(filteringOutput.state.count).toBe(2);
			expect(filteringOutput.rows).toHaveLength(1); // Only Product C
			expect(filteringOutput.rows[0].original.name).toBe('Product C');
		});

		it('should handle OR operations', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Books');
			const priceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 100);
			const orFilter = or(categoryFilter, priceFilter);

			filteringOutput.state.setFilterGroup(orFilter);

			expect(filteringOutput.state.count).toBe(2);
			expect(filteringOutput.rows).toHaveLength(3); // Products B, C, and D
		});

		it('should handle complex nested logical operations', () => {
			const booksFilter = condition<TestItem, 'category'>('category', 'equals', 'Books');
			const highPriceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 100);
			const activeFilter = condition<TestItem, 'active'>('active', 'equals', true);

			// (Books OR high price) AND active
			const complexFilter = and(or(booksFilter, highPriceFilter), activeFilter);

			filteringOutput.state.setFilterGroup(complexFilter);

			expect(filteringOutput.rows).toHaveLength(2); // Products C and D
		});
	});

	describe('state management', () => {
		it('should add filter groups with AND operator', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			const priceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 100);

			filteringOutput.state.setFilterGroup(categoryFilter);
			filteringOutput.state.addFilterGroup(priceFilter, 'AND');

			expect(filteringOutput.state.count).toBe(2);
			expect(filteringOutput.rows).toHaveLength(1); // Only Product C
		});

		it('should add filter groups with OR operator', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Books');
			const priceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 100);

			filteringOutput.state.setFilterGroup(categoryFilter);
			filteringOutput.state.addFilterGroup(priceFilter, 'OR');

			expect(filteringOutput.state.count).toBe(2);
			expect(filteringOutput.rows).toHaveLength(3); // Products B, C, and D
		});

		it('should set first filter group when adding to empty state', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');

			filteringOutput.state.addFilterGroup(categoryFilter, 'AND');

			expect(filteringOutput.state.filterGroup).toEqual(categoryFilter);
			expect(filteringOutput.state.count).toBe(1);
		});

		it('should remove filter groups by ID', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			const priceFilter = condition<TestItem, 'price'>('price', 'greaterThan', 100);
			const andFilter = and(categoryFilter, priceFilter);

			filteringOutput.state.setFilterGroup(andFilter);

			// Remove the category filter
			filteringOutput.state.removeFilterGroup(categoryFilter.id);

			expect(filteringOutput.state.count).toBe(1);
			expect(filteringOutput.rows).toHaveLength(1); // Only Product C (price > 100)
		});

		it('should clear all filters', () => {
			const categoryFilter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');
			filteringOutput.state.setFilterGroup(categoryFilter);

			expect(filteringOutput.state.hasActiveFilters).toBe(true);

			filteringOutput.state.clearFilters();

			expect(filteringOutput.state.hasActiveFilters).toBe(false);
			expect(filteringOutput.state.count).toBe(0);
			expect(filteringOutput.rows).toHaveLength(4);
		});
	});

	describe('return values', () => {
		it('should return the state from all state methods', () => {
			const filter = condition<TestItem, 'category'>('category', 'equals', 'Electronics');

			const result1 = filteringOutput.state.setFilterGroup(filter);
			const result2 = filteringOutput.state.addFilterGroup(
				condition<TestItem, 'active'>('active', 'equals', true),
				'AND'
			);
			const result3 = filteringOutput.state.removeFilterGroup('non-existent-id');
			const result4 = filteringOutput.state.clearFilters();

			expect(result1).toBe(filteringOutput.state);
			expect(result2).toBe(filteringOutput.state);
			expect(result3).toBe(filteringOutput.state);
			expect(result4).toBe(filteringOutput.state);
		});
	});

	describe('plugin metadata', () => {
		it('should have correct plugin ID', () => {
			expect(filteringPlugin.id).toBe('filters');
		});

		it('should provide access to columns', () => {
			expect(filteringOutput.columns).toEqual([]);
		});
	});
});
