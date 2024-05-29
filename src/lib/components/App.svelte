<script lang="ts">
  import { Canvas } from '@threlte/core'
  import { World } from '@threlte/rapier'
  import Scene from './Scene.svelte'
  import * as Dialog from "$lib/components/ui/dialog";

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
                <h3 class="text-xl flex justify-center py-2">Keyboard</h3>
                  <div class="mx-14">

                  </div>
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
