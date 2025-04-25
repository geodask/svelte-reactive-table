<script lang="ts">
	import * as Sidebar from '$shared/ui/shadcn/sidebar';
	import { Header } from '$widgets/header';
	import { MenuSidebar } from '$widgets/menu-sidebar';

	const { children } = $props();
</script>

<Sidebar.Provider>
	<MenuSidebar />
	<Sidebar.Inset class="contain-inline-size sticky top-0">
		<Header />
		<div class="p-8">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
