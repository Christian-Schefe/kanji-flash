<script lang="ts">
  import { base } from '$app/paths';
  import PageBody from '$lib/components/PageBody.svelte';
  import { resetSettings, settings } from '$lib/settings.svelte';
  import { clearSVGData, hasSVGData, storeSVGData, type SVGData } from '$lib/svgStorage';
  import { Button, Card, Hr, Label, Modal, Select, Spinner, Toggle } from 'flowbite-svelte';
  import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';

  const fonts = [
    { value: 'noto-sans-jp', name: 'Noto Sans JP' },
    { value: 'noto-serif-jp', name: 'Noto Serif JP' }
  ];

  let hasData = $state(false);
  let isInitialLoading = $state(true);

  let isDownloading: 'no' | 'downloading' | 'storing' = $state('no');
  let isDeleting = $state(false);

  const modals = $state({
    deleteConfirm: false,
    downloading: false,
    deleting: false
  });

  const disableButton = $derived(
    hasData || isDeleting || isDownloading !== 'no' || isInitialLoading
  );

  const checkSVGData = async () => {
    hasData = await hasSVGData();
    isInitialLoading = false;
  };

  const downloadSVGs = async () => {
    modals.downloading = true;
    isDownloading = 'downloading';
    const url = `${base}/kanji_svg.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON from ${url}: ${response.statusText}`);
    }
    const jsonData: SVGData = await response.json();
    isDownloading = 'storing';
    await storeSVGData(jsonData);
    await checkSVGData();
    isDownloading = 'no';
    modals.downloading = false;
  };

  const onDeleteData = async () => {
    modals.deleting = true;
    isDeleting = true;
    resetSettings();
    await clearSVGData();
    await checkSVGData();
    isDeleting = false;
    modals.deleting = false;
  };

  onMount(() => {
    checkSVGData();
  });
</script>

<PageBody title="Settings" backHref="{base}/">
  <div class="flex flex-col items-center gap-4">
    <Hr classHr="w-[50%]" classDiv="sm:col-span-2">Visual</Hr>
    <Card class="flex flex-col gap-4">
      <Label>Font for Japanese characters</Label>
      <Select items={fonts} bind:value={settings.settings.font}></Select>
      <div class="flex gap-2 items-center">
        <Toggle bind:checked={settings.settings.showStrokeOrder} />
        <Label>Show Stroke Order SVGs</Label>
      </div>
    </Card>
    <Hr classHr="w-[50%]" classDiv="sm:col-span-2">Data</Hr>
    <Button class="min-w-40" onclick={downloadSVGs} disabled={disableButton}>Download SVGs</Button>
    <Modal bind:open={modals.downloading} size="xs" dismissable={false}>
      <div class="text-center">
        <Spinner class="mx-auto mb-4" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          {#if isDownloading === 'downloading'}Downloading SVGs...{:else if isDownloading === 'storing'}Storing
            SVGs...{/if}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">This may take a while.</p>
      </div>
    </Modal>
    <Hr classHr="w-[50%]" classDiv="sm:col-span-2">Danger Zone</Hr>
    <Button class="min-w-40" onclick={() => (modals.deleteConfirm = true)}>Delete All Data</Button>
    <Modal bind:open={modals.deleteConfirm} size="xs" autoclose>
      <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          Are you sure you want to delete all data?
        </h3>
        <Button color="red" class="me-2" onclick={onDeleteData}>Confirm</Button>
        <Button color="alternative">Cancel</Button>
      </div>
    </Modal>
    <Modal bind:open={modals.deleting} size="xs" dismissable={false}>
      <div class="text-center">
        <Spinner class="mx-auto mb-4" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Deleting data...</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">This may take a while.</p>
      </div>
    </Modal>
  </div>
</PageBody>
