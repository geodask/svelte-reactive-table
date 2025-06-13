import type { TablePlugin as ReactiveTablePlugin } from '$lib/core/index.js';
import { and, or } from './builders.js';
import {
	countFilterConditions,
	evaluateFilterGroup,
	removeFilterGroupById
} from './internal/helpers.js';
import type {
	FilterGroup,
	FiltersOptions,
	FiltersPluginId,
	FiltersState,
	LogicalOperator
} from './types/index.js';

/**
 * Returns a filtering plugin for the table
 *
 * @template T - The data type of the table row
 * @param options - Options for the filtering
 * @returns A filtering plugin
 */
export function reactiveFiltering<T, K extends keyof T = keyof T>(
	options: FiltersOptions<T, K> = {}
): ReactiveTablePlugin<T, FiltersState<T, K>, FiltersPluginId> {
	return {
		id: 'filters' as const,

		init(getRows, getColumns) {		let _filterGroup = $state<FilterGroup<T, K> | undefined>(options.filterGroup);

		const state: FiltersState<T, K> = {
			get filterGroup() {
				return _filterGroup;
			},

			get count() {
				return _filterGroup ? countFilterConditions(_filterGroup) : 0;
			},

			get hasActiveFilters() {
				return _filterGroup !== undefined;
			},

			setFilterGroup(filterGroup: FilterGroup<T, K> | undefined): FiltersState<T, K> {
				_filterGroup = filterGroup;
				return state;
			},

			addFilterGroup(
				filterGroup: FilterGroup<T, K>,
				operator: LogicalOperator
			): FiltersState<T, K> {
				if (!_filterGroup) {
					_filterGroup = filterGroup;
				} else {
					_filterGroup =
						operator === 'AND' ? and(_filterGroup, filterGroup) : or(_filterGroup, filterGroup);
				}

				return state;
			},

			removeFilterGroup(id: string): FiltersState<T, K> {
				if (_filterGroup) {
					const result = removeFilterGroupById(_filterGroup, id);
					_filterGroup = result ? result : undefined;
				}
				return state;
			},

			clearFilters(): FiltersState<T, K> {
				_filterGroup = undefined;
				return state;
			}
			};

			return {
				state,

				get columns() {
					return getColumns();
				},

				get rows() {
					return getRows().filter((row) => {
						if (!state.filterGroup) return true;

						try {
							return evaluateFilterGroup(state.filterGroup, row);
						} catch (error) {
							console.warn('Filter evaluation error:', error);
							return true;
						}
					});
				}
			};
		}
	};
}
