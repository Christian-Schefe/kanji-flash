<script lang="ts">
  import { allKanjiCollection, collectionMap } from '$lib/collection.svelte';
  import { Button } from 'flowbite-svelte';
  import type { Kanji } from '../../kanji-data/types';
  import type { FlashSettings } from './FlashSettings';
  import { localStore } from '$lib/localStorage.svelte';
  import { settings } from '$lib/settings.svelte';

  type Props = {
    kanjis: Kanji[];
    gameSettings: FlashSettings;
  };

  const { kanjis, gameSettings }: Props = $props();

  const collection = $derived(collectionMap.get(gameSettings.collection) ?? allKanjiCollection);

  const filteredKanjis = $derived(kanjis.filter((kanji) => collection.contains(kanji)));

  const currentIndex = localStore('flash-currentIndex', -1);
  const currentFace = localStore('flash-currentFace', 'kanji');
  const currentKanji: Kanji | undefined = $derived(filteredKanjis[currentIndex.value]);

  const onReveal = () => {
    currentFace.value = 'info';
  };

  const onNext = () => {
    currentIndex.value = Math.floor(Math.random() * filteredKanjis.length);
    currentFace.value = Math.random() < 0.5 ? 'kanji' : 'meanings';
  };

  $effect(() => {
    if (currentIndex.value === -1 || !currentKanji) {
      onNext();
    }
  });

  const fontClass = $derived(settings.settings.font);
  const keyword = $derived(currentKanji?.rtk?.keyword);
  const meanings = $derived.by(() => {
    if (!currentKanji) return '';
    if (!keyword) return currentKanji.meanings.join(', ');
    const notRtkMeanings = currentKanji.meanings.filter((m) => m !== keyword);
    const str = notRtkMeanings.join(', ');
    return notRtkMeanings.length === 0 ? str : `, ${str}`;
  });
</script>

<div class="flex flex-col items-center gap-4">
  {#if currentKanji !== undefined}
    {#if currentFace.value === 'kanji'}
      <p class="text-8xl {fontClass}">
        {currentKanji.literal}
      </p>
      <div class="absolute bottom-5 left-5 right-5 flex justify-center">
        <Button onclick={onReveal} class="grow">Reveal</Button>
      </div>
    {:else if currentFace.value === 'meanings'}
      <p class="text-xl text-center">
        {#if keyword}<span class="underline">{keyword}</span>{/if}{meanings}
      </p>
      <div class="grow"></div>
      <div class="absolute bottom-5 left-5 right-5 flex justify-center">
        <Button onclick={onReveal} class="grow">Reveal</Button>
      </div>
    {:else if currentFace.value === 'info'}
      <p class="text-8xl {fontClass}">
        {currentKanji.literal}
      </p>
      <div class="grow"></div>
      <p class="text-xl text-center">
        {#if keyword}<span class="underline">{keyword}</span>{/if}{meanings}
      </p>
      <div class="grid" style="grid-template-columns: min-content 1fr;">
        <p class="text-xl mr-2">On:</p>
        <p class="text-xl {fontClass}">{currentKanji.onReadings.join(', ')}</p>
        <p class="text-xl mr-2">Kun:</p>
        <p class="text-xl {fontClass}">{currentKanji.kunReadings.join(', ')}</p>
      </div>
      <div class="absolute bottom-5 left-5 right-5 flex justify-center">
        <Button onclick={onNext} class="grow">Next</Button>
      </div>
    {/if}
  {/if}
</div>
