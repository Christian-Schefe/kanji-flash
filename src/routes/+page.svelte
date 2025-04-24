<script lang="ts">
	import PageBody from '$lib/components/PageBody.svelte';

	type GameMode = {
		name: string;
		description: string;
	};

	const gameModes: GameMode[] = [
		{
			name: 'Flash',
			description: ''
		},
		{
			name: 'Writing',
			description: ''
		}
	];
</script>

<PageBody title="Play">
	<div class="flex flex-col gap-4">
		{#each gameModes as mode}
			<div class="flex flex-col gap-2">
				<h2 class="text-2xl font-bold">{mode.name}</h2>
				<p>{mode.description}</p>
			</div>
		{/each}
	</div>
</PageBody>
