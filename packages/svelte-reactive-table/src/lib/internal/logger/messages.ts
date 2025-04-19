import { log } from './logger.js';

/**
 * Error and warning message constants for consistent messaging
 * @internal
 */
export const messages = {
	missing_identifier: (prop: string) =>
		`Row is missing a value for identifier property "${prop}". Each row must have a unique, non-null identifier value.`,
	missing_identifier_value: (identifier: string) =>
		`Row is missing a value for identifier property "${identifier}". Each row must have a unique, non-null identifier value.`,
	no_identifier_column: () =>
		'No column is explicitly marked as identifier (isIdentifier: true). Using the first column as fallback. Consider marking an identifier column to ensure stable row identification.',
	invalid_page: (page: number, pageCount: number) =>
		`Invalid page index ${page}. Page must be between 0 and ${pageCount - 1}.`,
	invalid_page_size: (pageSize: number) =>
		`Invalid page size ${pageSize}. Page size must be a positive number.`
};
