<script lang="ts">
  import { collections } from '$lib/collection.svelte';
  import {
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    Label,
    Radio,
    Search,
    Select,
    Toggle
  } from 'flowbite-svelte';
  import { FilterOutline } from 'flowbite-svelte-icons';

  type Props = {
    searchTerm: string;
    gradeFilter: string;
    excludeLowerGrade: boolean;
    sortBy: string;
    reverse: boolean;
    elementsPerPage: number;
    collection: string;
    searchMeaning: boolean;
    searchKun: boolean;
    searchOn: boolean;
    submitSearch: () => void;
    reset: () => void;
  };

  // biome-ignore lint/style/useConst: bindable needs to use let
  let {
    searchTerm = $bindable(),
    gradeFilter = $bindable(),
    excludeLowerGrade = $bindable(),
    sortBy = $bindable(),
    reverse = $bindable(),
    elementsPerPage = $bindable(),
    collection = $bindable(),
    searchMeaning = $bindable(),
    searchKun = $bindable(),
    searchOn = $bindable(),
    submitSearch,
    reset
  }: Props = $props();
  const grades = [
    { value: 'kyouiku', name: 'Kyouiku' },
    { value: 'jouyou', name: 'Jouyou' },
    { value: 'jinmeiyou', name: 'Jinmeiyou' },
    { value: 'all', name: 'All' }
  ];

  const ordering = [
    { value: 'literal', name: 'Literal' },
    { value: 'frequency', name: 'Frequency' },
    { value: 'grade', name: 'Grade' },
    { value: 'jlpt', name: 'JLPT' },
    { value: 'strokes', name: 'Strokes' }
  ];

  const pagingOptions = [50, 100, 200, 500, 1000].map((i) => ({
    name: i.toString(),
    value: i
  }));

  const collectionOptions = collections.map((collection) => ({
    name: collection.name,
    value: collection.id
  }));
</script>

<div class="flex gap-2 flex-row mt-4">
  <Button><FilterOutline /></Button>
  <Dropdown class="min-w-96">
    <DropdownItem
      ><Label>Search In</Label>
      <Checkbox bind:checked={searchMeaning}>{'Meaning'}</Checkbox>
      <Checkbox bind:checked={searchOn}>{'Onyomi'}</Checkbox>
      <Checkbox bind:checked={searchKun}>{'Kunyomi'}</Checkbox>
    </DropdownItem>

    <DropdownItem
      ><Label>Filter By Grade</Label>
      {#each grades as grade}
        <Radio value={grade.value} bind:group={gradeFilter}>{grade.name}</Radio>
      {/each}
      <div class="flex mt-2 items-center">
        <Toggle bind:checked={excludeLowerGrade} />
        <Label>Exclude Lower Grade</Label>
      </div>
    </DropdownItem>

    <DropdownItem>
      <Label>Sort By</Label>
      <Select items={ordering} bind:value={sortBy} />
      <div class="flex mt-2 items-center">
        <Toggle bind:checked={reverse} />
        <Label>Reverse</Label>
      </div>
    </DropdownItem>

    <DropdownItem>
      <Label>Collection</Label>
      <Select items={collectionOptions} bind:value={collection} />
    </DropdownItem>

    <DropdownItem>
      <Label>Pagination</Label>
      <Select items={pagingOptions} bind:value={elementsPerPage} />
    </DropdownItem>
    <DropdownItem>
      <div class="flex flex-col items-center">
        <Button onclick={reset}>Reset</Button>
      </div>
    </DropdownItem>
  </Dropdown>
  <div class="grow">
    <Search
      bind:value={searchTerm}
      onfocusout={submitSearch}
      on:keydown={(event) => {
        if (event.key === 'Enter') submitSearch();
      }}
    />
  </div>
</div>
