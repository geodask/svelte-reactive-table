import { describe, expect, it } from 'vitest';
import { reactiveColumnVisibility } from './index.js';
import type { Column } from '../../core/types.js';

// Define mock data and columns for testing
type TestData = {
	id: number;
	name: string;
	age: number;
	email: string;
};

describe('reactiveColumnVisibility', () => {
	// Helper function to create test columns
	function createTestColumns(): Column<TestData>[] {
		return [
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name', isIdentifier: false },
			{ accessor: 'age', header: 'Age', isIdentifier: false },
			{ accessor: 'email', header: 'Email', isIdentifier: false }
		];
	}

	it('should initialize with default state (all columns visible)', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>()(() => columns);

		expect(columnVisibility.columns.length).toBe(4);
		expect(columnVisibility.state.hiddenColumns).toEqual([]);
		expect(columnVisibility.state.isColumnVisible('id')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('age')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('email')).toBe(true);
	});

	it('should initialize with provided hidden columns', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>({
			hiddenColumns: ['age', 'email']
		})(() => columns);

		expect(columnVisibility.columns.length).toBe(2);
		expect(columnVisibility.state.hiddenColumns).toEqual(['age', 'email']);
		expect(columnVisibility.state.isColumnVisible('id')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('age')).toBe(false);
		expect(columnVisibility.state.isColumnVisible('email')).toBe(false);
	});

	it('should set column visibility correctly', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>()(() => columns);

		columnVisibility.state.setColumnVisibility('name', false);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(false);
		expect(columnVisibility.columns.length).toBe(3);
		expect(columnVisibility.columns.map((col) => col.accessor)).not.toContain('name');

		columnVisibility.state.setColumnVisibility('name', true);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(true);
		expect(columnVisibility.columns.length).toBe(4);
		expect(columnVisibility.columns.map((col) => col.accessor)).toContain('name');
	});

	it('should toggle column visibility correctly', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>()(() => columns);

		expect(columnVisibility.state.isColumnVisible('age')).toBe(true);

		columnVisibility.state.toggleColumnVisibility('age');
		expect(columnVisibility.state.isColumnVisible('age')).toBe(false);

		columnVisibility.state.toggleColumnVisibility('age');
		expect(columnVisibility.state.isColumnVisible('age')).toBe(true);
	});

	it('should hide multiple columns correctly', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>()(() => columns);

		columnVisibility.state.hideColumns(['id', 'email']);
		expect(columnVisibility.state.isColumnVisible('id')).toBe(false);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('age')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('email')).toBe(false);
		expect(columnVisibility.columns.length).toBe(2);
	});

	it('should show multiple columns correctly', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>({
			hiddenColumns: ['id', 'name', 'age', 'email']
		})(() => columns);

		columnVisibility.state.showColumns(['id', 'name']);
		expect(columnVisibility.state.isColumnVisible('id')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('age')).toBe(false);
		expect(columnVisibility.state.isColumnVisible('email')).toBe(false);
		expect(columnVisibility.columns.length).toBe(2);
	});

	it('should set visible columns correctly', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>()(() => columns);

		columnVisibility.state.setVisibleColumns(['id', 'age']);
		expect(columnVisibility.state.isColumnVisible('id')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(false);
		expect(columnVisibility.state.isColumnVisible('age')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('email')).toBe(false);
		expect(columnVisibility.columns.length).toBe(2);
	});

	it('should reset column visibility correctly', () => {
		const columns = createTestColumns();
		const columnVisibility = reactiveColumnVisibility<TestData>({
			hiddenColumns: ['id', 'email']
		})(() => columns);

		expect(columnVisibility.state.hiddenColumns).toEqual(['id', 'email']);

		columnVisibility.state.resetColumnVisibility();
		expect(columnVisibility.state.hiddenColumns).toEqual([]);
		expect(columnVisibility.columns.length).toBe(4);
		expect(columnVisibility.state.isColumnVisible('id')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('name')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('age')).toBe(true);
		expect(columnVisibility.state.isColumnVisible('email')).toBe(true);
	});
});
