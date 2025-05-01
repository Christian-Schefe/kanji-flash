<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import PageBody from '$lib/components/PageBody.svelte';
  import FlashSettingsForm from '$lib/game/flash/FlashSettingsForm.svelte';
  import TimeAttackSettingsForm from '$lib/game/time-attack/TimeAttackSettingsForm.svelte';
  import { stateData } from '$lib/settings.svelte';
  import { Button, Card, Hr, Modal } from 'flowbite-svelte';

  type GameModeItem = {
    id: 'flash' | 'timeAttack';
    name: string;
    description: string;
  };

  const gameModeData: Record<GameModeItem['id'], GameModeItem> = {
    flash: {
      id: 'flash',
      name: 'Flash',
      description: 'Flash Cards showing either the kanji or the meanings.'
    },
    timeAttack: {
      id: 'timeAttack',
      name: 'Time Attack',
      description: 'A timed game where you have to answer as many questions as possible.'
    }
  };
  const gameModeIds: GameModeItem['id'][] = ['flash', 'timeAttack'];
  const gameModes = gameModeIds.map((id) => gameModeData[id]);

  const openGameModes: Record<GameModeItem['id'], boolean> = $state({
    flash: false,
    timeAttack: false
  });

  const applySettings: Record<GameModeItem['id'], () => void> = $state({
    flash: () => {},
    timeAttack: () => {}
  });
</script>

<PageBody title="Play">
  <div class="flex flex-col items-center gap-4">
    {#if stateData.state.gameMode !== 'none'}
      <Card href={`${base}/play/game`}>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-bold">Continue</h2>
          <p>Mode: {gameModeData[stateData.state.gameMode].name}</p>
        </div>
      </Card>
      <div class="w-full"><Hr /></div>
    {/if}
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
            <FlashSettingsForm bind:applySettings={applySettings.flash} />
          {:else if mode.id === 'timeAttack'}
            <TimeAttackSettingsForm bind:applySettings={applySettings.timeAttack} />
          {/if}
          <Button
            onclick={() => {
              stateData.state.gameMode = mode.id;
              applySettings[mode.id]();
              goto(`${base}/play/game`);
            }}
            >Play
          </Button>
        </div>
      </Modal>
    {/each}
  </div>
</PageBody>
