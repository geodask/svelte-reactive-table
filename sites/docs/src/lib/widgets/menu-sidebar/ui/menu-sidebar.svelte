<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$shared/lib/shadcn.js';
	import { Grid2x2Check } from '@lucide/svelte';
	import { data } from '../model';

	const currentYear = new Date().getFullYear();
</script>

<aside class="sticky top-24 h-screen bg-background hidden lg:block shrink-0">
	<div class="max-h-[calc(100vh-10rem)] overflow-y-auto px-4">
		<nav class="space-y-6">
			{#each data.navMain as group (group.title)}
				<div class="space-y-3">
					<h4 class="px-2 text-sm font-semibold text-foreground">{group.title}</h4>
					<ul class="space-y-1">
						{#each group.items as item (item.title)}
							<li>
								<a
									href={item.url}
									class={cn(
										'block rounded-md px-2 py-1.5 text-sm transition-colors hover:text-primary hover:bg-primary/20',
										page.url.pathname === item.url
											? 'font-medium text-primary bg-primary/20'
											: 'text-muted-foreground'
									)}
								>
									{item.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</div>
</aside>
