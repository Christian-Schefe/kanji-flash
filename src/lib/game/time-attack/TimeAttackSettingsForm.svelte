<script lang="ts">
  import { collections } from '$lib/collection.svelte';
  import { settings, stateData } from '$lib/settings.svelte';
  import { Label, Select, Toggle } from 'flowbite-svelte';
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
  let backspaceClear = $state(gameSettings.backspaceClear);
  let autoHiragana = $state(gameSettings.onyomi.autoHiragana);
  let showMeaning = $state(gameSettings.onyomi.showMeaning);
  let showKanji = $state(!gameSettings.onyomi.showMeaning || gameSettings.onyomi.showKanji);
  let time = $state(gameSettings.time);

  const onOnyomiSettingsChange = (changedKanji: boolean) => {
    if (!showKanji && !showMeaning) {
      if (changedKanji) {
        showMeaning = true;
      } else {
        showKanji = true;
      }
    }
  };

  applySettings = () => {
    onOnyomiSettingsChange(false);

    gameSettings.collection = collection;
    gameSettings.mode = mode;
    gameSettings.time = time;
    gameSettings.backspaceClear = backspaceClear;
    gameSettings.onyomi.autoHiragana = autoHiragana;
    gameSettings.onyomi.showMeaning = showMeaning;
    gameSettings.onyomi.showKanji = showKanji;

    stateData.state.gameModeState.timeAttack = defaultTimeAttackState();
  };
</script>

<div class="flex flex-col gap-4 p-4 w-full max-w-96">
  <Label>Collection</Label>
  <Select bind:value={collection} items={collectionItems} />
  <Label>Mode</Label>
  <Select bind:value={mode} items={modeItems} />
  <Label>Time</Label>
  <Select bind:value={time} items={timeItems} />
  <div class="flex items-center gap-2">
    <Toggle bind:checked={backspaceClear} />
    <Label>Backspace Clear</Label>
  </div>
  {#if mode === 'onyomi'}
    <Label>Onyomi Mode Settings</Label>
    <div class="flex items-center gap-2">
      <Toggle bind:checked={autoHiragana} />
      <Label>Auto Hiragana</Label>
    </div>
    <div class="flex items-center gap-2">
      <Toggle bind:checked={showMeaning} onchange={() => onOnyomiSettingsChange(false)} />
      <Label>Show Meaning</Label>
    </div>
    <div class="flex items-center gap-2">
      <Toggle bind:checked={showKanji} onchange={() => onOnyomiSettingsChange(true)} />
      <Label>Show Kanji</Label>
    </div>
  {/if}
</div>
