<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="w-full">
	<div
		class="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
	>
		<div class="flex flex-col gap-1 md:gap-2 text-center md:text-left">
			<div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<p>
					&copy; {currentYear} George Daskalakis. All rights reserved.
				</p>
			</div>

			<div class="flex flex-col md:flex-row gap-1 md:gap-4 text-xs text-muted-foreground/80">
				<p>
					Docs powered by <a
						href="https://next.shadcn-svelte.com"
						class="hover:text-foreground underline underline-offset-2 transition-colors"
						target="_blank"
						rel="noopener noreferrer">shadcn-svelte</a
					>. Theme based on
					<a
						href="https://tweakcn.com/"
						class="hover:text-foreground underline underline-offset-2 transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						Tangerine by tweakcn
					</a>.
				</p>
			</div>
		</div>
	</div>
</footer>
