<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { settings } from '$lib/settings.svelte';
  import { DarkMode, Label, Select } from 'flowbite-svelte';

  const fonts = [
    { value: 'noto-sans-jp', name: 'Noto Sans JP' },
    { value: 'noto-serif-jp', name: 'Noto Serif JP' }
  ];
</script>

<PageBody title="Settings">
  <div class="flex flex-col items-center gap-4">
    <DarkMode />
    <div>
      <Label>Font for Japanese characters</Label>
      <Select items={fonts} bind:value={settings.settings.font}></Select>
    </div>
  </div>
</PageBody>
