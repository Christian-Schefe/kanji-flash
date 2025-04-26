<script>
  import { base } from '$app/paths';
  import { collections } from '$lib/collection.svelte';
  import PageBody from '$lib/components/PageBody.svelte';
  import { Card } from 'flowbite-svelte';
</script>

<PageBody title="Collections">
  <div class="flex flex-col items-center gap-4">
    {#each collections as collection}
      <Card
        href="{base}/reference/?collection={collection.id}&searchTerm=&sortBy=literal&reverse=false&gradeFilter=all&page=1"
      >
        <h1 class="font-bold text-xl mb-2">{collection.name}</h1>
        <p>{collection.description}</p>
      </Card>
    {/each}
  </div>
</PageBody>
