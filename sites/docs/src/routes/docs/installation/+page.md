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

This guide covers how to install and set up Svelte Reactive Table in your project.

## Prerequisites

Before installing, ensure you have:

- **Node.js** installed on your system
- A **Svelte 5.0.0+** project (the library uses Svelte 5's runes system)
- A package manager (npm, pnpm, yarn, or bun)

## Installing the Package

Install the library using your preferred package manager:

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

## Import and Use

Once installed, importing the library is straightforward:

```svelte
<script lang="ts">
	import { reactiveTable } from 'svelte-reactive-table';

	// Optional: Import plugins as needed
	import {
		reactivePagination,
		reactiveColumnVisibility,
		reactiveSorting
	} from 'svelte-reactive-table';
</script>
```

> **TypeScript users**: The library is built with TypeScript and includes full type definitions out of the box!

## All Set!

That's it - you're ready to build reactive tables! The installation gives you access to:

- Core table functionality
- All available plugins (pagination, sorting, column visibility)
- Full TypeScript support
- Comprehensive API for customization
