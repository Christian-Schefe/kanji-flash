<script lang="ts">
  import { allKanjiCollection, collectionMap } from '$lib/collection.svelte';
  import { Button, ButtonGroup } from 'flowbite-svelte';
  import type { Kanji } from '../../kanji-data/types';
  import type { FlashSettings } from './FlashSettings';
  import { localStore } from '$lib/localStorage.svelte';
  import { settings, state } from '$lib/settings.svelte';

  type Props = {
    kanjis: Kanji[];
    gameSettings: FlashSettings;
  };

  const { kanjis, gameSettings }: Props = $props();

  const collection = $derived(collectionMap.get(gameSettings.collection) ?? allKanjiCollection);

  const filteredKanjis = $derived.by(() => {
    const collectionKanji = kanjis.filter((kanji) => collection.contains(kanji));
    return gameSettings.review
      ? collectionKanji.filter((kanji) => state.state.badKanjis[kanji.literal] !== undefined)
      : collectionKanji;
  });

  const currentIndex = localStore('flash-currentIndex', -1);
  const currentFace = localStore('flash-currentFace', 'kanji');
  const currentKanji: Kanji | undefined = $derived(filteredKanjis[currentIndex.value]);

  const onReveal = () => {
    currentFace.value = 'info';
  };

  const onNext = (isBad: boolean) => {
    if (isBad && currentKanji) {
      if (state.state.badKanjis[currentKanji.literal] !== undefined) {
        state.state.badKanjis[currentKanji.literal] -= 1;
      } else {
        state.state.badKanjis[currentKanji.literal] = -2;
      }
    } else if (currentKanji) {
      if (state.state.badKanjis[currentKanji.literal] !== undefined) {
        state.state.badKanjis[currentKanji.literal] += 1;
        if (state.state.badKanjis[currentKanji.literal] >= 0) {
          delete state.state.badKanjis[currentKanji.literal];
        }
      }
    }

    currentIndex.value = Math.floor(Math.random() * filteredKanjis.length);
    currentFace.value = Math.random() < 0.5 ? 'kanji' : 'meanings';
  };

  $effect(() => {
    if (currentIndex.value === -1 || !currentKanji) {
      onNext(false);
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
  {#if filteredKanjis.length === 0}
    <p class="text-2xl text-center">No kanjis to play.</p>
  {:else if currentKanji === undefined}
    <p class="text-2xl text-center">Invalid kanji.</p>
  {/if}
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
        <ButtonGroup class="grow">
          <Button size="md" color="red" onclick={() => onNext(true)} class="grow">Bad</Button>
          <Button size="md" color="green" onclick={() => onNext(false)} class="grow">Good</Button>
        </ButtonGroup>
      </div>
    {/if}
  {/if}
</div>
