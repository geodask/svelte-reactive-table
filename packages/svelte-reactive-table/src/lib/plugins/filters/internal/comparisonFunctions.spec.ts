import { describe, expect, it } from 'vitest';
import { comparisonFunctions } from './comparisonFunctions.js';

describe('comparisonFunctions', () => {
	describe('equals', () => {
		it('should return true for equal primitive values', () => {
			expect(comparisonFunctions.equals(5, 5)).toBe(true);
			expect(comparisonFunctions.equals('hello', 'hello')).toBe(true);
			expect(comparisonFunctions.equals(true, true)).toBe(true);
			expect(comparisonFunctions.equals(null, null)).toBe(true);
			expect(comparisonFunctions.equals(undefined, undefined)).toBe(true);
		});

		it('should return false for different values', () => {
			expect(comparisonFunctions.equals(5, 10)).toBe(false);
			expect(comparisonFunctions.equals('hello', 'world')).toBe(false);
			expect(comparisonFunctions.equals(true, false)).toBe(false);
			expect(comparisonFunctions.equals(null, undefined)).toBe(false);
		});

		it('should handle type differences', () => {
			expect(comparisonFunctions.equals(5, '5')).toBe(false);
			expect(comparisonFunctions.equals(0, false)).toBe(false);
			expect(comparisonFunctions.equals('', null)).toBe(false);
		});
	});

	describe('notEquals', () => {
		it('should return false for equal values', () => {
			expect(comparisonFunctions.notEquals(5, 5)).toBe(false);
			expect(comparisonFunctions.notEquals('hello', 'hello')).toBe(false);
			expect(comparisonFunctions.notEquals(true, true)).toBe(false);
		});

		it('should return true for different values', () => {
			expect(comparisonFunctions.notEquals(5, 10)).toBe(true);
			expect(comparisonFunctions.notEquals('hello', 'world')).toBe(true);
			expect(comparisonFunctions.notEquals(true, false)).toBe(true);
		});
	});

	describe('contains', () => {
		it('should return true when string contains substring (case insensitive)', () => {
			expect(comparisonFunctions.contains('Hello World', 'world')).toBe(true);
			expect(comparisonFunctions.contains('Hello World', 'HELLO')).toBe(true);
			expect(comparisonFunctions.contains('JavaScript', 'script')).toBe(true);
			expect(comparisonFunctions.contains('test', 'test')).toBe(true);
		});

		it('should return false when string does not contain substring', () => {
			expect(comparisonFunctions.contains('Hello World', 'xyz')).toBe(false);
			expect(comparisonFunctions.contains('JavaScript', 'python')).toBe(false);
		});

		it('should return false for non-string values', () => {
			expect(comparisonFunctions.contains(123, '23')).toBe(false);
			expect(comparisonFunctions.contains(true, 'true')).toBe(false);
			expect(comparisonFunctions.contains(null, 'null')).toBe(false);
			expect(comparisonFunctions.contains('hello', 123)).toBe(false);
		});

		it('should handle empty strings', () => {
			expect(comparisonFunctions.contains('hello', '')).toBe(true);
			expect(comparisonFunctions.contains('', '')).toBe(true);
			expect(comparisonFunctions.contains('', 'test')).toBe(false);
		});
	});

	describe('startsWith', () => {
		it('should return true when string starts with prefix (case insensitive)', () => {
			expect(comparisonFunctions.startsWith('Hello World', 'hello')).toBe(true);
			expect(comparisonFunctions.startsWith('JavaScript', 'JAVA')).toBe(true);
			expect(comparisonFunctions.startsWith('test', 'test')).toBe(true);
		});

		it('should return false when string does not start with prefix', () => {
			expect(comparisonFunctions.startsWith('Hello World', 'world')).toBe(false);
			expect(comparisonFunctions.startsWith('JavaScript', 'script')).toBe(false);
		});

		it('should return false for non-string values', () => {
			expect(comparisonFunctions.startsWith(123, '1')).toBe(false);
			expect(comparisonFunctions.startsWith(true, 't')).toBe(false);
			expect(comparisonFunctions.startsWith('hello', 123)).toBe(false);
		});

		it('should handle empty strings', () => {
			expect(comparisonFunctions.startsWith('hello', '')).toBe(true);
			expect(comparisonFunctions.startsWith('', '')).toBe(true);
			expect(comparisonFunctions.startsWith('', 'test')).toBe(false);
		});
	});

	describe('endsWith', () => {
		it('should return true when string ends with suffix (case insensitive)', () => {
			expect(comparisonFunctions.endsWith('Hello World', 'world')).toBe(true);
			expect(comparisonFunctions.endsWith('JavaScript', 'SCRIPT')).toBe(true);
			expect(comparisonFunctions.endsWith('test', 'test')).toBe(true);
		});

		it('should return false when string does not end with suffix', () => {
			expect(comparisonFunctions.endsWith('Hello World', 'hello')).toBe(false);
			expect(comparisonFunctions.endsWith('JavaScript', 'java')).toBe(false);
		});

		it('should return false for non-string values', () => {
			expect(comparisonFunctions.endsWith(123, '3')).toBe(false);
			expect(comparisonFunctions.endsWith(true, 'e')).toBe(false);
			expect(comparisonFunctions.endsWith('hello', 123)).toBe(false);
		});

		it('should handle empty strings', () => {
			expect(comparisonFunctions.endsWith('hello', '')).toBe(true);
			expect(comparisonFunctions.endsWith('', '')).toBe(true);
			expect(comparisonFunctions.endsWith('', 'test')).toBe(false);
		});
	});

	describe('greaterThan', () => {
		it('should return true for numbers when value is greater', () => {
			expect(comparisonFunctions.greaterThan(10, 5)).toBe(true);
			expect(comparisonFunctions.greaterThan(0, -1)).toBe(true);
			expect(comparisonFunctions.greaterThan(3.14, 3.13)).toBe(true);
		});

		it('should return false for numbers when value is not greater', () => {
			expect(comparisonFunctions.greaterThan(5, 10)).toBe(false);
			expect(comparisonFunctions.greaterThan(5, 5)).toBe(false);
			expect(comparisonFunctions.greaterThan(-1, 0)).toBe(false);
		});

		it('should work with date strings', () => {
			expect(comparisonFunctions.greaterThan('2023-12-31', '2023-01-01')).toBe(true);
			expect(comparisonFunctions.greaterThan('2023-01-01', '2023-12-31')).toBe(false);
		});

		it('should work with string comparison', () => {
			expect(comparisonFunctions.greaterThan('zebra', 'apple')).toBe(true);
			expect(comparisonFunctions.greaterThan('apple', 'zebra')).toBe(false);
		});

		it('should handle mixed types gracefully', () => {
			expect(comparisonFunctions.greaterThan('10', 5)).toBe(false);
			expect(comparisonFunctions.greaterThan(10, '5')).toBe(false);
			expect(comparisonFunctions.greaterThan('string', 123)).toBe(false);
			expect(comparisonFunctions.greaterThan(true, 'false')).toBe(false);
		});
	});

	describe('lessThan', () => {
		it('should return true for numbers when value is less', () => {
			expect(comparisonFunctions.lessThan(5, 10)).toBe(true);
			expect(comparisonFunctions.lessThan(-1, 0)).toBe(true);
			expect(comparisonFunctions.lessThan(3.13, 3.14)).toBe(true);
		});

		it('should return false for numbers when value is not less', () => {
			expect(comparisonFunctions.lessThan(10, 5)).toBe(false);
			expect(comparisonFunctions.lessThan(5, 5)).toBe(false);
			expect(comparisonFunctions.lessThan(0, -1)).toBe(false);
		});

		it('should work with date strings', () => {
			expect(comparisonFunctions.lessThan('2023-01-01', '2023-12-31')).toBe(true);
			expect(comparisonFunctions.lessThan('2023-12-31', '2023-01-01')).toBe(false);
		});

		it('should work with string comparison', () => {
			expect(comparisonFunctions.lessThan('apple', 'zebra')).toBe(true);
			expect(comparisonFunctions.lessThan('zebra', 'apple')).toBe(false);
		});

		it('should handle mixed types gracefully', () => {
			expect(comparisonFunctions.lessThan('10', 5)).toBe(false);
			expect(comparisonFunctions.lessThan(10, '5')).toBe(false);
			expect(comparisonFunctions.lessThan('string', 123)).toBe(false);
			expect(comparisonFunctions.lessThan(true, 'false')).toBe(false);
		});
	});

	describe('greaterThanOrEqual', () => {
		it('should return true for numbers when value is greater or equal', () => {
			expect(comparisonFunctions.greaterThanOrEqual(10, 5)).toBe(true);
			expect(comparisonFunctions.greaterThanOrEqual(5, 5)).toBe(true);
			expect(comparisonFunctions.greaterThanOrEqual(0, -1)).toBe(true);
		});

		it('should return false for numbers when value is less', () => {
			expect(comparisonFunctions.greaterThanOrEqual(5, 10)).toBe(false);
			expect(comparisonFunctions.greaterThanOrEqual(-1, 0)).toBe(false);
		});
	});

	describe('lessThanOrEqual', () => {
		it('should return true for numbers when value is less or equal', () => {
			expect(comparisonFunctions.lessThanOrEqual(5, 10)).toBe(true);
			expect(comparisonFunctions.lessThanOrEqual(5, 5)).toBe(true);
			expect(comparisonFunctions.lessThanOrEqual(-1, 0)).toBe(true);
		});

		it('should return false for numbers when value is greater', () => {
			expect(comparisonFunctions.lessThanOrEqual(10, 5)).toBe(false);
			expect(comparisonFunctions.lessThanOrEqual(0, -1)).toBe(false);
		});
	});

	describe('in', () => {
		it('should return true when value is in array', () => {
			expect(comparisonFunctions.in('apple', ['apple', 'banana', 'cherry'])).toBe(true);
			expect(comparisonFunctions.in(2, [1, 2, 3, 4, 5])).toBe(true);
			expect(comparisonFunctions.in(true, [true, false])).toBe(true);
		});

		it('should return false when value is not in array', () => {
			expect(comparisonFunctions.in('grape', ['apple', 'banana', 'cherry'])).toBe(false);
			expect(comparisonFunctions.in(6, [1, 2, 3, 4, 5])).toBe(false);
		});

		it('should return false when filterValue is not an array', () => {
			expect(comparisonFunctions.in('apple', 'not an array')).toBe(false);
			expect(comparisonFunctions.in(2, null)).toBe(false);
			expect(comparisonFunctions.in(true, undefined)).toBe(false);
		});

		it('should handle empty arrays', () => {
			expect(comparisonFunctions.in('anything', [])).toBe(false);
		});
	});

	describe('notIn', () => {
		it('should return false when value is in array', () => {
			expect(comparisonFunctions.notIn('apple', ['apple', 'banana', 'cherry'])).toBe(false);
			expect(comparisonFunctions.notIn(2, [1, 2, 3, 4, 5])).toBe(false);
			expect(comparisonFunctions.notIn(true, [true, false])).toBe(false);
		});

		it('should return true when value is not in array', () => {
			expect(comparisonFunctions.notIn('grape', ['apple', 'banana', 'cherry'])).toBe(true);
			expect(comparisonFunctions.notIn(6, [1, 2, 3, 4, 5])).toBe(true);
		});

		it('should return true when filterValue is not an array', () => {
			expect(comparisonFunctions.notIn('apple', 'not an array')).toBe(true);
			expect(comparisonFunctions.notIn(2, null)).toBe(true);
			expect(comparisonFunctions.notIn(true, undefined)).toBe(true);
		});

		it('should handle empty arrays', () => {
			expect(comparisonFunctions.notIn('anything', [])).toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should handle null and undefined values consistently', () => {
			expect(comparisonFunctions.equals(null, null)).toBe(true);
			expect(comparisonFunctions.equals(undefined, undefined)).toBe(true);
			expect(comparisonFunctions.equals(null, undefined)).toBe(false);
		});

		it('should handle special number values', () => {
			expect(comparisonFunctions.equals(NaN, NaN)).toBe(false); // NaN !== NaN in JavaScript
			expect(comparisonFunctions.equals(Infinity, Infinity)).toBe(true);
			expect(comparisonFunctions.equals(-Infinity, -Infinity)).toBe(true);
		});

		it('should handle object comparisons (reference equality)', () => {
			const obj1 = { a: 1 };
			const obj2 = { a: 1 };
			const obj3 = obj1;

			expect(comparisonFunctions.equals(obj1, obj2)).toBe(false); // Different references
			expect(comparisonFunctions.equals(obj1, obj3)).toBe(true); // Same reference
		});
	});
});
