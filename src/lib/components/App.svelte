<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { World } from '@threlte/rapier';
  import Scene from './Scene.svelte';
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Select from "$lib/components/ui/select";

  import { writable } from 'svelte/store';

  export const selectedTheme = writable('QWERTY');

  $: console.log($selectedTheme);

</script>

<div>
  <div class="absolute z-10 right-0 p-5 bg-white">
    <Dialog.Root>
      <Dialog.Trigger>Settings</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>
            <div class="grid grid-cols-2 pt-5">
              <div>
                <Select.Root bind:selected={$selectedTheme}>
                  <Select.Trigger class="w-[180px]">
                    <Select.Value placeholder={$selectedTheme} />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="AZERTY" label="AZERTY">AZERTY</Select.Item>
                    <Select.Item value="QWERTY" lable="QWERTY">QWERTY</Select.Item>
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
  </div>
</div>

<div class="relative h-full w-full">
  <Canvas>
    <World>
      <Scene />
    </World>
  </Canvas>
</div>
