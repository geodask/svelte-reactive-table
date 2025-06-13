let filterIdCounter = 0;

const FILTER_ID_PREFIX = 'filter';

/**
 * Generates a unique ID for filter groups
 * 
 * @internal
 *
 * @param prefix - Optional prefix to use instead of default
 * @returns A unique identifier string
 */
export function generateId(prefix: string = FILTER_ID_PREFIX): string {
	return `${prefix}-${++filterIdCounter}`;
}
