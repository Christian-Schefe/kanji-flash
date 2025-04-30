<script lang="ts">
  import { allKanjiCollection, collections } from '$lib/collection.svelte';
  import { settings, stateData } from '$lib/settings.svelte';
  import { Label, Select, Toggle } from 'flowbite-svelte';

  type Props = {
    applySettings: () => void;
  };

  let { applySettings = $bindable() }: Props = $props();

  const collectionItems = collections.map((collection) => ({
    value: collection.id,
    name: collection.name
  }));

  const modeItems = [
    { value: 'kanjiAndMeaning', name: 'Kanji and Meaning' },
    { value: 'kanji', name: 'Kanji' },
    { value: 'meaning', name: 'Meaning' }
  ];

  let collection = $state(
    settings.settings.gameModeSettings.flash.collection ?? allKanjiCollection.id
  );
  let mode = $state(settings.settings.gameModeSettings.flash.mode ?? 'kanjiAndMeaning');
  let isReview = $state(settings.settings.gameModeSettings.flash.review ?? false);

  applySettings = () => {
    settings.settings.gameModeSettings.flash.collection = collection;
    settings.settings.gameModeSettings.flash.mode = mode;
    settings.settings.gameModeSettings.flash.review = isReview;
  };
</script>

<div class="flex flex-col gap-4 p-4 w-full max-w-96">
  <Label>Collection</Label>
  <Select bind:value={collection} items={collectionItems} />
  <div class="flex gap-2">
    <Toggle bind:checked={isReview} /><Label>Review</Label>
  </div>
  <Label>Mode</Label>
  <Select bind:value={mode} items={modeItems} />
</div>
