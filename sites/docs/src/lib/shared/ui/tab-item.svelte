<script lang="ts">
	import * as Tabs from '$shared/ui/shadcn/tabs';

	type TabsItemProps = {
		value: string;
	};

	const { children, value }: WithChildren<TabsItemProps> = $props();
</script>

<Tabs.Content {value}>
	{@render children()}
</Tabs.Content>
