import { beforeEach, describe, expect, it } from 'vitest';
import { reactiveTable, type ColumnDef, type ReactiveTable } from './table.svelte.js';

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

	beforeEach(() => {
		table = reactiveTable(sampleData, columns);
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

	it('should set column visibility', () => {
		// Initially all columns should be visible
		expect(table.visibleColumns).toHaveLength(4);
		expect(table.headers).toHaveLength(4);

		// Hide the age column
		table.setColumnVisibility('age', false);

		// Now only 3 columns should be visible
		expect(table.visibleColumns).toHaveLength(3);
		expect(table.headers).toHaveLength(3);
		expect(table.headers).toEqual(['ID', 'Name', 'City']);

		// Check that rows only have cells for visible columns
		expect(table.allRows[0].cells).toHaveLength(3);
		expect(table.allRows[0].cells.find((cell) => cell.key === 'age')).toBeUndefined();

		// Make the age column visible again
		table.setColumnVisibility('age', true);

		// Now all 4 columns should be visible again
		expect(table.visibleColumns).toHaveLength(4);
		expect(table.headers).toHaveLength(4);
	});

	it('should toggle column visibility', () => {
		// Initially all columns should be visible
		expect(table.visibleColumns).toHaveLength(4);

		// Toggle the city column off
		table.toggleColumnVisibility('city');

		// Now only 3 columns should be visible
		expect(table.visibleColumns).toHaveLength(3);
		expect(table.headers).toEqual(['ID', 'Name', 'Age']);

		// Toggle the city column back on
		table.toggleColumnVisibility('city');

		// Now all 4 columns should be visible again
		expect(table.visibleColumns).toHaveLength(4);
		expect(table.headers).toEqual(['ID', 'Name', 'Age', 'City']);
	});

	it('should handle multiple column visibility changes', () => {
		// Hide two columns
		table.setColumnVisibility('age', false);
		table.setColumnVisibility('city', false);

		// Now only 2 columns should be visible
		expect(table.visibleColumns).toHaveLength(2);
		expect(table.headers).toEqual(['ID', 'Name']);

		// Check that row cells are updated accordingly
		expect(table.allRows[0].cells).toHaveLength(2);
		expect(table.allRows[0].cells[0].key).toBe('id');
		expect(table.allRows[0].cells[1].key).toBe('name');
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
		expect(table.visibleColumns).toHaveLength(3);
		expect(table.headers).toEqual(['Identifier', 'Full Name', 'Years']);

		// Check that rows are updated with the new structure
		expect(table.allRows[0].cells).toHaveLength(3);
		expect(table.allRows[0].cells[0].key).toBe('id');
		expect(table.allRows[0].cells[1].key).toBe('name');
		expect(table.allRows[0].cells[2].key).toBe('age');
		expect(table.allRows[0].cells.find((cell) => cell.key === 'city')).toBeUndefined();
	});

	it('should initialize with column visibility settings', () => {
		// Create a table with some invisible columns
		const columnsWithVisibility: ColumnDef<Person>[] = [
			{ accessor: 'id', header: 'ID', isIdentifier: true },
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age', visible: false },
			{ accessor: 'city', header: 'City', visible: false }
		];

		const tableWithVisibility = reactiveTable(sampleData, columnsWithVisibility);

		// Should only show two columns
		expect(tableWithVisibility.visibleColumns).toHaveLength(2);
		expect(tableWithVisibility.headers).toEqual(['ID', 'Name']);

		// Row cells should only include visible columns
		expect(tableWithVisibility.allRows[0].cells).toHaveLength(2);
		expect(tableWithVisibility.allRows[0].cells[0].key).toBe('id');
		expect(tableWithVisibility.allRows[0].cells[1].key).toBe('name');
	});

	it('should handle data with missing identifier values', () => {
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
});
