<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { Pagination } from 'flowbite-svelte';
  import type { PageProps } from './$types';
  import Filter from './Filter.svelte';
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { localStore } from '$lib/localStorage.svelte';
  import { allKanjiCollection, collectionMap } from '$lib/collection.svelte';
  import * as wanakana from 'wanakana';

  const { data }: PageProps = $props();
  const { kanjis } = data;

  let divWidth = $state(-1);
  let pageIndex = $derived((Number(page.url.searchParams.get('page')) ?? 1) - 1);

  const elementSize = 50;
  const elementMargin = 8;

  const columns = $derived(Math.floor(divWidth / elementSize));
  const gridWidth = $derived(columns * elementSize);

  const searchTerm = localStore('searchTerm', '', 'read');
  const sortBy = localStore('sortBy', 'literal', 'sync');
  const reverse = localStore('reverse', false, 'sync');
  const gradeFilter = localStore('gradeFilter', 'jinmeiyou', 'sync');
  const excludeLowerGrade = localStore('excludeLowerGrade', false, 'sync');
  const collection = localStore('collection', allKanjiCollection.id, 'sync');
  const elementsPerPage = localStore('elementsPerPage', 100, 'sync');
  const searchMeaning = localStore('searchMeaning', true, 'sync');
  const searchKun = localStore('searchKun', true, 'sync');
  const searchOn = localStore('searchOn', true, 'sync');

  const gradeMap = new Map<string, (i: number | null) => boolean>([
    ['kyouiku', (i) => i != null && i >= 1 && i <= 4],
    ['jouyou', (i) => i != null && i >= 1 && i <= 8],
    ['jinmeiyou', (i) => i != null && i >= 1 && 1 <= 10],
    ['all', () => true]
  ]);

  const exclusiveGradeMap = new Map<string, (i: number | null) => boolean>([
    ['kyouiku', (i) => i != null && i >= 1 && i <= 4],
    ['jouyou', (i) => i != null && i >= 5 && i <= 8],
    ['jinmeiyou', (i) => i != null && i >= 9 && i <= 10],
    ['all', (i) => i == null || i < 1 || i > 10]
  ]);

  const gradeFilterFunc = $derived(
    (excludeLowerGrade.value ? exclusiveGradeMap : gradeMap).get(gradeFilter.value) || (() => true)
  );

  const sortedKanjis = $derived(
    kanjis.toSorted((x, y) => {
      const a = reverse.value ? y : x;
      const b = reverse.value ? x : y;
      const inf = Number.POSITIVE_INFINITY;
      const tiebreaker = a.literal.localeCompare(b.literal);
      switch (sortBy.value) {
        case 'literal':
          return tiebreaker;
        case 'frequency':
          return (a.frequency ?? inf) - (b.frequency ?? inf) || tiebreaker;
        case 'grade':
          return (a.grade ?? inf) - (b.grade ?? inf) || tiebreaker;
        case 'jlpt':
          return (b.jlpt ?? 0) - (a.jlpt ?? 0) || tiebreaker;
        case 'strokes':
          return (a.strokes ?? 0) - (b.strokes ?? 0) || tiebreaker;
        default:
          return tiebreaker;
      }
    })
  );

  const collectionFilter = $derived(collectionMap.get(collection.value)?.contains || (() => true));

  const filteredKanjis = $derived.by(() => {
    const search = searchTerm.value.toLowerCase();
    const hiraganaSearch = wanakana.toHiragana(search);
    return sortedKanjis.filter((kanji) => {
      return (
        collectionFilter(kanji) &&
        (kanji.literal.toLowerCase().includes(search) ||
          (searchMeaning.value &&
            kanji.meanings.some((meaning) => meaning.toLowerCase().includes(search))) ||
          (searchOn.value &&
            kanji.onReadings.some((reading) =>
              wanakana.toHiragana(reading).includes(hiraganaSearch)
            )) ||
          (searchKun.value &&
            kanji.kunReadings.some((reading) =>
              reading.replace('.', '').includes(hiraganaSearch)
            ))) &&
        gradeFilterFunc(kanji.grade)
      );
    });
  });

  const pageKanjis = $derived(
    filteredKanjis.slice(elementsPerPage.value * pageIndex, elementsPerPage.value * (pageIndex + 1))
  );

  const pageCount = $derived(Math.ceil(filteredKanjis.length / elementsPerPage.value));
  const pageIndices = $derived.by(() => {
    const arr = [pageIndex - 2, pageIndex - 1, pageIndex, pageIndex + 1, pageIndex + 2];
    const offset =
      arr[0] < 0
        ? -arr[0]
        : arr[arr.length - 1] >= pageCount
          ? -(arr[arr.length - 1] - pageCount + 1)
          : 0;
    return arr.map((index) => index + offset).filter((index) => index >= 0 && index < pageCount);
  });
  const pages = $derived(
    pageIndices.map((index) => ({
      name: (index + 1).toString(),
      active: index === pageIndex,
      href: `${base}/reference?page=${index + 1}`
    }))
  );

  $effect(() => {
    const newPageIndex = Math.min(Math.max(pageIndex, 0), pageCount - 1);
    if (newPageIndex !== pageIndex) {
      pageIndex = newPageIndex;
    }
  });

  const setPage = (i: number) => {
    pageIndex = Math.min(Math.max(i, 0), pageCount - 1);
    goto(`${base}/reference?page=${pageIndex + 1}`);
  };
</script>

<PageBody title="Reference">
  <Filter
    bind:searchTerm={searchTerm.value}
    bind:sortBy={sortBy.value}
    bind:reverse={reverse.value}
    bind:gradeFilter={gradeFilter.value}
    bind:excludeLowerGrade={excludeLowerGrade.value}
    bind:elementsPerPage={elementsPerPage.value}
    bind:collection={collection.value}
    bind:searchMeaning={searchMeaning.value}
    bind:searchKun={searchKun.value}
    bind:searchOn={searchOn.value}
    submitSearch={() => {
      searchTerm.syncURL();
    }}
    reset={() => {
      searchTerm.reset();
      sortBy.reset();
      reverse.reset();
      gradeFilter.reset();
      excludeLowerGrade.reset();
      collection.reset();
      elementsPerPage.reset();
      searchMeaning.reset();
      searchKun.reset();
      searchOn.reset();
    }}
  />
  <div class="flex justify-center mt-4 items-center gap-4">
    <Pagination
      {pages}
      on:previous={() => setPage(pageIndex - 1)}
      on:next={() => setPage(pageIndex + 1)}
    />
  </div>
  <p class="text-center text-gray-500 text-sm my-2">{filteredKanjis.length} Results</p>
  <div class="w-full flex justify-center" bind:clientWidth={divWidth}>
    {#if divWidth === -1}
      <p>Loading...</p>
    {:else}
      <div
        class="grid"
        style="grid-template-columns: repeat({columns}, 1fr); width: {gridWidth}px;"
      >
        {#each pageKanjis as kanji}
          <a
            href="{base}/reference/{kanji.literal}"
            style="width: {elementSize - elementMargin}px; height: {elementSize -
              elementMargin}px; margin: {elementMargin / 2}px;
              font-size: {elementSize / 1.5 - 10}px;
              font-family: 'Noto Serif JP', sans-serif;"
            class="p-1 outline outline-gray-300 dark:outline-gray-700 rounded-lg text-center hover:outline-blue-400 active:bg-blue-100"
          >
            {kanji.literal}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</PageBody>
