<script lang="ts">
  import '../app.css';
  import NavBar from '$lib/components/NavBar.svelte';
  import { mountSettings } from '$lib/settings.svelte';

  const { children } = $props();

  mountSettings();
</script>

<div class="w-full max-w-6xl mx-auto flex flex-col">
  <NavBar
    title="Kanji Flash"
    pages={[
      { name: 'Play', href: 'play' },
      { name: 'Collections', href: 'collections' },
      { name: 'Reference', href: 'reference' },
      { name: 'Settings', href: 'settings' }
    ]}
  />
  {@render children()}
</div>
