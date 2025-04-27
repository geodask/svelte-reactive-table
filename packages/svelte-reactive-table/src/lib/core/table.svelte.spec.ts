import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reactivePagination } from '../features/pagination/index.js';
import { reactiveTable, type ColumnDef, type ReactiveTable } from './index.js';
import { reactiveColumnVisibility } from '../features/column-visibility/index.js';
import { reactiveSorting } from '$lib/features/sorting/sorting.svelte.js';

type Person = {
	id: number;
	name: string;
	age: number;
	city: string;
};

const sampleData: Person[] = [
	{ id: 1, name: 'John Doe', age: 30, city: 'New York' },
	{ id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
	{ id: 3, name: 'Bob Johnson', age: 40, city: 'Chicago' }
];

// Sample column definitions
const columns: ColumnDef<Person>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'age', header: 'Age' },
	{ accessor: 'city', header: 'City' }
];

describe('reactiveTable', () => {
	let table: ReactiveTable<Person>;

	// Spy on console methods
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
		table = reactiveTable(sampleData, columns);
	});

	// Restore console methods after tests
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should create a table with the correct structure', () => {
		expect(table).toBeDefined();
		expect(table.data).toEqual(sampleData);
		expect(table.columnDefs).toEqual(columns);
	});

	it('should generate the correct headers', () => {
		expect(table.headers).toHaveLength(4);
		expect(table.headers).toEqual(['ID', 'Name', 'Age', 'City']);
	});

	it('should generate the correct rows and cells', () => {
		expect(table.allRows).toHaveLength(3);

		// Test first row thoroughly
		const firstRow = table.allRows[0];
		expect(firstRow.id).toBe(1);
		expect(firstRow.original).toEqual(sampleData[0]);
		expect(firstRow.cells).toHaveLength(4);
		expect(firstRow.cells[0].key).toBe('id');
		expect(firstRow.cells[0].value).toBe(1);
		expect(firstRow.cells[1].key).toBe('name');
		expect(firstRow.cells[1].value).toBe('John Doe');
		expect(firstRow.cells[2].key).toBe('age');
		expect(firstRow.cells[2].value).toBe(30);
		expect(firstRow.cells[3].key).toBe('city');
		expect(firstRow.cells[3].value).toBe('New York');

		// Check key properties of other rows to ensure correct structure
		expect(table.allRows[1].id).toBe(2);
		expect(table.allRows[1].original).toEqual(sampleData[1]);
		expect(table.allRows[1].cells).toHaveLength(4);

		expect(table.allRows[2].id).toBe(3);
		expect(table.allRows[2].original).toEqual(sampleData[2]);
		expect(table.allRows[2].cells).toHaveLength(4);
	});

	it('should reflect data changes', () => {
		const newData: Person[] = [
			{ id: 4, name: 'Alice Brown', age: 28, city: 'Seattle' },
			{ id: 5, name: 'Charlie Green', age: 35, city: 'Miami' }
		];

		table.data = newData;

		expect(table.data).toEqual(newData);
		expect(table.allRows).toHaveLength(2);
		expect(table.allRows[0].original).toEqual(newData[0]);
		expect(table.allRows[1].original).toEqual(newData[1]);
		expect(table.allRows[0].cells[0].value).toBe(4);
		expect(table.allRows[0].cells[1].value).toBe('Alice Brown');
		expect(table.allRows[0].cells[2].value).toBe(28);
		expect(table.allRows[0].cells[3].value).toBe('Seattle');
		expect(table.allRows[1].cells[0].value).toBe(5);
		expect(table.allRows[1].cells[1].value).toBe('Charlie Green');
		expect(table.allRows[1].cells[2].value).toBe(35);
		expect(table.allRows[1].cells[3].value).toBe('Miami');
	});

	it('should update when column definitions are changed', () => {
		const newColumns: ColumnDef<Person>[] = [
			{ accessor: 'id', header: 'Identifier', isIdentifier: true },
			{ accessor: 'name', header: 'Full Name' },
			{ accessor: 'age', header: 'Years' }
			// city column omitted
		];

		table.columnDefs = newColumns;

		// Should now have 3 columns with new headers
		expect(table.columnDefs).toEqual(newColumns);
		expect(table.columns).toHaveLength(3);
		expect(table.headers).toEqual(['Identifier', 'Full Name', 'Years']);

		// Check that rows are updated with the new structure
		expect(table.allRows[0].cells).toHaveLength(3);
		expect(table.allRows[0].cells[0].key).toBe('id');
		expect(table.allRows[0].cells[1].key).toBe('name');
		expect(table.allRows[0].cells[2].key).toBe('age');
		expect(table.allRows[0].cells.find((cell) => cell.key === 'city')).toBeUndefined();
	});

	it('should handle zero (0) as a valid identifier value', () => {
		const dataWithMissingId: Person[] = [
			{ id: 1, name: 'John Doe', age: 30, city: 'New York' },
			{ id: 0, name: 'Jane Smith', age: 25, city: 'Los Angeles' }, // id=0 can still be valid
			{ id: 3, name: 'Bob Johnson', age: 40, city: 'Chicago' }
		];

		const tableWithMissingId = reactiveTable(dataWithMissingId, columns);

		// Table should still work with all rows
		expect(tableWithMissingId.allRows).toHaveLength(3);
		expect(tableWithMissingId.allRows[1].id).toBe(0);
	});

	it('should warn when no identifier column is specified', () => {
		// Reset warning mock first to ensure clean state
		vi.clearAllMocks();

		// Create columns without an explicit identifier
		const columnsWithoutIdentifier: ColumnDef<Person>[] = [
			{ accessor: 'id', header: 'ID' }, // No isIdentifier flag
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' }
		];

		// Create the table without identifier column
		const tableWithoutIdentifier = reactiveTable(sampleData, columnsWithoutIdentifier);

		// Force the reactive computation to run by accessing properties
		const rows = tableWithoutIdentifier.allRows;
		expect(rows).toHaveLength(3);

		// Check that the warning was called with the exact message
		expect(console.warn).toHaveBeenCalledWith(
			'[svelte-reactive-table] No column is explicitly marked as identifier (isIdentifier: true). Using the first column as fallback. Consider marking an identifier column to ensure stable row identification.'
		);
	});

	it('should log error when item is missing an identifier value', () => {
		// Reset error mock first to ensure clean state
		vi.clearAllMocks();

		// Create data with a null identifier value
		const dataWithNullId: Person[] = [
			{ id: 1, name: 'John Doe', age: 30, city: 'New York' },
			{ id: null as unknown as number, name: 'Jane Smith', age: 25, city: 'Los Angeles' }, // Null ID
			{ id: 3, name: 'Bob Johnson', age: 40, city: 'Chicago' }
		];

		// Create the table with null identifier and force reactive computation
		const tableWithNullId = reactiveTable(dataWithNullId, columns);

		// Access rows to trigger the reactive computation
		const rows = tableWithNullId.allRows;
		expect(rows).toHaveLength(3);

		// Verify error was logged with the exact format
		expect(console.error).toHaveBeenCalledWith(
			'[svelte-reactive-table] Row is missing a value for identifier property "id". Each row must have a unique, non-null identifier value.',
			expect.any(Object) // The data snapshot
		);
	});

	it('should correctly normalize columns and provide access via allColumns', () => {
		// Create columns with mixed isIdentifier settings
		const mixedColumns: ColumnDef<Person>[] = [
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' }, // No isIdentifier (should default to false)
			{ accessor: 'age', header: 'Age', isIdentifier: false }
		];

		const tableWithMixedColumns = reactiveTable(sampleData, mixedColumns);

		// Check that allColumns property contains normalized columns with defaults applied
		expect(tableWithMixedColumns.allColumns).toHaveLength(3);

		// Verify isIdentifier property is correctly set for each column
		expect(tableWithMixedColumns.allColumns[0].isIdentifier).toBe(true);
		expect(tableWithMixedColumns.allColumns[1].isIdentifier).toBe(false); // Default applied
		expect(tableWithMixedColumns.allColumns[2].isIdentifier).toBe(false);

		// Check accessor and header were preserved
		expect(tableWithMixedColumns.allColumns[0].accessor).toBe('id');
		expect(tableWithMixedColumns.allColumns[0].header).toBe('ID');
		expect(tableWithMixedColumns.allColumns[1].accessor).toBe('name');
		expect(tableWithMixedColumns.allColumns[1].header).toBe('Name');
	});

	it('should add pagination feature when option is provided', () => {
		const tableWithPagination = reactiveTable(sampleData, columns, {
			pagination: reactivePagination({ pageSize: 2 })
		});

		expect(tableWithPagination.pagination).toBeDefined();
		expect(tableWithPagination.pagination.pageSize).toBe(2);
		expect(tableWithPagination.pagination.pageCount).toBe(2);
		expect(tableWithPagination.rows).toHaveLength(2); // First 2 rows
	});

	it('should add column visibility feature when option is provided', () => {
		const tableWithColumnVisvibility = reactiveTable(sampleData, columns, {
			columnVisibility: reactiveColumnVisibility({
				hiddenColumns: ['age']
			})
		});

		expect(tableWithColumnVisvibility.columnVisibility).toBeDefined();
		expect(tableWithColumnVisvibility.columnVisibility.hiddenColumns).toEqual(['age']);
		expect(tableWithColumnVisvibility.columns).toHaveLength(3);
	});

	it('should add sorting feature when option is provided', () => {
		const tableWithSorting = reactiveTable(sampleData, columns, {
			sorting: reactiveSorting({
				columnSortings: [{ key: 'name', direction: 'asc' }]
			})
		});

		expect(tableWithSorting.sorting).toBeDefined();
		expect(tableWithSorting.sorting.columnSortings).toHaveLength(1);
		expect(tableWithSorting.sorting.columnSortings[0].key).toBe('name');
		expect(tableWithSorting.sorting.columnSortings[0].direction).toBe('asc');
	});
});
