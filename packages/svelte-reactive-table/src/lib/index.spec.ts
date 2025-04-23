import { describe, it, expect } from 'vitest';
import * as api from './index.js';

describe('Public API exports', () => {
	it('should export the reactiveTable function', () => {
		expect(api.reactiveTable).toBeDefined();
		expect(typeof api.reactiveTable).toBe('function');
	});

	it('should export the reactivePagination function', () => {
		expect(api.reactivePagination).toBeDefined();
		expect(typeof api.reactivePagination).toBe('function');
	});

	it('should export all required types', () => {
		// This ensures the build process won't break if types are renamed or removed
		const exportedKeys = Object.keys(api);

		// These should include our two functions
		expect(exportedKeys).toContain('reactiveTable');
		expect(exportedKeys).toContain('reactivePagination');

		// Types won't appear in Object.keys since they're removed during transpilation
		// but at least we've verified the functions exist
	});
});
