<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import PageBody from '$lib/components/PageBody.svelte';
  import { defaultFlashSettings } from '$lib/game/FlashSettings';
  import FlashSettings from '$lib/game/FlashSettingsForm.svelte';
  import {
    getGameModeSettingsStore,
    type GameModeState,
    type GameModeStateByMode
  } from '$lib/gameMode.svelte';
  import { LocalStore, localStore } from '$lib/localStorage.svelte';
  import { Button, Card, Modal } from 'flowbite-svelte';

  type GameModeItem = {
    id: 'flash' | 'spacedRepetition';
    name: string;
    description: string;
  };

  const gameModes: GameModeItem[] = [
    {
      id: 'flash',
      name: 'Flash',
      description: ''
    },
    {
      id: 'spacedRepetition',
      name: 'Spaced Repetition',
      description: ''
    }
  ];

  const openGameModes = $state({
    flash: false,
    spacedRepetition: false
  });

  const gameModeStore: LocalStore<GameModeState> = getGameModeSettingsStore();

  let applySettings = $state(() => {});
</script>

<PageBody title="Play">
  <div class="flex flex-col items-center gap-4">
    {#each gameModes as mode}
      <Card href="/" onclick={() => (openGameModes[mode.id] = true)}>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-bold">{mode.name}</h2>
          <p>{mode.description}</p>
        </div>
      </Card>
      <Modal bind:open={openGameModes[mode.id]} outsideclose>
        <div class="flex flex-col items-center justify-center gap-4">
          <h1 class="text-2xl font-bold mb-4">{mode.name}</h1>
          {#if mode.id === 'flash'}
            <FlashSettings bind:applySettings {gameModeStore} />
          {/if}
          <Button
            onclick={() => {
              gameModeStore.value.mode = mode.id;
              applySettings();
              goto(`${base}/play`);
            }}
            >Play
          </Button>
        </div>
      </Modal>
    {/each}
  </div>
</PageBody>
