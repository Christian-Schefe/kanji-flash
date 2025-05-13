<script lang="ts">
  import { base } from '$app/paths';
  import PageBody from '$lib/components/PageBody.svelte';
  import { resetSettings, settings } from '$lib/settings.svelte';
  import { clearSVGData, fetchAndStoreSVGs, hasSVGData } from '$lib/svgStorage';
  import { Button, Card, Hr, Label, Modal, Select, Spinner, Toggle } from 'flowbite-svelte';
  import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

  const fonts = [
    { value: 'noto-sans-jp', name: 'Noto Sans JP' },
    { value: 'noto-serif-jp', name: 'Noto Serif JP' }
  ];

  const { data } = $props();

  let isLoading = $state(false);
  let isDeleting = $state(false);
  let hasLoaded = $state(false);
  let hasDeleted = $state(false);
  const disableButton = $derived(
    (data.hasSVG && !hasDeleted) || hasLoaded || isDeleting || isLoading
  );

  let popupModal = $state(false);

  const downloadSVGs = async () => {
    isLoading = true;
    await fetchAndStoreSVGs(`${base}/kanji_svg.json`);
    hasLoaded = await hasSVGData();
    isLoading = false;
  };

  const onDeleteData = async () => {
    isDeleting = true;
    resetSettings();
    await clearSVGData();
    hasLoaded = false;
    hasDeleted = true;
    isDeleting = false;
  };
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
    <Modal bind:open={isLoading} size="xs" dismissable={false}>
      <div class="text-center">
        <Spinner class="mx-auto mb-4" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          Downloading SVGs...
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          This may take a while depending on your internet connection.
        </p>
      </div>
    </Modal>
    <Hr classHr="w-[50%]" classDiv="sm:col-span-2">Danger Zone</Hr>
    <Button class="min-w-40" onclick={() => (popupModal = true)}>Delete All Data</Button>
    <Modal bind:open={popupModal} size="xs" autoclose>
      <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          Are you sure you want to delete all data?
        </h3>
        <Button color="red" class="me-2" onclick={onDeleteData}>Confirm</Button>
        <Button color="alternative">Cancel</Button>
      </div>
    </Modal>
    <Modal bind:open={isDeleting} size="xs" dismissable={false}>
      <div class="text-center">
        <Spinner class="mx-auto mb-4" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Deleting data...</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">This may take a while.</p>
      </div>
    </Modal>
  </div>
</PageBody>
