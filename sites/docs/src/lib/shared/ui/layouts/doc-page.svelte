<script lang="ts" module>
	export { code, h2, h3, pre } from '../markdown';
</script>

<script lang="ts">
	import * as Breadcrumb from '$shared/ui/shadcn/breadcrumb';
	import { BookOpen } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<Breadcrumb.Root class="mb-8">
	<Breadcrumb.List class="text-base">
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/docs/introduction">
				<BookOpen class="size-5" />
			</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page class="text-muted-foreground">Getting Started</Breadcrumb.Page>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Introduction</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<div class="prose prose-base max-w-none relative dark:prose-invert pb-10">
	{@render children()}
</div>
