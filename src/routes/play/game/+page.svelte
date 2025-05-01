<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import TimeAttack from '$lib/game/time-attack/TimeAttack.svelte';
  import { stateData } from '$lib/settings.svelte';
  import Flash from '../../../lib/game/flash/Flash.svelte';

  const { data } = $props();
</script>

<PageBody title="">
  {#if stateData.state.gameMode === 'flash'}
    <Flash kanjis={data.kanjis} />
  {:else if stateData.state.gameMode === 'timeAttack'}
    <TimeAttack kanjis={data.kanjis} />
  {:else if stateData.state.gameMode === 'none'}
    <h1 class="text-xl text-center mb-4">No running game.</h1>
  {/if}
</PageBody>
