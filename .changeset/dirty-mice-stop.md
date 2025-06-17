---
'svelte-reactive-table': minor
---

feat: add filtering plugin

This update introduces a flexible and easy-to-use filtering system that supports multiple filter types and intelligent value matching.

Key features:

- New `reactiveFiltering` plugin for flexible data filtering
- Intelligent filter matching: exact values, arrays for IN operations, and custom predicate functions
- Built-in string filtering with case-insensitive contains matching by default
- Configurable case sensitivity option
- Comprehensive filter helpers for common patterns (range, startsWith, endsWith, exactText, not)
- Simple state management with reactive filter tracking
- Clean API: `setFilter()`, `setFilters()`, `removeFilter()`, `clearFilters()`, and `getFilter()`
- Full TypeScript support with proper type inference and safety
- Seamless integration with existing plugin architecture using `table.use(plugin)` pattern
