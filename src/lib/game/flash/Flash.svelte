<script lang="ts">
  import { allKanjiCollection, collectionMap } from '$lib/collection.svelte';
  import { Button, ButtonGroup } from 'flowbite-svelte';
  import type { Kanji } from '../../../kanji-data/types';
  import { settings, stateData } from '$lib/settings.svelte';
  import KanjiMeanings from '$lib/components/KanjiMeanings.svelte';

  type Props = {
    kanjis: Kanji[];
  };

  const { kanjis }: Props = $props();

  const gameSettings = $derived(settings.settings.gameModeSettings.flash);
  const gameState = $derived(stateData.state.gameModeState.flash.game);
  const persistentGameState = $derived(stateData.state.gameModeState.flash.persistent);
  const collection = $derived(collectionMap.get(gameSettings.collection) ?? allKanjiCollection);

  const filteredKanjis = $derived.by(() => {
    const collectionKanji = kanjis.filter((kanji) => collection.contains(kanjis, kanji));
    return gameSettings.review
      ? collectionKanji.filter((kanji) => persistentGameState.badKanjis[kanji.l] !== undefined)
      : collectionKanji;
  });

  const currentKanji: Kanji | undefined = $derived(filteredKanjis[gameState.currentIndex]);

  const onReveal = () => {
    gameState.currentFace = 'info';
  };

  const onNext = (isBad: boolean) => {
    if (isBad && currentKanji) {
      if (persistentGameState.badKanjis[currentKanji.l] !== undefined) {
        persistentGameState.badKanjis[currentKanji.l] -= 1;
      } else {
        persistentGameState.badKanjis[currentKanji.l] = -2;
      }
    } else if (currentKanji) {
      if (persistentGameState.badKanjis[currentKanji.l] !== undefined) {
        persistentGameState.badKanjis[currentKanji.l] += 1;
        if (persistentGameState.badKanjis[currentKanji.l] >= 0) {
          delete persistentGameState.badKanjis[currentKanji.l];
        }
      }
    }

    gameState.currentIndex = Math.floor(Math.random() * filteredKanjis.length);
    gameState.currentFace =
      gameSettings.mode === 'kanjiAndMeaning'
        ? Math.random() < 0.5
          ? 'kanji'
          : 'meaning'
        : gameSettings.mode;
  };

  $effect(() => {
    if (gameState.currentIndex === -1 || !currentKanji) {
      onNext(false);
    } else if (
      (gameState.currentFace === 'kanji' && gameSettings.mode === 'meaning') ||
      (gameState.currentFace === 'meaning' && gameSettings.mode === 'kanji')
    ) {
      gameState.currentFace = gameSettings.mode;
    }
  });

  const fontClass = $derived(settings.settings.font);
</script>

<div class="flex flex-col items-center gap-4">
  {#if filteredKanjis.length === 0}
    <p class="text-2xl text-center">No kanjis to play.</p>
  {:else if currentKanji === undefined}
    <p class="text-2xl text-center">Invalid kanji.</p>
  {/if}
  {#if currentKanji !== undefined}
    {#if gameState.currentFace === 'kanji'}
      <p class="text-8xl {fontClass}">
        {currentKanji.l}
      </p>
      <div class="absolute bottom-5 w-full flex justify-center max-w-6xl px-5">
        <Button onclick={onReveal} class="grow">Reveal</Button>
      </div>
    {:else if gameState.currentFace === 'meaning'}
      <KanjiMeanings kanji={currentKanji} />
      <div class="grow"></div>
      <div class="absolute bottom-5 w-full flex justify-center max-w-6xl px-5">
        <Button onclick={onReveal} class="grow">Reveal</Button>
      </div>
    {:else if gameState.currentFace === 'info'}
      <p class="text-8xl {fontClass}">
        {currentKanji.l}
      </p>
      <div class="grow"></div>
      <p class="text-xl text-center">
        <KanjiMeanings kanji={currentKanji} />
      </p>
      <div class="grid" style="grid-template-columns: min-content 1fr;">
        <p class="text-xl mr-2">On:</p>
        <p class="text-xl {fontClass}">{currentKanji.o.join(', ')}</p>
        <p class="text-xl mr-2">Kun:</p>
        <p class="text-xl {fontClass}">{currentKanji.k.join(', ')}</p>
      </div>
      <div class="absolute bottom-5 w-full flex justify-center max-w-6xl px-5">
        <ButtonGroup class="grow">
          <Button size="md" color="red" onclick={() => onNext(true)} class="grow">Bad</Button>
          <Button size="md" color="green" onclick={() => onNext(false)} class="grow">Good</Button>
        </ButtonGroup>
      </div>
    {/if}
  {/if}
</div>
