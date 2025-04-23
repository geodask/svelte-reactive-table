import { beforeEach, describe, expect, it } from 'vitest';
import { reactivePagination, type ReactivePagination } from './pagination.svelte.js';
import type { Row } from './table.svelte.js';

// Define a simple type for testing
type TestItem = {
	id: number;
	name: string;
};

// Create sample rows for testing
const createTestRows = (): Row<TestItem>[] => [
	{
		id: 1,
		original: { id: 1, name: 'Item 1' },
		cells: [
			{ key: 'id', value: 1 },
			{ key: 'name', value: 'Item 1' }
		]
	},
	{
		id: 2,
		original: { id: 2, name: 'Item 2' },
		cells: [
			{ key: 'id', value: 2 },
			{ key: 'name', value: 'Item 2' }
		]
	},
	{
		id: 3,
		original: { id: 3, name: 'Item 3' },
		cells: [
			{ key: 'id', value: 3 },
			{ key: 'name', value: 'Item 3' }
		]
	},
	{
		id: 4,
		original: { id: 4, name: 'Item 4' },
		cells: [
			{ key: 'id', value: 4 },
			{ key: 'name', value: 'Item 4' }
		]
	},
	{
		id: 5,
		original: { id: 5, name: 'Item 5' },
		cells: [
			{ key: 'id', value: 5 },
			{ key: 'name', value: 'Item 5' }
		]
	},
	{
		id: 6,
		original: { id: 6, name: 'Item 6' },
		cells: [
			{ key: 'id', value: 6 },
			{ key: 'name', value: 'Item 6' }
		]
	},
	{
		id: 7,
		original: { id: 7, name: 'Item 7' },
		cells: [
			{ key: 'id', value: 7 },
			{ key: 'name', value: 'Item 7' }
		]
	},
	{
		id: 8,
		original: { id: 8, name: 'Item 8' },
		cells: [
			{ key: 'id', value: 8 },
			{ key: 'name', value: 'Item 8' }
		]
	},
	{
		id: 9,
		original: { id: 9, name: 'Item 9' },
		cells: [
			{ key: 'id', value: 9 },
			{ key: 'name', value: 'Item 9' }
		]
	},
	{
		id: 10,
		original: { id: 10, name: 'Item 10' },
		cells: [
			{ key: 'id', value: 10 },
			{ key: 'name', value: 'Item 10' }
		]
	},
	{
		id: 11,
		original: { id: 11, name: 'Item 11' },
		cells: [
			{ key: 'id', value: 11 },
			{ key: 'name', value: 'Item 11' }
		]
	},
	{
		id: 12,
		original: { id: 12, name: 'Item 12' },
		cells: [
			{ key: 'id', value: 12 },
			{ key: 'name', value: 'Item 12' }
		]
	}
];

describe('reactivePagination', () => {
	let rows: Row<TestItem>[];
	let getAllRows: () => Row<TestItem>[];
	let pagination: ReactivePagination<TestItem>;

	beforeEach(() => {
		rows = createTestRows();
		getAllRows = () => rows;
		pagination = reactivePagination<TestItem>({ pageSize: 5 })(getAllRows);
	});

	it('should initialize with correct default values', () => {
		expect(pagination.page).toBe(0);
		expect(pagination.pageSize).toBe(5);
		expect(pagination.pageCount).toBe(3); // 12 items with page size 5 = 3 pages
		expect(pagination.rows).toHaveLength(5);
		expect(pagination.rows[0].id).toBe(1);
		expect(pagination.rows[4].id).toBe(5);
	});

	it('should navigate to the next page', () => {
		const result = pagination.nextPage();

		expect(result).toBe(true);
		expect(pagination.page).toBe(1);
		expect(pagination.rows).toHaveLength(5);
		expect(pagination.rows[0].id).toBe(6);
		expect(pagination.rows[4].id).toBe(10);
	});

	it('should navigate to the previous page', () => {
		pagination.nextPage(); // Go to page 1
		const result = pagination.previousPage();

		expect(result).toBe(true);
		expect(pagination.page).toBe(0);
		expect(pagination.rows).toHaveLength(5);
		expect(pagination.rows[0].id).toBe(1);
	});

	it('should not navigate to the previous page when on the first page', () => {
		const result = pagination.previousPage();

		expect(result).toBe(false);
		expect(pagination.page).toBe(0);
	});

	it('should not navigate to the next page when on the last page', () => {
		pagination.lastPage(); // Go to last page
		const result = pagination.nextPage();

		expect(result).toBe(false);
		expect(pagination.page).toBe(2); // Still on last page
	});

	it('should go to the first page', () => {
		pagination.nextPage(); // Go to page 1
		pagination.firstPage();

		expect(pagination.page).toBe(0);
		expect(pagination.rows[0].id).toBe(1);
	});

	it('should go to the last page', () => {
		pagination.lastPage();

		expect(pagination.page).toBe(2);
		expect(pagination.rows).toHaveLength(2); // Only 2 items on the last page
		expect(pagination.rows[0].id).toBe(11);
		expect(pagination.rows[1].id).toBe(12);
	});

	it('should set the page directly', () => {
		pagination.setPage(1);

		expect(pagination.page).toBe(1);
		expect(pagination.rows[0].id).toBe(6);
	});

	it('should not set the page outside of valid range', () => {
		pagination.setPage(5); // Invalid page

		expect(pagination.page).toBe(0); // Should remain on the first page
	});

	it('should set the page size', () => {
		pagination.setPageSize(3);

		expect(pagination.pageSize).toBe(3);
		expect(pagination.pageCount).toBe(4); // 12 items with page size 3 = 4 pages
		expect(pagination.page).toBe(0); // Should reset to first page by default
		expect(pagination.rows).toHaveLength(3);
	});

	it('should set the page size without resetting page when specified', () => {
		pagination.nextPage(); // Go to page 1
		pagination.setPageSize(3, false); // Don't reset page

		expect(pagination.pageSize).toBe(3);
		expect(pagination.page).toBe(1); // Should remain on page 1
		expect(pagination.rows).toHaveLength(3);
		expect(pagination.rows[0].id).toBe(4);
	});

	it('should not set page size to invalid values', () => {
		pagination.setPageSize(0); // Invalid page size

		expect(pagination.pageSize).toBe(5); // Should remain with the original page size
	});

	// Add new test case to increase coverage
	it('should update the pagination object when setting valid page size', () => {
		// This test specifically targets the implementation at lines 89-90
		const newPageSize = 4;

		pagination.setPageSize(newPageSize);

		// Verify that pageSize was updated
		expect(pagination.pageSize).toBe(newPageSize);

		// Verify that the rows property reflects the new page size
		expect(pagination.rows.length).toBe(4);

		// Verify page was reset to 0 (default behavior)
		expect(pagination.page).toBe(0);

		// Also test without resetting the page
		pagination.nextPage(); // Go to page 1
		const currentPage = pagination.page;
		pagination.setPageSize(6, false);

		// Page should be preserved
		expect(pagination.page).toBe(currentPage);
		expect(pagination.pageSize).toBe(6);
	});

	it('should reflect changes in the source data', () => {
		// Remove two items
		rows.splice(0, 2);

		expect(pagination.pageCount).toBe(2); // 10 items with page size 5 = 2 pages
		expect(pagination.rows).toHaveLength(5);
		expect(pagination.rows[0].id).toBe(3); // First item now has id 3
	});

	it('should handle empty data', () => {
		rows.splice(0, rows.length); // Clear all rows

		expect(pagination.pageCount).toBe(0);
		expect(pagination.rows).toHaveLength(0);
	});

	it('should initialize with custom pagination settings', () => {
		const customPagination = reactivePagination<TestItem>({
			page: 1,
			pageSize: 3
		})(getAllRows);

		expect(customPagination.page).toBe(1);
		expect(customPagination.pageSize).toBe(3);
		expect(customPagination.pageCount).toBe(4);
		expect(customPagination.rows).toHaveLength(3);
		expect(customPagination.rows[0].id).toBe(4);
	});
});
