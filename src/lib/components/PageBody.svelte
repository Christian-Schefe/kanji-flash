<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		title: string;
		children: Snippet<[]>;
	};
	const { title, children }: Props = $props();
</script>

<div class="flex flex-col">
	<h1 class="mb-4 self-center text-2xl">{title}</h1>
	{@render children()}
</div>
