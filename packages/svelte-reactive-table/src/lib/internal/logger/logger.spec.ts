import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { log } from './logger.js';

describe('logger', () => {
	// Create spies for console methods
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	// Restore console methods after tests
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should log warnings with the correct prefix', () => {
		log.warn('This is a warning');

		expect(console.warn).toHaveBeenCalledWith('[svelte-reactive-table] This is a warning');
	});

	it('should log errors with the correct prefix', () => {
		log.error('This is an error');

		expect(console.error).toHaveBeenCalledWith('[svelte-reactive-table] This is an error');
	});

	it('should pass through additional arguments to warn', () => {
		const additionalData = { details: 'Extra info' };
		log.warn('Warning with data', additionalData);

		expect(console.warn).toHaveBeenCalledWith(
			'[svelte-reactive-table] Warning with data',
			additionalData
		);
	});

	it('should pass through additional arguments to error', () => {
		const errorDetails = new Error('Original error');
		log.error('Error occurred', errorDetails);

		expect(console.error).toHaveBeenCalledWith(
			'[svelte-reactive-table] Error occurred',
			errorDetails
		);
	});

	it('should handle multiple additional arguments', () => {
		log.warn('Multiple args', 'arg1', 'arg2', { object: true });

		expect(console.warn).toHaveBeenCalledWith(
			'[svelte-reactive-table] Multiple args',
			'arg1',
			'arg2',
			{ object: true }
		);
	});
});
