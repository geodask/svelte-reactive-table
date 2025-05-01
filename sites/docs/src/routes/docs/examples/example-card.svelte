<script lang="ts">
	import { Button } from '$shared/ui/shadcn/button';
	import * as Card from '$shared/ui/shadcn/card';
	import { ArrowRight, Icon } from '@lucide/svelte';

	type ExampleCardProps = {
		example: {
			title: string;
			description: string;
			icon: typeof Icon;
			features: string[];
			href: string;
		};
	};

	const { example }: ExampleCardProps = $props();

	const ExampleIcon = $derived(example.icon);
</script>

<Card.Root class="flex flex-col">
	<Card.Header>
		<div class="flex items-center gap-2">
			<ExampleIcon class="size-5 shrink-0 text-primary" />
			<Card.Title>{example.title}</Card.Title>
		</div>
	</Card.Header>
	<Card.Content class="flex-1 text-sm text-muted-foreground">
		<p>
			{example.description}
		</p>
	</Card.Content>
	<Card.Footer>
		<Button variant="ghost" href={example.href}>
			View Example
			<ArrowRight class="size-4" />
		</Button>
	</Card.Footer>
</Card.Root>
