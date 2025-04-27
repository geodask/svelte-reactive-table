import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactiveSorting, type ReactiveSortingOutput } from './index.js';
import type { Row } from '../../core/table.svelte.js';

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
	let sortingOutput: ReactiveSortingOutput<TestItem>;

	beforeEach(() => {
		rows = createTestRows();
		sortingOutput = reactiveSorting<TestItem>()(() => rows);
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

		// Null values should come first in ascending order
		expect(sortingOutput.rows[0].original.rating).toBe(null);
		expect(sortingOutput.rows[1].original.rating).toBe(3);
		expect(sortingOutput.rows[2].original.rating).toBe(4);
		expect(sortingOutput.rows[3].original.rating).toBe(5);
	});

	it('should support multi-column sorting', () => {
		// Initialize with multiSort enabled
		sortingOutput = reactiveSorting<TestItem>({ multiSort: true })(() => rows);

		// Sort by rating (null first, then ascending)
		sortingOutput.state.toggleSort('rating');
		// Secondary sort by name
		sortingOutput.state.toggleSort('name');

		expect(sortingOutput.state.columnSortings).toHaveLength(2);
		expect(sortingOutput.state.multiSort).toBe(true);

		// Rows should be sorted first by rating, then by name
		// The null rating should come first, then by rating ascending, with name as tiebreaker
		expect(sortingOutput.rows[0].original.rating).toBe(null);
		expect(sortingOutput.rows[1].original.rating).toBe(3);
		expect(sortingOutput.rows[2].original.rating).toBe(4);
		expect(sortingOutput.rows[3].original.rating).toBe(5);
	});

	it('should cycle through asc, desc, then remove in multi-sort mode', () => {
		// Initialize with multiSort enabled
		sortingOutput = reactiveSorting<TestItem>({ multiSort: true })(() => rows);

		sortingOutput.state.toggleSort('name'); // First toggle - asc
		expect(sortingOutput.state.columnSortings[0].direction).toBe('asc');

		sortingOutput.state.toggleSort('name'); // Second toggle - desc
		expect(sortingOutput.state.columnSortings[0].direction).toBe('desc');

		sortingOutput.state.toggleSort('name'); // Third toggle - removes the sorting completely
		// The column sort should be removed when toggled past desc in multi-sort mode
		expect(sortingOutput.state.columnSortings).toHaveLength(0);
	});

	it('should clear all sorts', () => {
		// Setup multiple sorts
		sortingOutput = reactiveSorting<TestItem>({ multiSort: true })(() => rows);

		sortingOutput.state.toggleSort('name');
		sortingOutput.state.toggleSort('id');

		expect(sortingOutput.state.columnSortings).toHaveLength(2);

		// Clear all sorts
		sortingOutput.state.clearSort();

		expect(sortingOutput.state.columnSortings).toHaveLength(0);
		// Rows should be in original order
		expect(sortingOutput.rows[0].id).toBe(1);
		expect(sortingOutput.rows[1].id).toBe(2);
		expect(sortingOutput.rows[2].id).toBe(3);
		expect(sortingOutput.rows[3].id).toBe(4);
	});

	it('should use custom comparators', () => {
		// Custom comparator for dates
		const dateComparator = (a: string, b: string) => {
			return new Date(a).getTime() - new Date(b).getTime();
		};

		sortingOutput = reactiveSorting<TestItem>({
			comparators: {
				date: dateComparator
			}
		})(() => rows);

		sortingOutput.state.toggleSort('date');

		// Dates should be sorted chronologically
		expect(sortingOutput.rows[0].original.date).toBe('2023-01-20');
		expect(sortingOutput.rows[1].original.date).toBe('2023-02-05');
		expect(sortingOutput.rows[2].original.date).toBe('2023-03-15');
		expect(sortingOutput.rows[3].original.date).toBe('2023-04-10');
	});

	it('should initialize with predefined column sortings', () => {
		const customSortingOutput = reactiveSorting<TestItem>({
			columnSortings: [{ key: 'id', direction: 'desc' }]
		})(() => rows);

		// Should be pre-sorted by id descending
		expect(customSortingOutput.state.columnSortings).toHaveLength(1);
		expect(customSortingOutput.state.columnSortings[0].key).toBe('id');
		expect(customSortingOutput.state.columnSortings[0].direction).toBe('desc');

		expect(customSortingOutput.rows[0].id).toBe(4);
		expect(customSortingOutput.rows[1].id).toBe(3);
		expect(customSortingOutput.rows[2].id).toBe(2);
		expect(customSortingOutput.rows[3].id).toBe(1);
	});

	it('should handle empty data', () => {
		const sortingOutput = reactiveSorting<TestItem>({
			columnSortings: [{ key: 'id', direction: 'desc' }]
		})(() => []);

		expect(sortingOutput.rows).toHaveLength(0);

		// Should not throw errors when sorting empty data
		sortingOutput.state.toggleSort('name');
		expect(sortingOutput.state.columnSortings).toHaveLength(1);
		expect(sortingOutput.rows).toHaveLength(0);
	});
});
