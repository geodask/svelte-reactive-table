import type { Column, ReactiveTable, Row } from './index.js';

/**
 * Interface for creating plugins that extend the functionality of a reactive table.
 *
 * @template T - The type of data items in the table
 * @template TPluginState - The state managed by this plugin
 * @template TPluginId - The string literal type for the plugin's ID
 */
export interface TablePlugin<T, TPluginState, TPluginId extends string = string> {
	/**
	 * Unique identifier for this plugin
	 */
	readonly id: TPluginId;

	/**
	 * Initialize the plugin and attach it to the table
	 *
	 * @param table - The table instance to attach to
	 * @returns The plugin state and any enhancements to the table
	 */
	init(getRows: () => Row<T>[], getColumns: () => Column<T>[]): PluginOutput<T, TPluginState>;
}

/**
 * The output of initializing a plugin
 *
 * @template T - The type of data items in the table
 * @template TPluginState - The state managed by this plugin
 */
export interface PluginOutput<T, TPluginState = unknown> {
	/**
	 * The state of the plugin which will be accessible via table.plugins[id]
	 */
	state: TPluginState;

	rows: Row<T>[];

	columns: Column<T>[];
}

/**
 * Empty plugins map type
 */
export type EmptyPluginsMap = Record<string, never>;

/**
 * The type of a table with plugins applied
 *
 * @template T - The type of data items in the table
 * @template TPluginsMap - Map of plugin IDs to their state types
 */
export type ReactiveTableWithPlugins<
	T,
	TPluginsMap extends Record<string, unknown> = EmptyPluginsMap
> = ReactiveTable<T> & {
	/**
	 * Registry of all installed plugins and their state
	 * Type-safe access to plugin states based on plugin ID
	 */
	plugins: TPluginsMap;

	/**
	 * Install a new plugin to the table
	 *
	 * @param plugin - The plugin to install
	 * @returns The table instance with an updated plugin type
	 */
	use<TPluginId extends string, TPluginState>(
		plugin: TablePlugin<T, TPluginState, TPluginId>
	): ReactiveTableWithPlugins<T, TPluginsMap & Record<TPluginId, TPluginState>>;
};
