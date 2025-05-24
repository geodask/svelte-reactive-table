---
layout: docPage
---

# Plugin API Reference

API reference for the plugin system types and interfaces in Svelte Reactive Table.

## TablePlugin Interface

Core interface for implementing plugins:

```ts
interface TablePlugin<T, TPluginState, TPluginId extends string = string> {
	readonly id: TPluginId;
	init(getRows: () => Row<T>[], getColumns: () => Column<T>[]): PluginOutput<T, TPluginState>;
}
```

## Plugin Development Guide

### TablePlugin Interface

The base interface for creating plugins:

```ts
interface TablePlugin<T, TPluginState, TPluginId extends string = string> {
	readonly id: TPluginId;
	init(getRows: () => Row<T>[], getColumns: () => Column<T>[]): PluginOutput<T, TPluginState>;
}
```

| Type Parameter | Description                             |
| -------------- | --------------------------------------- |
| `T`            | The type of data items in the table     |
| `TPluginState` | The state managed by this plugin        |
| `TPluginId`    | String literal type for the plugin's ID |

#### Properties

| Property | Type        | Description                      |
| -------- | ----------- | -------------------------------- |
| `id`     | `TPluginId` | Unique identifier for the plugin |

#### Methods

| Method | Parameters                                                   | Return Type                     | Description                           |
| ------ | ------------------------------------------------------------ | ------------------------------- | ------------------------------------- |
| `init` | `getRows: () => Row<T>[]`<br>`getColumns: () => Column<T>[]` | `PluginOutput<T, TPluginState>` | Initializes the plugin with the table |

### PluginOutput Interface

The output of initializing a plugin:

```ts
interface PluginOutput<T, TPluginState = unknown> {
	state: TPluginState;
	rows: Row<T>[];
	columns: Column<T>[];
}
```

| Property  | Type           | Description                                     |
| --------- | -------------- | ----------------------------------------------- |
| `state`   | `TPluginState` | Plugin state accessible via `table.plugins[id]` |
| `rows`    | `Row<T>[]`     | The rows transformed by the plugin              |
| `columns` | `Column<T>[]`  | The columns transformed by the plugin           |

### ReactiveTableWithPlugins Type

A table instance with plugins applied:

```ts
type ReactiveTableWithPlugins<
	T,
	TPluginsMap extends Record<string, unknown> = EmptyPluginsMap
> = ReactiveTable<T> & {
	plugins: TPluginsMap;
	use<TPluginId extends string, TPluginState>(
		plugin: TablePlugin<T, TPluginState, TPluginId>
	): ReactiveTableWithPlugins<T, TPluginsMap & Record<TPluginId, TPluginState>>;
};
```

| Type Parameter | Description                            |
| -------------- | -------------------------------------- |
| `T`            | The type of data items in the table    |
| `TPluginsMap`  | Map of plugin IDs to their state types |

#### Properties and Methods

| Member    | Type                                                                                                     | Description                                   |
| --------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `plugins` | `TPluginsMap`                                                                                            | Registry of installed plugins and their state |
| `use`     | `<TPluginId, TPluginState>(plugin: TablePlugin<T, TPluginState, TPluginId>) => ReactiveTableWithPlugins` | Installs a new plugin                         |

## Type Helpers

### EmptyPluginsMap

Type representing an empty plugin registry:

```ts
type EmptyPluginsMap = Record<string, never>;
```

## What's Next?

**[Built-in Plugins](/docs/api/reactive-sorting)** - API reference for included plugins  
**[Table API](/docs/api/reactive-table)** - Core table API documentation
