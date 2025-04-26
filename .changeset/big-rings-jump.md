---
'svelte-reactive-table': minor
---

feat: add column visibility as an opt-in feature

- Introduced new `reactiveColumnVisibility` function
- Added ability to manage column visibility (when enabled) through the table's `columnVisibility` property with methods for toggling, showing, and hiding columns

BREAKING: Column visibility API has changed - `visible` property has been removed from column definitions, visibility methods are now moved to the `columnVisibility` object, and some property names have been changed
