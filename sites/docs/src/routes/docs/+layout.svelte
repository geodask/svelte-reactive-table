<script lang="ts">
	import * as Sidebar from '$shared/ui/shadcn/sidebar';
	import { Header } from '$widgets/header';
	import { MenuSidebar } from '$widgets/menu-sidebar';

	const { children } = $props();
</script>

<Sidebar.Provider>
	<MenuSidebar />
	<Sidebar.Inset class="overflow-hidden">
		<Header />
		<div class="p-8">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
