---
layout: docPage
slug: installation
---

<script lang="ts">
  import Tabs from '$shared/ui/tabs.svelte';
  import TabItem from '$shared/ui/tab-item.svelte';
  import { reactiveBreadcrumb } from '$shared/lib/breadcrumb.svelte'
	import { BookOpen } from '@lucide/svelte';

  const items = ['npm', 'pnpm', 'yarn', 'bun'];

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
			title: 'Installation'
		}
	])
</script>

# Installation

This guide will help you install the Svelte Reactive Table library in your Svelte project.

## Prerequisites

- Node.js and any package manager (`npm`, `pnpm`, `yarn`, or `bun`)
- Svelte version `5.0.0` or higher

## Installing the Package

<Tabs {items}>
<TabItem value="npm">

```bash
npm install svelte-reactive-table
```

</TabItem>
<TabItem value="pnpm">

```bash
pnpm add svelte-reactive-table
```

</TabItem>
<TabItem value="yarn">

```bash
yarn add svelte-reactive-table
```

</TabItem>
<TabItem value="bun">

```bash
bun add svelte-reactive-table
```

</TabItem>
</Tabs>

## Basic Import

Once installed, you can import the library in your Svelte files:

```svelte
<script lang="ts">
	import { reactiveTable } from 'svelte-reactive-table';

	// Optional pagination functionality
	import { reactivePagination } from 'svelte-reactive-table';
</script>
```

## Next Steps

Now that you've installed the library, check out the [Quick Start guide](/docs/quick-start) to learn how to create and customize your tables.
