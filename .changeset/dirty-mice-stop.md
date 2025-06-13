---
'svelte-reactive-table': minor
---

feat: add filtering plugin with logical operations

This update introduces a comprehensive filtering system that enables complex data filtering with logical operations and multiple comparison types.

Key features:

- New `reactiveFiltering` plugin for advanced data filtering
- Support for multiple comparison operators (equals, contains, startsWith, endsWith, greaterThan, lessThan, greaterThanOrEqual, lessThanOrEqual, in, notIn)
- Logical operations with `and()` and `or()` builder functions for complex filter expressions
- Intuitive `condition()` API for creating type-safe filter conditions
- Full TypeScript support with proper type inference and safety
- Seamless integration with existing plugin architecture using `table.use(plugin)` pattern
