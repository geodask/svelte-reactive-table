# svelte-reactive-table

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
