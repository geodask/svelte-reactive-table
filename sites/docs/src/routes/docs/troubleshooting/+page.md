---
layout: docPage
---

<script lang="ts">
	import { reactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte'
	import { BookOpen } from '@lucide/svelte';

	const breadcrumb = reactiveBreadcrumb();
	breadcrumb.setItems([
		{
			icon: BookOpen, 
			href: '/docs/introduction'
		},
		{
			title: 'Help',
		},
		{
			title: 'Troubleshooting'
		}
	])
</script>

# Troubleshooting

Running into issues? Don't worry - most problems have simple solutions. Here are the most common issues and how to fix them.

## Table Not Updating When Data Changes

**Problem**: You modify your data but the table doesn't update.

**Solutions**:

✅ **Make sure you're modifying the table's data reference**:

```js
// ✅ Correct - modifies table.data
table.data.push(newItem);
table.data = [...table.data, newItem];

// ❌ Wrong - modifies original array, not table.data
originalData.push(newItem);
```

✅ **Use reactive assignments**:

```js
// ✅ Correct - triggers reactivity
table.data = table.data.filter((item) => item.id !== removeId);

// ❌ Wrong - mutation doesn't trigger reactivity in some cases
table.data.splice(index, 1);
```

## TypeScript Errors with Column Accessors

**Problem**: TypeScript complains about column accessor properties.

**Solution**: Define your data type and use it with the table:

```ts
// ✅ Define your data type
type User = {
	id: number;
	name: string;
	email: string;
};

// ✅ Use typed columns
const columns: ColumnDef<User>[] = [
	{ accessor: 'id', header: 'ID', isIdentifier: true },
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'email', header: 'Email' }
];

// ✅ Create typed table
const table = reactiveTable<User>(users, columns);
```

## Pagination Not Working

**Problem**: Added pagination but still seeing all rows.

**Solutions**:

✅ **Use `table.rows` not `table.allRows`**:

```svelte
<!-- ✅ Correct - shows paginated data -->
{#each table.rows as row}

<!-- ❌ Wrong - shows all data -->
{#each table.allRows as row}
```

✅ **Check pagination plugin order**:

```js
// ✅ Correct - pagination should be added last
const table = reactiveTable(data, columns)
	.use(reactiveColumnVisibility())
	.use(reactiveSorting())
	.use(reactivePagination({ pageSize: 10 }));
```

## Sorting Not Applying

**Problem**: Clicking sort buttons but data order doesn't change.

**Solutions**:

✅ **Make sure you're using the sorting plugin**:

```js
const table = reactiveTable(data, columns).use(reactiveSorting());

const { sorting } = table.plugins;
```

✅ **Check your sort handlers**:

```svelte
<!-- ✅ Correct -->
<th click={() => sorting.toggleSort('name')}> Name </th>

<!-- ❌ Wrong - missing function call -->
<th click={sorting.toggleSort('name')}> Name </th>
```

## Column Visibility Controls Not Working

**Problem**: Toggle buttons don't hide/show columns.

**Solutions**:

✅ **Access the plugin correctly**:

```js
const table = reactiveTable(data, columns).use(reactiveColumnVisibility());

// ✅ Correct
const { columnVisibility } = table.plugins;

// ❌ Wrong
const columnVisibility = table.columnVisibility;
```

✅ **Use the right property names**:

```js
// ✅ Correct - use accessor names
columnVisibility.toggleVisibility('email');

// ❌ Wrong - don't use header names
columnVisibility.toggleVisibility('Email Address');
```

## Performance Issues with Large Datasets

**Problem**: Table feels slow with lots of data.

**Solutions**:

✅ **Use pagination for large datasets**:

```js
// For 1000+ rows, always use pagination
const table = reactiveTable(data, columns).use(reactivePagination({ pageSize: 25 }));
```

✅ **Avoid complex computed values in templates**:

```svelte
<!-- ✅ Fast - compute once, cache result -->
<script>
	const processedRows = $derived(
		table.rows.map((row) => ({
			...row,
			computed: expensiveCalculation(row.cells[0].value)
		}))
	);
</script>

<!-- ❌ Slow - computes on every render -->
{#each table.rows as row}
	<td>{expensiveCalculation(row.cells[0].value)}</td>
{/each}

{#each processedRows as row}
	<td>{row.computed}</td>
{/each}
```

## Svelte 5 Runes Issues

**Problem**: Errors related to runes or reactivity.

**Solutions**:

✅ **Make sure you're using Svelte 5.0.0+**:

```bash
npm list svelte
```

✅ **Use `$derived` for computed values**:

```js
// ✅ Correct with Svelte 5
const totalRows = $derived(table.data.length);

// ❌ Old Svelte 4 syntax
$: totalRows = table.data.length;
```

## Plugin Access Errors

**Problem**: `table.plugins` is undefined or missing properties.

**Solutions**:

✅ **Check plugin initialization**:

```js
// ✅ Make sure plugins are added
const table = reactiveTable(data, columns).use(reactivePagination({ pageSize: 10 }));

// ✅ Access after adding plugins
const { pagination } = table.plugins;
```

✅ **Access plugins in the right order**:

```svelte
<script>
	// ✅ Define table first
	const table = reactiveTable(data, columns).use(reactivePagination({ pageSize: 10 }));

	// ✅ Then access plugins
	const { pagination } = table.plugins;
</script>
```

## Data Not Displaying

**Problem**: Table renders but shows no data.

**Solutions**:

✅ **Check your data structure**:

```js
// ✅ Correct - array of objects
const data = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' }
];

// ❌ Wrong - not an array
const data = { id: 1, name: 'Alice' };
```

✅ **Verify column accessors match data properties**:

```js
const data = [{ userId: 1, fullName: 'Alice' }];

// ✅ Correct - matches data properties
const columns = [
	{ accessor: 'userId', header: 'ID' },
	{ accessor: 'fullName', header: 'Name' }
];

// ❌ Wrong - properties don't exist
const columns = [
	{ accessor: 'id', header: 'ID' },
	{ accessor: 'name', header: 'Name' }
];
```

## Still Having Issues?

If you're still stuck after trying these solutions:

1. **Check the browser console** for error messages
2. **Verify your Svelte version** is 5.0.0 or higher
3. **Look at the [examples](/docs/examples)** for working implementations
4. **Compare your code** with the [Quick Start guide](/docs/quick-start)

> Most issues come from small typos in accessor names or forgetting to access plugins correctly. Double-check the basics first!
