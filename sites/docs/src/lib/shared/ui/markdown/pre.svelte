<script lang="ts">
	import CodeBlock from '../code-block.svelte';

	const { title, lang, code }: { title?: string; lang: string; code: string } = $props();
</script>

<CodeBlock {title} {lang} {code} />
