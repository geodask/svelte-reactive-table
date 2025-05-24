<script lang="ts">
	import { Button } from '$shared/ui/shadcn/button';
	import * as Card from '$shared/ui/shadcn/card';
	import { ArrowRight, Rocket } from '@lucide/svelte';

	const isFeatured = $state(true);
	const step = $state({
		title: 'Next Step',
		description: 'This is the next step in your journey.',
		href: '/next-step'
	});
</script>

<Card.Root
	class="group transition-all duration-200 hover:shadow-md {isFeatured
		? 'border-primary bg-primary/5'
		: ''}"
>
	<Card.Header class="p-4 pb-0">
		<div class="flex items-center gap-3">
			<div class="p-2 rounded-lg {isFeatured ? 'bg-primary text-primary-foreground' : 'bg-muted'}">
				<Rocket class="h-4 w-4" />
			</div>
			<Card.Title class="text-lg">{step.title}</Card.Title>
		</div>
	</Card.Header>
	<Card.Content class="p-4 pt-0">
		<Card.Description class="mb-4 text-sm leading-relaxed">{step.description}</Card.Description>
		<Button
			variant={isFeatured ? 'default' : 'outline'}
			size="sm"
			class="group-hover:translate-x-1 transition-transform duration-200"
			href={step.href}
		>
			Continue
			<ArrowRight class="ml-2 h-3 w-3" />
		</Button>
	</Card.Content>
</Card.Root>
