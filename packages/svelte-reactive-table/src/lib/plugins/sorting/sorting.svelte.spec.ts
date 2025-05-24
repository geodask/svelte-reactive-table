import type { PluginOutput, Row } from '$lib/core/index.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { reactiveSorting } from './index.js';
import type { SortingState } from './types/index.js';

// Define a simple type for testing
type TestItem = {
	id: number;
	name: string;
	date: string;
	rating: number | null;
};

// Create sample rows for testing
const createTestRows = (): Row<TestItem>[] => [
	{
		id: 1,
		original: { id: 1, name: 'Item C', date: '2023-03-15', rating: 4 },
		cells: [
			{ key: 'id', value: 1 },
			{ key: 'name', value: 'Item C' },
			{ key: 'date', value: '2023-03-15' },
			{ key: 'rating', value: 4 }
		]
	},
	{
		id: 2,
		original: { id: 2, name: 'Item A', date: '2023-01-20', rating: 5 },
		cells: [
			{ key: 'id', value: 2 },
			{ key: 'name', value: 'Item A' },
			{ key: 'date', value: '2023-01-20' },
			{ key: 'rating', value: 5 }
		]
	},
	{
		id: 3,
		original: { id: 3, name: 'Item D', date: '2023-04-10', rating: null },
		cells: [
			{ key: 'id', value: 3 },
			{ key: 'name', value: 'Item D' },
			{ key: 'date', value: '2023-04-10' },
			{ key: 'rating', value: null }
		]
	},
	{
		id: 4,
		original: { id: 4, name: 'Item B', date: '2023-02-05', rating: 3 },
		cells: [
			{ key: 'id', value: 4 },
			{ key: 'name', value: 'Item B' },
			{ key: 'date', value: '2023-02-05' },
			{ key: 'rating', value: 3 }
		]
	}
];

describe('reactiveSorting', () => {
	let rows: Row<TestItem>[];
	let sortingPlugin: ReturnType<typeof reactiveSorting<TestItem>>;
	let sortingOutput: PluginOutput<TestItem, SortingState<TestItem>>;

	beforeEach(() => {
		rows = createTestRows();
		sortingPlugin = reactiveSorting<TestItem>();
		sortingOutput = sortingPlugin.init(
			() => rows,
			() => []
		);
	});

	it('should initialize with default values', () => {
		expect(sortingOutput.state.columnSortings).toHaveLength(0);
		expect(sortingOutput.state.multiSort).toBe(false);
		// Initial rows should be unsorted (original order)
		expect(sortingOutput.rows).toHaveLength(4);
		expect(sortingOutput.rows[0].id).toBe(1);
		expect(sortingOutput.rows[1].id).toBe(2);
		expect(sortingOutput.rows[2].id).toBe(3);
		expect(sortingOutput.rows[3].id).toBe(4);
	});

	it('should sort by name ascending', () => {
		sortingOutput.state.toggleSort('name');

		expect(sortingOutput.state.columnSortings).toHaveLength(1);
		expect(sortingOutput.state.columnSortings[0].key).toBe('name');
		expect(sortingOutput.state.columnSortings[0].direction).toBe('asc');

		// Rows should be sorted by name in ascending order
		expect(sortingOutput.rows[0].original.name).toBe('Item A');
		expect(sortingOutput.rows[1].original.name).toBe('Item B');
		expect(sortingOutput.rows[2].original.name).toBe('Item C');
		expect(sortingOutput.rows[3].original.name).toBe('Item D');
	});

	it('should toggle sort direction from asc to desc', () => {
		sortingOutput.state.toggleSort('name'); // First toggle - asc
		sortingOutput.state.toggleSort('name'); // Second toggle - desc

		expect(sortingOutput.state.columnSortings).toHaveLength(1);
		expect(sortingOutput.state.columnSortings[0].direction).toBe('desc');

		// Rows should be sorted by name in descending order
		expect(sortingOutput.rows[0].original.name).toBe('Item D');
		expect(sortingOutput.rows[1].original.name).toBe('Item C');
		expect(sortingOutput.rows[2].original.name).toBe('Item B');
		expect(sortingOutput.rows[3].original.name).toBe('Item A');
	});

	it('should clear sort when toggling past desc in single-sort mode', () => {
		sortingOutput.state.toggleSort('name'); // First toggle - asc
		sortingOutput.state.toggleSort('name'); // Second toggle - desc
		sortingOutput.state.toggleSort('name'); // Third toggle - clear

		expect(sortingOutput.state.columnSortings).toHaveLength(0);

		// Rows should be back to original order
		expect(sortingOutput.rows[0].id).toBe(1);
		expect(sortingOutput.rows[1].id).toBe(2);
		expect(sortingOutput.rows[2].id).toBe(3);
		expect(sortingOutput.rows[3].id).toBe(4);
	});

	it('should handle null values correctly', () => {
		sortingOutput.state.toggleSort('rating');

		expect(sortingOutput.rows[0].original.rating).toBe(3);
		expect(sortingOutput.rows[1].original.rating).toBe(4);
		expect(sortingOutput.rows[2].original.rating).toBe(5);
		expect(sortingOutput.rows[3].original.rating).toBe(null);
	});

	it('should support multi-column sorting', () => {
		const multiSortPlugin = reactiveSorting<TestItem>({ multiSort: true });
		const multiSortOutput = multiSortPlugin.init(
			() => rows,
			() => []
		);

		multiSortOutput.state.toggleSort('rating');
		multiSortOutput.state.toggleSort('name');

		expect(multiSortOutput.state.columnSortings).toHaveLength(2);
		expect(multiSortOutput.state.multiSort).toBe(true);

		expect(multiSortOutput.rows[0].original.rating).toBe(3);
		expect(multiSortOutput.rows[1].original.rating).toBe(4);
		expect(multiSortOutput.rows[2].original.rating).toBe(5);
		expect(multiSortOutput.rows[3].original.rating).toBe(null);
	});

	it('should cycle through asc, desc, then remove in multi-sort mode', () => {
		// Initialize with multiSort enabled
		const multiSortPlugin = reactiveSorting<TestItem>({ multiSort: true });
		const multiSortOutput = multiSortPlugin.init(
			() => rows,
			() => []
		);

		multiSortOutput.state.toggleSort('name'); // First toggle - asc
		expect(multiSortOutput.state.columnSortings[0].direction).toBe('asc');

		multiSortOutput.state.toggleSort('name'); // Second toggle - desc
		expect(multiSortOutput.state.columnSortings[0].direction).toBe('desc');

		multiSortOutput.state.toggleSort('name'); // Third toggle - removes the sorting completely
		// The column sort should be removed when toggled past desc in multi-sort mode
		expect(multiSortOutput.state.columnSortings).toHaveLength(0);
	});

	it('should clear all sorts', () => {
		// Setup multiple sorts
		const multiSortPlugin = reactiveSorting<TestItem>({ multiSort: true });
		const multiSortOutput = multiSortPlugin.init(
			() => rows,
			() => []
		);

		multiSortOutput.state.toggleSort('name');
		multiSortOutput.state.toggleSort('id');

		expect(multiSortOutput.state.columnSortings).toHaveLength(2);

		// Clear all sorts
		multiSortOutput.state.clearSort();

		expect(multiSortOutput.state.columnSortings).toHaveLength(0);

		// Rows should be in original order
		expect(multiSortOutput.rows[0].id).toBe(1);
		expect(multiSortOutput.rows[1].id).toBe(2);
		expect(multiSortOutput.rows[2].id).toBe(3);
		expect(multiSortOutput.rows[3].id).toBe(4);
	});

	it('should use custom comparators', () => {
		// Custom comparator for dates that works with the value, not the whole item
		const dateComparator = (a: unknown, b: unknown): number => {
			if (typeof a === 'string' && typeof b === 'string') {
				return new Date(a).getTime() - new Date(b).getTime();
			}
			return 0;
		};

		// Create a plugin with custom comparator
		const customComparatorPlugin = reactiveSorting<TestItem>({
			comparators: {
				date: dateComparator
			}
		});
		const customComparatorOutput = customComparatorPlugin.init(
			() => rows,
			() => []
		);

		// Sort by date
		customComparatorOutput.state.toggleSort('date');

		// Dates should be sorted chronologically
		expect(customComparatorOutput.rows[0].original.date).toBe('2023-01-20');
		expect(customComparatorOutput.rows[1].original.date).toBe('2023-02-05');
		expect(customComparatorOutput.rows[2].original.date).toBe('2023-03-15');
		expect(customComparatorOutput.rows[3].original.date).toBe('2023-04-10');
	});

	it('should initialize with predefined column sortings', () => {
		// Create a plugin with predefined column sortings
		const presetSortPlugin = reactiveSorting<TestItem>({
			columnSortings: [{ key: 'id', direction: 'desc' }]
		});
		const presetSortOutput = presetSortPlugin.init(
			() => rows,
			() => []
		);

		// Should be pre-sorted by id descending
		expect(presetSortOutput.state.columnSortings).toHaveLength(1);
		expect(presetSortOutput.state.columnSortings[0].key).toBe('id');
		expect(presetSortOutput.state.columnSortings[0].direction).toBe('desc');

		expect(presetSortOutput.rows[0].id).toBe(4);
		expect(presetSortOutput.rows[1].id).toBe(3);
		expect(presetSortOutput.rows[2].id).toBe(2);
		expect(presetSortOutput.rows[3].id).toBe(1);
	});

	it('should handle empty data', () => {
		// Create a plugin with predefined column sortings
		const emptySortPlugin = reactiveSorting<TestItem>({
			columnSortings: [{ key: 'id', direction: 'desc' }]
		});
		const emptySortOutput = emptySortPlugin.init(
			() => [],
			() => []
		);

		expect(emptySortOutput.rows).toHaveLength(0);

		emptySortOutput.state.toggleSort('name');
		expect(emptySortOutput.state.columnSortings).toHaveLength(1);
	});
});
