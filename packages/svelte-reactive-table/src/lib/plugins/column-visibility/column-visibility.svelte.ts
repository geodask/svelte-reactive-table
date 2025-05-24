import type { PluginOutput, TablePlugin } from '$lib/core/index.js';
import type {
	ColumnVisibilityOptions,
	ColumnVisibilityPluginId,
	ColumnVisibilityState
} from './types/index.js';

/**
 * Returns a column visibility plugin for the table
 *
 * @param options - Options for the column visibility
 * @returns A column visibility plugin
 */
export function reactiveColumnVisibility<T>(
	options: ColumnVisibilityOptions<T> = {}
): TablePlugin<T, ColumnVisibilityState<T>, ColumnVisibilityPluginId> {
	return {
		id: 'columnVisibility' as const,

		init(getRows, getColumns) {
			let _hiddenColumns = $state<(keyof T)[]>(options.hiddenColumns?.slice() || []);

			const state: ColumnVisibilityState<T> = {
				get hiddenColumns() {
					return _hiddenColumns;
				},

				isVisible(accessor) {
					return !_hiddenColumns.includes(accessor);
				},

				setVisibility(accessor, isVisible) {
					if (isVisible) {
						_hiddenColumns = _hiddenColumns.filter((col) => col !== accessor);
					} else if (!_hiddenColumns.includes(accessor)) {
						_hiddenColumns = [..._hiddenColumns, accessor];
					}
				},

				toggleVisibility(accessor) {
					this.setVisibility(accessor, !this.isVisible(accessor));
				},

				showColumns(accessors) {
					_hiddenColumns = _hiddenColumns.filter((col) => !accessors.includes(col));
				},

				hideColumns(accessors) {
					const newHidden = accessors.filter((col) => !_hiddenColumns.includes(col));
					if (newHidden.length > 0) {
						_hiddenColumns = [..._hiddenColumns, ...newHidden];
					}
				},

				setVisibleColumns(accessors) {
					const allAccessors = getColumns().map((col) => col.accessor);
					_hiddenColumns = allAccessors.filter((col) => !accessors.includes(col));
				},

				resetVisibility() {
					_hiddenColumns = [];
				}
			};

			const output: PluginOutput<T, ColumnVisibilityState<T>> = {
				state,
				get columns() {
					return getColumns().filter((column) => !_hiddenColumns.includes(column.accessor));
				},

				get rows() {
					return getRows();
				}
			};

			return output;
		}
	};
}
