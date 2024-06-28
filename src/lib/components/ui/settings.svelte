<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Select from "$lib/components/ui/select";
    import { selectedKeyboard, keyMapping } from '$lib/store/settings';
    import { onMount } from 'svelte';
  
    let keyboard: any;
  
    onMount(() => {
      selectedKeyboard.subscribe(value => {
        keyboard = { value };
      });
    });
  
    $: if (keyboard && keyboard.value) {
      selectedKeyboard.set(keyboard.value);
    }
  </script>
  
  <Dialog.Root>
    <Dialog.Trigger>Settings</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Settings</Dialog.Title>
        <Dialog.Description>
          <div class="grid grid-cols-2 pt-5">
            <div>
              <Select.Root bind:selected={keyboard}>
                <Select.Trigger class="w-[180px]">
                  <Select.Value placeholder={keyboard?.value || 'Select keyboard'} />
                </Select.Trigger>
                <Select.Content>
                  {#each Object.keys(keyMapping) as layout}
                    <Select.Item value={layout} label={layout}>{layout.toUpperCase()}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
            <div>
              <!-- Second column content -->
            </div>
          </div>
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>
  