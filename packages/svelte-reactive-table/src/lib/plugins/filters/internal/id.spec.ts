import { describe, expect, it } from 'vitest';
import { generateId } from './id.js';

describe('generateId', () => {
	it('should generate unique IDs with default prefix', () => {
		const id1 = generateId();
		const id2 = generateId();
		const id3 = generateId();

		expect(id1).toMatch(/^filter-\d+$/);
		expect(id2).toMatch(/^filter-\d+$/);
		expect(id3).toMatch(/^filter-\d+$/);

		// All IDs should be unique
		expect(id1).not.toBe(id2);
		expect(id2).not.toBe(id3);
		expect(id1).not.toBe(id3);
	});

	it('should generate sequential IDs', () => {
		const id1 = generateId();
		const id2 = generateId();
		
		const num1 = parseInt(id1.split('-')[1]);
		const num2 = parseInt(id2.split('-')[1]);
		
		expect(num2).toBe(num1 + 1);
	});

	it('should generate IDs with custom prefix', () => {
		const customId1 = generateId('custom');
		const customId2 = generateId('test');
		const customId3 = generateId('my-prefix');

		expect(customId1).toMatch(/^custom-\d+$/);
		expect(customId2).toMatch(/^test-\d+$/);
		expect(customId3).toMatch(/^my-prefix-\d+$/);
	});

	it('should handle empty string prefix', () => {
		const id = generateId('');
		expect(id).toMatch(/^-\d+$/);
	});

	it('should handle special characters in prefix', () => {
		const id1 = generateId('prefix_with_underscore');
		const id2 = generateId('prefix-with-dash');
		const id3 = generateId('prefix.with.dots');

		expect(id1).toMatch(/^prefix_with_underscore-\d+$/);
		expect(id2).toMatch(/^prefix-with-dash-\d+$/);
		expect(id3).toMatch(/^prefix\.with\.dots-\d+$/);
	});

	it('should maintain counter across different prefixes', () => {
		const defaultId = generateId();
		const customId = generateId('custom');
		const anotherDefaultId = generateId();

		const defaultNum = parseInt(defaultId.split('-')[1]);
		const customNum = parseInt(customId.split('-')[1]);
		const anotherDefaultNum = parseInt(anotherDefaultId.split('-')[1]);

		// Counter should be sequential regardless of prefix
		expect(customNum).toBe(defaultNum + 1);
		expect(anotherDefaultNum).toBe(customNum + 1);
	});

	it('should generate many unique IDs without collision', () => {
		const ids = new Set<string>();
		const count = 1000;

		for (let i = 0; i < count; i++) {
			const id = generateId();
			expect(ids.has(id)).toBe(false); // Should not have duplicates
			ids.add(id);
		}

		expect(ids.size).toBe(count);
	});

	it('should return string type', () => {
		const id = generateId();
		expect(typeof id).toBe('string');
	});
});
