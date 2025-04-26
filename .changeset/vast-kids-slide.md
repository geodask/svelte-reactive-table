---
'svelte-reactive-table': minor
---

refactor: simplify API by exposing paginated rows through table.rows and prepare for future features

This refactoring improves the pagination API by moving row management from the pagination component into the core table. Instead of accessing rows through `table.pagination.rows`, users now consistently use `table.rows` regardless of active features. 

Key changes:
- Refactored internal pagination architecture to better separate concerns
- Created a more unified and intuitive API for accessing table rows
- Maintained all pagination functionality and state management
- Updated documentation and examples to reflect the new approach

**BREAKING CHANGE**: Applications using `table.pagination.rows` must now use `table.rows` instead.
