---
layout: docPage
slug: introduction
---

<script lang="ts">
  import EarlyReleaseAlert from '$widgets/early-release-alert/ui/early-release-alert.svelte';
  import { reactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte'
	import { BookOpen } from '@lucide/svelte';

	const breadcrumb = reactiveBreadcrumb();
	breadcrumb.setItems([
		{
			icon: BookOpen, 
			href: '/docs/introduction'
		},
		{
			title: 'Getting Started',
		},
		{
			title: 'Introduction'
		}
	])
</script>

# Introduction to Svelte Reactive Table

<EarlyReleaseAlert/>

## What is Svelte Reactive Table?

Svelte Reactive Table is a headless, fully reactive table library built specifically for Svelte applications. It provides essential table functionality with a clean API that lets you focus on building great user experiences rather than managing complex table state.

The library uses a "headless" approach - it handles all the table logic and state management while giving you complete control over styling and presentation.

## Powered by Svelte's Reactivity

The library leverages Svelte's reactivity system (including Svelte 5 runes) to create tables that automatically update when your data changes:

- Add, remove, or modify data and your table instantly reflects these changes
- Toggle column visibility with immediate UI updates
- Change pagination settings with real-time page recalculation

All of this happens automatically without you having to write extra code to sync your UI with your data state.

## Modular and Flexible Design

Svelte Reactive Table follows a plugin-based architecture:

### 1. Core Table Functionality

The foundation is a simple, reactive table with column definitions and row generation. This covers your basic table needs with minimal setup.

### 2. Extensible Plugin System

Enhance your tables with plugins for specific features:

- **Pagination Plugin**: Navigate through large datasets with page size controls and navigation
- **Column Visibility Plugin**: Show or hide columns dynamically
- **Sorting Plugin**: Sort data with single or multi-column capabilities
- **Filtering Plugin**: Filter data with exact matches, arrays, predicate functions, and built-in helpers
- **More Coming Soon**: Additional plugins for row selection and other capabilities are planned

This plugin-based approach keeps your bundle size small and your tables fast by only including what your application actually uses. Plugins can be added easily with a fluent API:

```js
const table = reactiveTable(data, columns)
	.use(reactiveFiltering())
	.use(reactiveSorting({ multiSort: true }))
	.use(reactivePagination({ pageSize: 10 }))
	.use(reactiveColumnVisibility());

// Access plugin functionality
const { filtering, sorting, pagination, columnVisibility } = table.plugins;
```

### 3. Future Extensions

We're actively developing additional features to make Svelte Reactive Table even more powerful:

- **Row Selection**: Single and multi-select capabilities
- **Server-Side Operations**: Support for server-driven pagination, sorting, and filtering
- **Virtual Scrolling**: Efficiently handle thousands of rows
- **And much more**: Column resizing, sticky headers, expandable rows

Each feature maintains our headless philosophy - you get the functionality without losing control over your UI.

> 📋 **Want to see what's coming next?** Check out our [roadmap](/docs/roadmap) for detailed information about upcoming features and timelines.

## Key Features

- **Fully Reactive**: Your table updates automatically whenever data changes
- **Headless by Design**: No predefined styles or components - you control the presentation
- **Type-Safe API**: Comprehensive TypeScript support for reliable developer experience
- **Optimized Performance**: Efficient reactivity that minimizes unnecessary re-renders
- **Intuitive API**: Simple functions and patterns that feel natural to Svelte developers

## When to Use Svelte Reactive Table

Svelte Reactive Table is ideal when you need:

- A table solution built specifically for Svelte with its reactivity system in mind
- Complete styling freedom without fighting against predefined components
- A lightweight table implementation focused on performance
- TypeScript support for safe development
- A flexible solution that can grow from simple tables to complex data grids

If you want a table library that embraces Svelte's philosophy of simplicity and reactivity while giving you full control over your UI, Svelte Reactive Table is designed for exactly that purpose.

## Ready to Get Started?

Now that you understand what Svelte Reactive Table offers, here's how to begin:

1. **[Install the library](/docs/installation)** - Get up and running in minutes
2. **[Follow the Quick Start guide](/docs/quick-start)** - Build your first reactive table
3. **[Explore the examples](/docs/examples)** - See real implementations in action
