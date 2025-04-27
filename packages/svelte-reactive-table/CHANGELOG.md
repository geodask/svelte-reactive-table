# svelte-reactive-table

## 0.4.0

### Minor Changes

- ad357dd: feat: add basic sorting functionality

### Patch Changes

- e26a788: refactor: reorganize project structure into core and features modules

## 0.3.0

### Minor Changes

- 8df363c: feat: add column visibility as an opt-in feature

  - Introduced new `reactiveColumnVisibility` function
  - Added ability to manage column visibility (when enabled) through the table's `columnVisibility` property with methods for toggling, showing, and hiding columns

  BREAKING: Column visibility API has changed - `visible` property has been removed from column definitions, visibility methods are now moved to the `columnVisibility` object, and some property names have been changed

- 5b60ac5: refactor: simplify API by exposing paginated rows through table.rows and prepare for future features

  This refactoring improves the pagination API by moving row management from the pagination component into the core table. Instead of accessing rows through `table.pagination.rows`, users now consistently use `table.rows` regardless of active features.

  Key changes:

  - Refactored internal pagination architecture to better separate concerns
  - Created a more unified and intuitive API for accessing table rows
  - Maintained all pagination functionality and state management
  - Updated documentation and examples to reflect the new approach

  **BREAKING CHANGE**: Applications using `table.pagination.rows` must now use `table.rows` instead.

## 0.2.2

### Patch Changes

- 656f74a: fix: remove `$effect` from `reactiveTable` function

## 0.2.1

### Patch Changes

- ecaa473: fix: small issue with reactivity

## 0.2.0

### Minor Changes

- bd6bb1b: refactor: make pagination optional with improved TypeScript API

  - Make pagination completely optional through a new options-based API
  - Add TypeScript generics to provide proper type safety with or without pagination
  - Introduce `TableOptions` interface for configuring table features
  - Improve public type exports for better developer experience
  - Update examples to demonstrate both basic tables and tables with pagination
  - Enhance type organization for better code documentation

  BREAKING CHANGE: Introduced new options-based API for table configuration that changes how tables are initialized and configured.

- f4ba175: feat: add modular pagination support

  - Add new `reactivePagination` API for configurable table pagination
  - Change table API to use composition pattern for pagination
  - Export pagination types and functions in public API
  - Update examples to demonstrate the new pagination approach

  BREAKING CHANGE: The table API signature has changed. Pagination is now provided through a factory function instead of configuration options directly on the table.

## 0.1.1

### Patch Changes

- 2c6254b: refactor: remove examples from lib directory

## 0.1.0

### Minor Changes

- d1ce4bd: feat: enhance table with pagination and column visibility

  - Add pagination with flexible page size controls
  - Add column visibility toggling
  - Implement row identification with ID tracking
  - Add logging system for errors and warnings
  - Create example components demonstrating features

## 0.0.3

### Patch Changes

- 8d6dd61: chore: add MIT License

## 0.0.2

### Patch Changes

- 0e5b8ac: Initial release of svelte-reactive-table

  WHAT:

  - First public release of the headless, fully reactive table library for Svelte applications
  - Core table functionality with TypeScript support
  - Svelte 5 compatibility

  WHY:

  - Providing a modern, type-safe table solution for Svelte applications
  - Offering a headless approach for maximum styling flexibility

  HOW TO USE:

  - Install using: pnpm add svelte-reactive-table
  - Follow the documentation for implementation details

## 0.0.1

### Initial Release

- Basic table structure with column definitions
- Row rendering capabilities
- Reactive data updates
- Headless design with no predefined styles
- Reactive data binding
