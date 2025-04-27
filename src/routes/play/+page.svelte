<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { getGameModeSettingsStore, type GameMode } from '$lib/gameMode.svelte';
  import Flash from '../../lib/game/Flash.svelte';
  const { data } = $props();

  const gameModeSettingsStore = getGameModeSettingsStore();
</script>

<PageBody title="">
  {#if gameModeSettingsStore.value !== null}
    {#if gameModeSettingsStore.value.mode === 'flash'}
      <Flash kanjis={data.kanjis} settings={gameModeSettingsStore.value.settings['flash']} />
    {:else if gameModeSettingsStore.value.mode === 'spacedRepetition'}
      <h1 class="text-2xl font-bold mb-4">Spaced Repetition</h1>
      <p>Spaced Repetition mode is not yet implemented.</p>
    {:else if gameModeSettingsStore.value.mode === 'none'}
      <h1 class="text-2xl font-bold mb-4">No running game.</h1>
    {/if}
  {/if}
</PageBody>
