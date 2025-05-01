<script lang="ts">
  import { collections } from '$lib/collection.svelte';
  import { settings, stateData } from '$lib/settings.svelte';
  import { Label, Select } from 'flowbite-svelte';
  import { defaultTimeAttackState, type TimeAttackSettings } from './TimeAttackSettings';

  type Props = {
    applySettings: () => void;
  };

  let { applySettings = $bindable() }: Props = $props();

  const gameSettings = settings.settings.gameModeSettings.timeAttack;

  const collectionItems = collections.map((collection) => ({
    value: collection.id,
    name: collection.name
  }));

  const modeItems: { value: TimeAttackSettings['mode']; name: string }[] = [
    { value: 'meaning', name: 'Meaning' },
    { value: 'onyomi', name: 'Onyomi' }
  ];

  const timeItems: { value: number; name: string }[] = [
    10,
    60,
    3 * 60,
    5 * 60,
    10 * 60,
    15 * 60,
    30 * 60
  ].map((t) => ({
    value: t,
    name:
      t / 60 == Math.round(t / 60) ? `${t / 60} minute` + (t / 60 > 1 ? 's' : '') : `${t} seconds`
  }));

  let collection = $state(gameSettings.collection);
  let mode: TimeAttackSettings['mode'] = $state(gameSettings.mode);
  let time = $state(gameSettings.time);

  applySettings = () => {
    gameSettings.collection = collection;
    gameSettings.mode = mode;
    gameSettings.time = time;

    stateData.state.gameModeState.timeAttack = defaultTimeAttackState;
  };
</script>

<div class="flex flex-col gap-4 p-4 w-full max-w-96">
  <Label>Collection</Label>
  <Select bind:value={collection} items={collectionItems} />
  <Label>Mode</Label>
  <Select bind:value={mode} items={modeItems} />
  <Label>Time</Label>
  <Select bind:value={time} items={timeItems} />
</div>
