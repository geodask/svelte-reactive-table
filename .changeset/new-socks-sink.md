---
'svelte-reactive-table': minor
---

feat: add modular pagination support

- Add new `reactivePagination` API for configurable table pagination
- Change table API to use composition pattern for pagination
- Export pagination types and functions in public API
- Update examples to demonstrate the new pagination approach

BREAKING CHANGE: The table API signature has changed. Pagination is now provided through a factory function instead of configuration options directly on the table.
