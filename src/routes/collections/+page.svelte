<script>
  import { base } from '$app/paths';
  import { gradeCollections, jlptCollections, otherCollections } from '$lib/collection.svelte';
  import PageBody from '$lib/components/PageBody.svelte';
  import { Card, Hr } from 'flowbite-svelte';

  const groups = [
    { name: 'JLPT', collections: jlptCollections },
    { name: 'Grade', collections: gradeCollections },
    { name: 'Other', collections: otherCollections }
  ];
</script>

<PageBody title="Collections">
  <div class="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 w-fit self-center">
    {#each groups as { name, collections }}
      <Hr classHr="w-[50%]" classDiv="sm:col-span-2">{name}</Hr>
      {#each collections as collection}
        <Card
          class="h-full"
          href="{base}/reference/?collection={collection.id}&searchTerm=&sortBy=default&reverse=false&gradeFilter=all&excludeLowerGrade=false&page=1"
        >
          <h1 class="font-bold text-xl mb-2">{collection.name}</h1>
          <p>{collection.description}</p>
        </Card>
      {/each}
    {/each}
  </div>
</PageBody>
