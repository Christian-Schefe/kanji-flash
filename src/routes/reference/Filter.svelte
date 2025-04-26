<script lang="ts">
  import { collections } from '$lib/collection.svelte';
  import {
    Button,
    Dropdown,
    DropdownItem,
    Label,
    Radio,
    Search,
    Select,
    Toggle
  } from 'flowbite-svelte';

  type Props = {
    searchTerm: string;
    gradeFilter: string;
    sortBy: string;
    reverse: boolean;
    elementsPerPage: number;
    collection: string;
    submitSearch: () => void;
  };

  let {
    searchTerm = $bindable(),
    gradeFilter = $bindable(),
    sortBy = $bindable(),
    reverse = $bindable(),
    elementsPerPage = $bindable(),
    collection = $bindable(),
    submitSearch
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

<div class="flex gap-2 flex-row">
  <Button>Filter</Button>
  <Dropdown class="min-w-96">
    <DropdownItem
      ><Label>Filter By Grade</Label>
      {#each grades as grade}
        <Radio value={grade.value} bind:group={gradeFilter}>{grade.name}</Radio>
      {/each}
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
