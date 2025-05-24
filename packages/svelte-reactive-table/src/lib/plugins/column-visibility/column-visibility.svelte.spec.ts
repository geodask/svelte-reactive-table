import type { Column, PluginOutput } from '$lib/core/index.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { reactiveColumnVisibility, type ColumnVisibilityState } from './index.js';

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

	let columns: Column<TestData>[];
	let columnVisibilityPlugin: ReturnType<typeof reactiveColumnVisibility<TestData>>;
	let columnVisibilityOutput: PluginOutput<TestData, ColumnVisibilityState<TestData>>;

	beforeEach(() => {
		columns = createTestColumns();
		columnVisibilityPlugin = reactiveColumnVisibility<TestData>();
		columnVisibilityOutput = columnVisibilityPlugin.init(
			() => [],
			() => columns
		);
	});

	it('should initialize with default state (all columns visible)', () => {
		expect(columnVisibilityOutput.columns.length).toBe(4);
		expect(columnVisibilityOutput.state.hiddenColumns).toEqual([]);
		expect(columnVisibilityOutput.state.isVisible('id')).toBe(true);
		expect(columnVisibilityOutput.state.isVisible('name')).toBe(true);
		expect(columnVisibilityOutput.state.isVisible('age')).toBe(true);
		expect(columnVisibilityOutput.state.isVisible('email')).toBe(true);
	});

	it('should initialize with provided hidden columns', () => {
		// Create a new plugin with custom options
		const customPlugin = reactiveColumnVisibility<TestData>({
			hiddenColumns: ['age', 'email']
		});
		const customOutput = customPlugin.init(
			() => [],
			() => columns
		);

		expect(customOutput.columns.length).toBe(2);
		expect(customOutput.state.hiddenColumns).toEqual(['age', 'email']);
		expect(customOutput.state.isVisible('id')).toBe(true);
		expect(customOutput.state.isVisible('name')).toBe(true);
		expect(customOutput.state.isVisible('age')).toBe(false);
		expect(customOutput.state.isVisible('email')).toBe(false);
	});

	it('should set column visibility correctly', () => {
		columnVisibilityOutput.state.setVisibility('name', false);
		expect(columnVisibilityOutput.state.isVisible('name')).toBe(false);

		// Need to update columnVisibilityOutput.columns after state change
		expect(columnVisibilityOutput.columns.length).toBe(3);
		expect(columnVisibilityOutput.columns.map((col) => col.accessor)).not.toContain('name');

		columnVisibilityOutput.state.setVisibility('name', true);
		expect(columnVisibilityOutput.state.isVisible('name')).toBe(true);

		// Update columnVisibilityOutput.columns again
		expect(columnVisibilityOutput.columns.length).toBe(4);
		expect(columnVisibilityOutput.columns.map((col) => col.accessor)).toContain('name');
	});

	it('should toggle column visibility correctly', () => {
		expect(columnVisibilityOutput.state.isVisible('age')).toBe(true);

		columnVisibilityOutput.state.toggleVisibility('age');
		expect(columnVisibilityOutput.state.isVisible('age')).toBe(false);

		columnVisibilityOutput.state.toggleVisibility('age');
		expect(columnVisibilityOutput.state.isVisible('age')).toBe(true);
	});

	it('should hide multiple columns correctly', () => {
		columnVisibilityOutput.state.hideColumns(['id', 'email']);
		expect(columnVisibilityOutput.state.isVisible('id')).toBe(false);
		expect(columnVisibilityOutput.state.isVisible('name')).toBe(true);
		expect(columnVisibilityOutput.state.isVisible('age')).toBe(true);
		expect(columnVisibilityOutput.state.isVisible('email')).toBe(false);

		expect(columnVisibilityOutput.columns.length).toBe(2);
	});

	it('should show multiple columns correctly', () => {
		// Custom setup with all columns hidden initially
		const hiddenPlugin = reactiveColumnVisibility<TestData>({
			hiddenColumns: ['id', 'name', 'age', 'email']
		});
		const hiddenOutput = hiddenPlugin.init(
			() => [],
			() => columns
		);

		hiddenOutput.state.showColumns(['id', 'name']);
		expect(hiddenOutput.state.isVisible('id')).toBe(true);
		expect(hiddenOutput.state.isVisible('name')).toBe(true);
		expect(hiddenOutput.state.isVisible('age')).toBe(false);
		expect(hiddenOutput.state.isVisible('email')).toBe(false);
	});

	it('should set visible columns correctly', () => {
		columnVisibilityOutput.state.setVisibleColumns(['id', 'age']);
		expect(columnVisibilityOutput.state.isVisible('id')).toBe(true);
		expect(columnVisibilityOutput.state.isVisible('name')).toBe(false);
		expect(columnVisibilityOutput.state.isVisible('age')).toBe(true);
		expect(columnVisibilityOutput.state.isVisible('email')).toBe(false);

		expect(columnVisibilityOutput.columns.length).toBe(2);
	});

	it('should reset column visibility correctly', () => {
		// Custom setup with some columns hidden initially
		const hiddenPlugin = reactiveColumnVisibility<TestData>({
			hiddenColumns: ['id', 'email']
		});
		const hiddenOutput = hiddenPlugin.init(
			() => [],
			() => columns
		);

		expect(hiddenOutput.state.hiddenColumns).toEqual(['id', 'email']);

		hiddenOutput.state.resetVisibility();
		expect(hiddenOutput.state.hiddenColumns).toEqual([]);

		expect(hiddenOutput.columns.length).toBe(4);
		expect(hiddenOutput.state.isVisible('id')).toBe(true);
		expect(hiddenOutput.state.isVisible('name')).toBe(true);
		expect(hiddenOutput.state.isVisible('age')).toBe(true);
		expect(hiddenOutput.state.isVisible('email')).toBe(true);
	});
});
