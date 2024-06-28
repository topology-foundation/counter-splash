<script lang="ts">
  import { onMount } from "svelte";
  import { Canvas } from "@threlte/core";
  import { World } from "@threlte/rapier";
  import Scene from "./Scene.svelte";
  import { selectedKeyboard } from "$lib/store/settings";
  import Ui from "./ui/paintMode/Ui.svelte";
  import { PerfMonitor } from "@threlte/extras";
  import Position from "./ui/position/position.svelte";
  import { debugMode } from "$lib/store/player";
  import Settings from "./ui/settings.svelte";

  let keyboard: any;

  onMount(() => {
    selectedKeyboard.subscribe((value) => {
      keyboard = { value };
    });
  });

  $: if (keyboard && keyboard.value) {
    selectedKeyboard.set(keyboard.value);
  }
</script>

<div class="absolute">
  <Ui />
</div>

<div>
  <div class="absolute z-10 right-0 p-5 bg-white">
    <Settings />
    {#if $debugMode}
      <Position />
    {/if}
  </div>
</div>

<div class="relative h-full w-full">
  <Canvas>
    {#if $debugMode}
      <PerfMonitor anchorX={"left"} logsPerSecond={30} />
    {/if}
    <World>
      <Scene />
    </World>
  </Canvas>
</div>
