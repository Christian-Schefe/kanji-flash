<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { Pagination } from 'flowbite-svelte';
  import type { PageProps } from './$types';
  import Filter from './Filter.svelte';
  import { base } from '$app/paths';
  import { beforeNavigate, goto } from '$app/navigation';
  import { localStore } from '$lib/localStorage.svelte';
  import { allKanjiCollection, collectionMap } from '$lib/collection.svelte';
  import * as wanakana from 'wanakana';
  import KanjiIcon from '$lib/components/KanjiIcon.svelte';

  const { data }: PageProps = $props();
  const { kanjis } = data;

  let divWidth = $state(-1);
  let pageIndexStore = localStore('page', 1, 'read');
  const pageIndex = $derived(pageIndexStore.value - 1);

  const elementSize = 52;
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

  const maybeRegex = $derived.by(() => {
    if (
      !(
        searchTerm.value.length > 1 &&
        searchTerm.value[0] === '/' &&
        searchTerm.value.slice(-1) === '/'
      )
    ) {
      return null;
    }
    try {
      return new RegExp(searchTerm.value.slice(1, -1));
    } catch (e) {
      return null;
    }
  });
  const isRegex = $derived(maybeRegex !== null);
  const search = $derived(isRegex ? (maybeRegex as RegExp) : searchTerm.value.toLowerCase());
  const kanaSearch = $derived(isRegex ? search : wanakana.toHiragana(search as string));

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
      const tiebreaker = a.l.localeCompare(b.l);
      switch (sortBy.value) {
        case 'literal':
          return tiebreaker;
        case 'frequency':
          return (a.f ?? inf) - (b.f ?? inf) || tiebreaker;
        case 'grade':
          return (a.g ?? inf) - (b.g ?? inf) || tiebreaker;
        case 'jlpt':
          return (b.j ?? 0) - (a.j ?? 0) || tiebreaker;
        case 'strokes':
          return (a.s ?? 0) - (b.s ?? 0) || tiebreaker;
        default:
          return tiebreaker;
      }
    })
  );

  const collectionFilter = $derived(collectionMap.get(collection.value)?.contains || (() => true));

  const stringFilter = $derived((str: string, searchKana: boolean) =>
    isRegex
      ? (search as RegExp).test(str.toLowerCase())
      : str.toLowerCase().includes((searchKana ? kanaSearch : search) as string)
  );

  const filteredKanjis = $derived.by(() => {
    return sortedKanjis.filter((kanji) => {
      return (
        collectionFilter(kanji) &&
        gradeFilterFunc(kanji.g) &&
        (searchTerm.value.length === 0 ||
          stringFilter(kanji.l, false) ||
          (searchMeaning.value &&
            (kanji.m.some((meaning) => stringFilter(meaning, false)) ||
              (kanji.r && stringFilter(kanji.r.k, false)))) ||
          (searchOn.value &&
            kanji.o.some((reading) => stringFilter(wanakana.toHiragana(reading), true))) ||
          (searchKun.value &&
            kanji.k.some((reading) => stringFilter(reading.replace('.', ''), true))))
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
      pageIndexStore.value = newPageIndex + 1;
    }
  });

  beforeNavigate((event) => {
    if (!event.to || event.to.url.pathname !== `${base}/reference`) {
      return;
    }
    const pageIndex = event.to?.url?.searchParams?.get('page');
    if (pageIndex) {
      const newPageIndex = Number.parseInt(pageIndex, 10);
      if (!Number.isNaN(newPageIndex)) {
        pageIndexStore.value = Math.min(Math.max(newPageIndex, 1), pageCount);
      }
    }
  });

  const setPage = (i: number) => {
    const newPageIndex = Math.min(Math.max(i, 0), pageCount - 1) + 1;
    goto(`${base}/reference?page=${newPageIndex}`);
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
          <KanjiIcon literal={kanji.l} size={elementSize} margin={elementMargin} />
        {/each}
      </div>
    {/if}
  </div>
</PageBody>
