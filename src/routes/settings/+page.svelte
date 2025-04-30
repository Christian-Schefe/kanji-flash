<script lang="ts">
  import PageBody from '$lib/components/PageBody.svelte';
  import { resetSettings, settings } from '$lib/settings.svelte';
  import { Button, DarkMode, Label, Modal, Select } from 'flowbite-svelte';
  import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

  const fonts = [
    { value: 'noto-sans-jp', name: 'Noto Sans JP' },
    { value: 'noto-serif-jp', name: 'Noto Serif JP' }
  ];

  let popupModal = $state(false);

  const onDeleteData = () => {
    resetSettings();
  };
</script>

<PageBody title="Settings">
  <div class="flex flex-col items-center gap-4">
    <DarkMode />
    <div class="flex flex-col gap-4 items-center">
      <div>
        <Label>Font for Japanese characters</Label>
        <Select items={fonts} bind:value={settings.settings.font}></Select>
      </div>
      <Button onclick={() => (popupModal = true)}>Delete All Data</Button>
      <Modal bind:open={popupModal} size="xs" autoclose>
        <div class="text-center">
          <ExclamationCircleOutline
            class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
          />
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete all data?
          </h3>
          <Button color="red" class="me-2" onclick={onDeleteData}>Confirm</Button>
          <Button color="alternative">Cancel</Button>
        </div>
      </Modal>
    </div>
  </div>
</PageBody>
