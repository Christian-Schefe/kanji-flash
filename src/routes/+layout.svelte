<script lang="ts">
  import '../app.css';
  import NavBar from '$lib/components/NavBar.svelte';

  const { children } = $props();
</script>

<div class="w-full max-w-6xl mx-auto flex flex-col bg-white">
  <NavBar
    title="Kanji Flash"
    pages={[
      { name: 'Play', href: '' },
      { name: 'Collections', href: 'collections' },
      { name: 'Reference', href: 'reference' },
      { name: 'Settings', href: 'settings' }
    ]}
  />
  {@render children()}
</div>
