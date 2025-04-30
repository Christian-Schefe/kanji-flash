<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import PageBody from '$lib/components/PageBody.svelte';
  import FlashSettings from '$lib/game/FlashSettingsForm.svelte';
  import { stateData } from '$lib/settings.svelte';
  import { Button, Card, Modal } from 'flowbite-svelte';

  type GameModeItem = {
    id: 'flash';
    name: string;
    description: string;
  };

  const gameModes: GameModeItem[] = [
    {
      id: 'flash',
      name: 'Flash',
      description: 'Flash Cards showing either the kanji or the meanings.'
    }
  ];

  const openGameModes = $state({
    flash: false
  });

  let applySettings = $state(() => {});
</script>

<PageBody title="Play">
  <div class="flex flex-col items-center gap-4">
    {#each gameModes as mode}
      <button onclick={() => (openGameModes[mode.id] = true)}>
        <Card class="text-left hover:bg-gray-100 dark:hover:bg-gray-700">
          <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">{mode.name}</h2>
            <p>{mode.description}</p>
          </div>
        </Card>
      </button>
      <Modal bind:open={openGameModes[mode.id]} outsideclose>
        <div class="flex flex-col items-center justify-center gap-4">
          <h1 class="text-2xl font-bold mb-4">{mode.name}</h1>
          {#if mode.id === 'flash'}
            <FlashSettings bind:applySettings />
          {/if}
          <Button
            onclick={() => {
              stateData.state.gameMode = mode.id;
              applySettings();
              goto(`${base}/play/game`);
            }}
            >Play
          </Button>
        </div>
      </Modal>
    {/each}
  </div>
</PageBody>
