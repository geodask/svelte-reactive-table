---
'svelte-reactive-table': minor
---

feat: implement plugin architecture for table features

This update redesigns how table features work by introducing a standardized plugin system. Features like pagination, sorting, and column visibility are now implemented as plugins with a consistent interface.

Improvements include:

- New plugin system with `table.use(plugin)` method
- Enhanced pagination state with `hasNextPage`, `hasPreviousPage`, `isFirstPage`, `isLastPage`, and `pageItemRange`
- Better TypeScript types for improved type safety
- Standardized plugin lifecycle with init and cleanup methods

BREAKING CHANGES:

- Plugins must now be attached to tables using `table.use(plugin)`
- Plugin state is accessed through `table.plugins.[pluginId].state`
- Navigation methods are now renamed to `goToNextPage`, `goToPreviousPage`, `goToFirstPage`, `goToLastPage`