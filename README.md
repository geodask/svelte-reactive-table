# Svelte Reactive Table

A headless, fully reactive table library for Svelte applications. This project provides a flexible, customizable table solution without imposing any styling constraints.

## What is Svelte Reactive Table?

Svelte Reactive Table is designed to give you complete control over your data tables while handling all the complex state management and interactions. As a headless UI library, it provides the functionality but leaves the styling and UI decisions entirely up to you.

## Basic Usage

```svelte
<script lang="ts">
  import { reactiveTable } from 'svelte-reactive-table';

  // Your data array
  const data = [
    { name: 'John Doe', age: 30, city: 'New York' },
    { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  ];

  // Define your columns
  const columns = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'age', header: 'Age' },
    { accessor: 'city', header: 'City' }
  ];

  const table = reactiveTable(data, columns);
</script>

<table>
  <thead>
    <tr>
      {#each table.headers as header}
        <th>{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each table.rows as row}
      <tr>
        {#each row.cells as cell}
          <td>{cell.value}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
```

## Features and Implementation Status

- ✅ **Basic Table Structure**
  - ✅ Column definitions
  - ✅ Row rendering
  - ✅ Reactive data updates
- 🧠 **Headless Design**
  - ✅ No predefined styles
  - ⬜ Customizable cell rendering
  - ⬜ Custom header rendering
- ⚡ **Reactive Core**
  - ✅ Reactive data binding
  - ⬜ Dynamic column updates
  - ⬜ Computed columns
- 🔄 **Sorting**
  - ⬜ Column-based sorting
  - ⬜ Multi-column sort
  - ⬜ Custom comparators
- 🔍 **Filtering**
  - ⬜ Global search
  - ⬜ Column filters
  - ⬜ Custom filter functions
- 📊 **Pagination**
  - ⬜ Page size control
  - ⬜ Page navigation
  - ⬜ Load more functionality
- 🔢 **Row Selection**
  - ⬜ Single selection
  - ⬜ Multiple selection
  - ⬜ Range selection
- 🔗 **Column Management**
  - ⬜ Column resizing
  - ⬜ Column reordering
  - ⬜ Column visibility toggle

## Project Structure

This project is structured as a monorepo:

```
packages/
  svelte-reactive-table/  # The main library package
sites/
  docs/                   # Documentation website
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.