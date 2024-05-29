<script lang="ts">
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  import { World } from '@threlte/rapier';
  import Scene from './Scene.svelte';
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Select from "$lib/components/ui/select";
  import { selectedKeyboard } from '$lib/store'; 

  let keyboard;

  onMount(() => {
    selectedKeyboard.subscribe(value => {
      keyboard = { value };
    });
  });

  $: if (keyboard && keyboard.value) {
    selectedKeyboard.set(keyboard.value);
  }
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
                <Select.Root bind:selected={keyboard}>
                  <Select.Trigger class="w-[180px]">
                    <Select.Value placeholder={keyboard?.value || 'Select keyboard'} />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="azerty" label="azerty">AZERTY</Select.Item>
                    <Select.Item value="qwerty" label="qwerty">QWERTY</Select.Item>
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
