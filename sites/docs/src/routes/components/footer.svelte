<script lang="ts">
	import { Button } from '$shared/ui/button';
	import Github from '$shared/ui/github.svelte';
	import { Grid2x2Check, Info, Tag } from '@lucide/svelte';

	const currentYear = new Date().getFullYear();
</script>

<footer class="w-full py-6 border-t bg-muted/40">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Project Info -->
			<div class="flex flex-col space-y-3">
				<div class="flex items-center gap-2">
					<Grid2x2Check class="text-primary" />
					<span class="text-base font-medium">Svelte Reactive Table</span>
				</div>
				<!-- <p class="text-sm text-muted-foreground">
					A headless, fully reactive table library for Svelte applications
				</p> -->
				<p class="text-sm text-muted-foreground">
					&copy; {currentYear} George Daskalakis
				</p>
			</div>

			<!-- Quick Links -->
			<div class="flex flex-col space-y-3">
				<h3 class="text-sm font-semibold">Resources</h3>
				<div class="grid grid-cols-1 gap-2">
					<a
						href="/docs"
						class="text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						Documentation
					</a>
					<a
						href="/examples"
						class="text-sm text-muted-foreground hover:text-primary transition-colors">Examples</a
					>
				</div>
			</div>

			<!-- Community Links -->
			<div class="flex flex-col space-y-3">
				<h3 class="text-sm font-semibold">Community</h3>
				<div class="grid grid-cols-1 gap-2">
					<a
						href="https://github.com/geodask/svelte-reactive-table"
						class="text-sm text-muted-foreground hover:text-primary [&>svg]:size-4 transition-colors flex items-center gap-1"
					>
						<Github />
						GitHub
					</a>
					<a
						href="https://github.com/geodask/svelte-reactive-table/releases"
						class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
					>
						<Tag class="size-4" />
						Releases
					</a>
					<!-- <a
						href="https://github.com/geodask/svelte-reactive-table/issues"
						class="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
					>
						<Info class="size-4" />
						Issues
					</a> -->
				</div>
			</div>
		</div>
	</div>
</footer>
