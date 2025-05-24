import { log, messages } from '../internal/logger/index.js';
import type { Column, ColumnDef, ReactiveTable, Row } from './types/index.js';
import type { ReactiveTableWithPlugins, TablePlugin } from './types/plugin.js';

/**
 * Creates a reactive table that automatically updates with data changes and supports plugins.
 *
 * @param initialData - Initial array of data items to populate the table
 * @param columnDefs - Column definitions that specify how to display and interact with data
 * @returns A fully reactive table that can be extended with plugins
 */
export function reactiveTable<T>(
	initialData: T[],
	columnDefs: ColumnDef<T>[]
): ReactiveTableWithPlugins<T> {
	let _data = $state(initialData);
	let _columnDefs = $state(columnDefs);
	const _pluginStates = $state<Record<string, unknown>>({});
	const _plugins = $state<TablePlugin<T, unknown>[]>([]);
	const _pluginOutputRegistry = new Map<string, ReturnType<TablePlugin<T, unknown>['init']>>();

	let getDisplayRows = () => allRows;
	let getDisplayColumns = () => allColumns;

	const allColumns: Column<T>[] = $derived(
		_columnDefs.map((col) => ({
			...col,
			isIdentifier: col.isIdentifier ?? false
		}))
	);

	const identifierColumn = $derived.by(() => {
		const identifier = _columnDefs.find((col) => col.isIdentifier);
		if (!identifier) {
			log.warn(messages.no_identifier_column());
		}
		return identifier;
	});

	const allRows: Row<T>[] = $derived.by(() => {
		return _data.map((item) => {
			const identifierAccessor = identifierColumn?.accessor || allColumns[0].accessor;

			if (!item[identifierAccessor]) {
				log.error(
					messages.missing_identifier_value(String(identifierAccessor)),
					$state.snapshot(item)
				);
			}

			return {
				id: item[identifierAccessor],
				original: item,
				cells: getDisplayColumns().map((column) => ({
					key: column.accessor,
					value: item[column.accessor]
				}))
			};
		});
	});

	const headers = $derived(getDisplayColumns().map((column) => column.header));

	const table: ReactiveTable<T> = {
		set data(value: T[]) {
			_data = value;
		},
		get data() {
			return _data;
		},
		set columnDefs(value: ColumnDef<T>[]) {
			_columnDefs = value;
		},
		get columnDefs() {
			return _columnDefs;
		},
		get allColumns() {
			return allColumns;
		},
		get allRows() {
			return allRows;
		},
		get columns() {
			return getDisplayColumns();
		},
		get headers() {
			return headers;
		},
		get rows() {
			return getDisplayRows();
		}
	};

	const tableWithPlugins = table as ReactiveTableWithPlugins<T>;

	Object.defineProperty(tableWithPlugins, 'plugins', {
		get() {
			return _pluginStates;
		}
	});

	/**
	 * Reconstructs the plugin pipeline using cached outputs
	 */
	const reconstructPluginPipeline = () => {
		getDisplayRows = () => allRows;
		getDisplayColumns = () => allColumns;

		for (const plugin of _plugins) {
			const cachedOutput = _pluginOutputRegistry.get(plugin.id);
			if (cachedOutput) {
				getDisplayRows = () => cachedOutput.rows!;
				getDisplayColumns = () => cachedOutput.columns!;
			}
		}
	};

	Object.defineProperty(tableWithPlugins, 'use', {
		value: function <P>(plugin: TablePlugin<T, P>): ReactiveTableWithPlugins<T> {
			const pluginOutput = plugin.init(getDisplayRows, getDisplayColumns);
			_pluginOutputRegistry.set(plugin.id, pluginOutput);
			_plugins.push(plugin);
			_pluginStates[plugin.id] = pluginOutput.state;
			reconstructPluginPipeline();
			return tableWithPlugins;
		}
	});

	return tableWithPlugins;
}
