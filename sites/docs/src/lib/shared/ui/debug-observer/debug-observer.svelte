<script lang="ts">
	type DebugObserverProps = {
		observer?: IntersectionObserver | null;
		active?: boolean;
	};

	const { active, observer }: DebugObserverProps = $props();

	const rootMargin = $derived(observer?.rootMargin);

	const margins = $derived.by(() => {
		const defaultMargins = { top: 0, right: 0, bottom: 0, left: 0 };
		if (!rootMargin) return defaultMargins;
		const [top, right, bottom, left] = rootMargin.split(' ').map((v) => -parseFloat(v));
		return { top, right, bottom, left };
	});
</script>

{#if active && observer}
	<div class="fixed inset-0 pointer-events-none z-9999">
		<div
			class="absolute left-0 right-0 bg-red-500/10"
			style="top: 0; height: {margins.top}px;"
		></div>
		<div
			class="absolute top-0 bottom-0 bg-red-500/10"
			style="right: 0; width: {margins.right}px;"
		></div>
		<div
			class="absolute left-0 right-0 bg-red-500/10"
			style="bottom: 0; height: {margins.bottom}px;"
		></div>
		<div
			class="absolute top-0 bottom-0 bg-red-500/10"
			style="left: 0; width: {margins.left}px;"
		></div>
		<div
			class="absolute border-2 border-dashed border-green-500/50 bg-green-500/10"
			style="
					top: {margins.top}px;
					right: {margins.right}px;
					bottom: {margins.bottom}px;
					left: {margins.left}px;
				"
		></div>
	</div>
{/if}
