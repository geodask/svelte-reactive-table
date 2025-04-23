import { describe, expect, it } from 'vitest';
import { messages } from './messages.js';

describe('messages', () => {
	it('should generate missing identifier message with the correct property name', () => {
		const message = messages.missing_identifier('id');
		expect(message).toBe(
			'Row is missing a value for identifier property "id". Each row must have a unique, non-null identifier value.'
		);
	});

	it('should generate missing identifier value message with the correct property name', () => {
		const message = messages.missing_identifier_value('uuid');
		expect(message).toBe(
			'Row is missing a value for identifier property "uuid". Each row must have a unique, non-null identifier value.'
		);
	});

	it('should generate a generic no identifier column message', () => {
		const message = messages.no_identifier_column();
		expect(message).toBe(
			'No column is explicitly marked as identifier (isIdentifier: true). Using the first column as fallback. Consider marking an identifier column to ensure stable row identification.'
		);
	});

	it('should generate invalid page message with correct page bounds', () => {
		const message = messages.invalid_page(10, 5);
		expect(message).toBe('Invalid page index 10. Page must be between 0 and 4.');
	});

	it('should generate invalid page message for negative page index', () => {
		const message = messages.invalid_page(-1, 3);
		expect(message).toBe('Invalid page index -1. Page must be between 0 and 2.');
	});

	it('should generate invalid page size message with the provided size', () => {
		const message = messages.invalid_page_size(0);
		expect(message).toBe('Invalid page size 0. Page size must be a positive number.');
	});

	it('should generate invalid page size message for negative size', () => {
		const message = messages.invalid_page_size(-5);
		expect(message).toBe('Invalid page size -5. Page size must be a positive number.');
	});
});
