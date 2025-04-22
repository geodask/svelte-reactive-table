---
'svelte-reactive-table': minor
---

refactor: make pagination optional with improved TypeScript API

- Make pagination completely optional through a new options-based API
- Add TypeScript generics to provide proper type safety with or without pagination
- Introduce `TableOptions` interface for configuring table features
- Improve public type exports for better developer experience
- Update examples to demonstrate both basic tables and tables with pagination
- Enhance type organization for better code documentation

BREAKING CHANGE: Introduced new options-based API for table configuration that changes how tables are initialized and configured.
