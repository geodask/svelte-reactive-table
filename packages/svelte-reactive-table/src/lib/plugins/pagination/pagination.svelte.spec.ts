import type { PluginOutput, Row } from '$lib/core/index.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { reactivePagination } from './index.js';
import type { PaginationState } from './types/index.js';

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
	let paginationPlugin: ReturnType<typeof reactivePagination<TestItem>>;
	let paginationOutput: PluginOutput<TestItem, PaginationState>;

	beforeEach(() => {
		rows = createTestRows();
		paginationPlugin = reactivePagination<TestItem>({ pageSize: 5 });
		paginationOutput = paginationPlugin.init(
			() => rows,
			() => []
		);
	});

	it('should initialize with correct default values', () => {
		expect(paginationOutput.state.page).toBe(0);
		expect(paginationOutput.state.pageSize).toBe(5);
		expect(paginationOutput.state.pageCount).toBe(3);
		expect(paginationOutput.state.totalItems).toBe(12);

		expect(paginationOutput.rows).toHaveLength(5);
		expect(paginationOutput.rows[0].id).toBe(1);
		expect(paginationOutput.rows[4].id).toBe(5);
	});

	it('should navigate to the next page', () => {
		paginationOutput.state.goToNextPage();

		expect(paginationOutput.state.page).toBe(1);
		expect(paginationOutput.state.hasNextPage).toBe(true);
		expect(paginationOutput.state.hasPreviousPage).toBe(true);

		expect(paginationOutput.rows).toHaveLength(5);
		expect(paginationOutput.rows[0].id).toBe(6);
		expect(paginationOutput.rows[4].id).toBe(10);
	});

	it('should navigate to the previous page', () => {
		paginationOutput.state.goToNextPage(); // Go to page 1
		paginationOutput.state.goToPreviousPage();

		expect(paginationOutput.state.page).toBe(0);
		expect(paginationOutput.state.hasPreviousPage).toBe(false);

		expect(paginationOutput.rows).toHaveLength(5);
		expect(paginationOutput.rows[0].id).toBe(1);
	});

	it('should not navigate to the previous page when on the first page', () => {
		paginationOutput.state.goToPreviousPage();

		expect(paginationOutput.state.page).toBe(0);
		expect(paginationOutput.state.hasPreviousPage).toBe(false);
	});

	it('should not navigate to the next page when on the last page', () => {
		// Go to the last page
		paginationOutput.state.setPage(2);
		paginationOutput.state.goToNextPage();

		expect(paginationOutput.state.page).toBe(2);
		expect(paginationOutput.state.hasNextPage).toBe(false);
	});

	it('should set the page directly', () => {
		paginationOutput.state.setPage(1);

		expect(paginationOutput.state.page).toBe(1);

		expect(paginationOutput.rows[0].id).toBe(6);
	});

	it('should not set the page outside of valid range', () => {
		paginationOutput.state.setPage(5); // Invalid page

		// Page should be set to max valid value (2)
		expect(paginationOutput.state.page).toBe(2);
	});

	it('should set the page size', () => {
		paginationOutput.state.setPageSize(3);

		expect(paginationOutput.state.pageSize).toBe(3);
		expect(paginationOutput.state.pageCount).toBe(4); // 12 items with page size 3 = 4 pages

		expect(paginationOutput.rows).toHaveLength(3);
	});

	it('should handle changing page size and keeping items visible', () => {
		paginationOutput.state.goToNextPage(); // Go to page 1 (items 6-10)
		paginationOutput.state.setPageSize(3);

		// Page should be adjusted to keep items visible
		expect(paginationOutput.state.pageSize).toBe(3);

		expect(paginationOutput.state.page).toBeGreaterThanOrEqual(1); // Should be at page 1 or higher

		// Check that the page contains at least some of the same items
		const visibleIds = paginationOutput.rows.map((row) => row.id);
		expect(visibleIds.some((id) => [6, 7, 8, 9, 10].includes(id as number))).toBe(true);
	});

	it('should not set page size to invalid values', () => {
		paginationOutput.state.setPageSize(0); // Invalid page size

		expect(paginationOutput.state.pageSize).toBe(5); // Should remain with the original page size
	});

	it('should calculate correct page item range', () => {
		// First page
		expect(paginationOutput.state.pageItemRange.start).toBe(1);
		expect(paginationOutput.state.pageItemRange.end).toBe(5);

		// Go to second page
		paginationOutput.state.goToNextPage();
		expect(paginationOutput.state.pageItemRange.start).toBe(6);
		expect(paginationOutput.state.pageItemRange.end).toBe(10);

		// Go to last page
		paginationOutput.state.goToNextPage();
		expect(paginationOutput.state.pageItemRange.start).toBe(11);
		expect(paginationOutput.state.pageItemRange.end).toBe(12);
	});

	it('should handle empty data', () => {
		const emptyPlugin = reactivePagination<TestItem>({ pageSize: 5 });
		const emptyOutput = emptyPlugin.init(
			() => [],
			() => []
		);

		expect(emptyOutput.state.pageCount).toBe(1);
		expect(emptyOutput.state.totalItems).toBe(0);
		expect(emptyOutput.rows).toHaveLength(0);
	});

	it('should initialize with custom pagination settings', () => {
		const customPlugin = reactivePagination<TestItem>({
			page: 1,
			pageSize: 3
		});

		const customOutput = customPlugin.init(
			() => rows,
			() => []
		);

		expect(customOutput.state.page).toBe(1);
		expect(customOutput.state.pageSize).toBe(3);
		expect(customOutput.state.pageCount).toBe(4);
		expect(customOutput.rows).toHaveLength(3);
		expect(customOutput.rows[0].id).toBe(4);
	});

	it('should update pagination when changing page size', () => {
		// Set a new page size and verify its effects
		paginationOutput.state.setPageSize(4);

		// Verify that pageSize was updated
		expect(paginationOutput.state.pageSize).toBe(4);

		// Process rows with new page size
		expect(paginationOutput.rows.length).toBe(4);

		// Go to page 1 and then change page size
		paginationOutput.state.goToNextPage();
		paginationOutput.state.setPageSize(6);

		// Verify the page adjustment happens correctly
		expect(paginationOutput.state.pageSize).toBe(6);
		expect(paginationOutput.state.pageCount).toBe(2); // 12 items with page size 6 = 2 pages
	});
});
