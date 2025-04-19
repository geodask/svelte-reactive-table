/**
 * Internal utility for consistent error and warning messages
 * @internal
 */
export const log = {
	warn(message: string, ...args: unknown[]): void {
		console.warn(`[svelte-reactive-table] ${message}`, ...args);
	},

	error(message: string, ...args: unknown[]): void {
		console.error(`[svelte-reactive-table] ${message}`, ...args);
	}
};
