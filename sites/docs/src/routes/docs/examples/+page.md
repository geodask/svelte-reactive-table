---
layout: docPage
---

<script lang="ts">
    import * as Card from '$shared/ui/shadcn/card';
    import { Badge } from '$shared/ui/shadcn/badge';
    import { ArrowRight, Table2, Eye, ChevronsLeftRightEllipsis, ArrowUpDown, Sparkles } from '@lucide/svelte';
    import ExampleCard from './example-card.svelte';
    import { ChevronRight } from '@lucide/svelte';
    
    const examples = [
        {
            title: 'Basic Table',
            description: 'A simple table with core functionality including column headers, row rendering, dynamic data updates, and empty state handling.',
            icon: Table2,
            href: '/docs/examples/basic-table',
            features: ['Column headers', 'Row rendering', 'Dynamic updates', 'Empty states']
        },
        {
            title: 'Column Visibility',
            description: 'Control which columns are displayed with a toggle interface, column visibility state management, and persistence.',
            icon: Eye,
            href: '/docs/examples/column-visibility',
            features: ['Toggle columns', 'Visibility state', 'Persistence']
        },
        {
            title: 'Pagination',
            description: 'Navigate large datasets with page controls, configurable page sizes, and row count indicators.',
            icon: ChevronsLeftRightEllipsis,
            href: '/docs/examples/pagination',
            features: ['Page navigation', 'Page size selection', 'Row counts']
        },
        {
            title: 'Sorting',
            description: 'Sort table data with single or multi-column sorting, custom indicators, and sort state management.',
            icon: ArrowUpDown,
            href: '/docs/examples/sorting',
            features: ['Single/Multi-column', 'Sort direction', 'Custom indicators']
        },
        {
            title: 'Full Featured Table',
            description: 'A comprehensive example combining all available features with modern UI components and accessibility.',
            icon: Sparkles,
            href: '/docs/examples/full-featured-table',
            features: ['All features', 'Modern UI', 'Responsive', 'Accessible']
        }
    ];
</script>

# Examples

## Table Features

This section provides practical examples of Svelte Reactive Table in action, from basic implementations to full-featured tables. Each example demonstrates different aspects of the library and comes with both source code and live previews.

<div class="not-prose grid gap-6 pt-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
  {#each examples as example}
    <ExampleCard {example} />
  {/each}
</div>
