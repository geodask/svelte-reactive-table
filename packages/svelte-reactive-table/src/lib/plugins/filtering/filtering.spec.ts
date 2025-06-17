import { describe, expect, it } from 'vitest';
import { reactiveFiltering, filterHelpers } from './filtering.svelte.js';
import type { Row } from '$lib/core/types/table.js';

// Test data type
type Person = {
	id: number;
	name: string;
	age: number;
	city: string;
	status: 'active' | 'inactive' | 'pending';
	email: string;
};

const testData: Person[] = [
	{
		id: 1,
		name: 'Alice Johnson',
		age: 28,
		city: 'New York',
		status: 'active',
		email: 'alice@example.com'
	},
	{
		id: 2,
		name: 'Bob Smith',
		age: 35,
		city: 'Los Angeles',
		status: 'inactive',
		email: 'bob@example.com'
	},
	{
		id: 3,
		name: 'Charlie Brown',
		age: 22,
		city: 'Chicago',
		status: 'pending',
		email: 'charlie@example.com'
	},
	{
		id: 4,
		name: 'Diana Prince',
		age: 30,
		city: 'New York',
		status: 'active',
		email: 'diana@example.com'
	},
	{
		id: 5,
		name: 'Eve Wilson',
		age: 29,
		city: 'Seattle',
		status: 'active',
		email: 'eve@example.com'
	}
];

function createMockRows(data: Person[]): Row<Person>[] {
	return data.map((original) => ({
		id: original.id,
		original,
		cells: []
	}));
}

describe('reactiveFiltering', () => {
	it('should filter by exact string match', () => {
		const plugin = reactiveFiltering<Person>();

		// Mock table functions
		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		// Filter by exact city
		pluginOutput.state.setFilter('city', 'New York');

		expect(pluginOutput.rows.length).toBe(2);
		expect(pluginOutput.rows.every((row) => row.original.city === 'New York')).toBe(true);
	});

	it('should filter by string contains (case-insensitive by default)', () => {
		const plugin = reactiveFiltering<Person>();

		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		// Filter names containing 'john' (should match 'Alice Johnson')
		pluginOutput.state.setFilter('name', 'john');

		expect(pluginOutput.rows.length).toBe(1);
		expect(pluginOutput.rows[0].original.name).toBe('Alice Johnson');
	});

	it('should filter by array (IN operation)', () => {
		const plugin = reactiveFiltering<Person>();

		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		// Filter by multiple statuses
		pluginOutput.state.setFilter('status', ['active', 'pending']);

		expect(pluginOutput.rows.length).toBe(4);
		expect(
			pluginOutput.rows.every((row) => ['active', 'pending'].includes(row.original.status))
		).toBe(true);
	});

	it('should filter using custom predicate function', () => {
		const plugin = reactiveFiltering<Person>();

		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		// Filter by age range using predicate
		pluginOutput.state.setFilter('age', (age: number) => age >= 25 && age <= 30);

		expect(pluginOutput.rows.length).toBe(3);
		expect(pluginOutput.rows.every((row) => row.original.age >= 25 && row.original.age <= 30)).toBe(
			true
		);
	});

	it('should combine multiple filters (AND logic)', () => {
		const plugin = reactiveFiltering<Person>();

		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		// Filter by city AND status
		pluginOutput.state.setFilters({
			city: 'New York',
			status: 'active'
		});

		expect(pluginOutput.rows.length).toBe(2);
		expect(
			pluginOutput.rows.every(
				(row) => row.original.city === 'New York' && row.original.status === 'active'
			)
		).toBe(true);
	});

	it('should handle filter helpers', () => {
		const plugin = reactiveFiltering<Person>();

		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		// Use range helper for age filtering
		pluginOutput.state.setFilter('age', filterHelpers.range<number>(25, 35));

		expect(pluginOutput.rows.length).toBe(4);
		expect(pluginOutput.rows.every((row) => row.original.age >= 25 && row.original.age <= 35)).toBe(
			true
		);

		// Use startsWith helper for name filtering
		pluginOutput.state.setFilter('name', filterHelpers.startsWith('A'));

		const filteredRows = pluginOutput.rows;
		expect(filteredRows.length).toBe(1);
		expect(filteredRows[0].original.name).toBe('Alice Johnson');
	});

	it('should manage filter state correctly', () => {
		const plugin = reactiveFiltering<Person>();

		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		expect(pluginOutput.state.count).toBe(0);
		expect(pluginOutput.state.hasActiveFilters).toBe(false);

		pluginOutput.state.setFilter('city', 'New York');
		expect(pluginOutput.state.count).toBe(1);
		expect(pluginOutput.state.hasActiveFilters).toBe(true);
		expect(pluginOutput.state.getFilter('city')).toBe('New York');

		pluginOutput.state.setFilter('status', 'active');
		expect(pluginOutput.state.count).toBe(2);

		pluginOutput.state.removeFilter('city');
		expect(pluginOutput.state.count).toBe(1);
		expect(pluginOutput.state.getFilter('city')).toBeUndefined();

		pluginOutput.state.clearFilters();
		expect(pluginOutput.state.count).toBe(0);
		expect(pluginOutput.state.hasActiveFilters).toBe(false);
		expect(pluginOutput.rows.length).toBe(testData.length);
	});

	it('should respect case sensitivity option', () => {
		const plugin = reactiveFiltering<Person>({ caseSensitive: true });

		const getRows = () => createMockRows(testData);
		const getColumns = () => [];

		const pluginOutput = plugin.init(getRows, getColumns);

		// Case-sensitive search should not match
		pluginOutput.state.setFilter('name', 'alice');
		expect(pluginOutput.rows.length).toBe(0);

		// Exact case should match
		pluginOutput.state.setFilter('name', 'Alice');
		expect(pluginOutput.rows.length).toBe(1);
	});
});
