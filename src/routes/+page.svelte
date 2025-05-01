<script lang="ts">
  import { base } from '$app/paths';
  import PageBody from '$lib/components/PageBody.svelte';
  import { Card } from 'flowbite-svelte';

  const links = [
    {
      destination: 'play',
      name: 'Play',
      description: 'Play the game with different modes and settings.'
    },
    {
      destination: 'collections',
      name: 'Collections',
      description: 'Browse available kanji collections.'
    },
    {
      destination: 'reference',
      name: 'Reference',
      description: 'Look up kanji and their readings.'
    },
    {
      destination: 'settings',
      name: 'Settings',
      description: 'Configure your preferences and settings.'
    }
  ];
</script>

<PageBody title="Kanji Flash"
  ><div class="flex flex-col items-center gap-4">
    {#each links as link}
      <Card href="{base}/{link.destination}">
        <h1 class="font-bold text-xl mb-2">{link.name}</h1>
        <p>{link.description}</p>
      </Card>
    {/each}
  </div></PageBody
>
