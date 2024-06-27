<script lang="ts">
    import { onMount } from "svelte";
    import { Canvas } from "@threlte/core";
    import { World } from "@threlte/rapier";
    import Scene from "./Scene.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Select from "$lib/components/ui/select";
    import { selectedKeyboard } from "$lib/store/settings";
    import Ui from "./ui/paintMode/Ui.svelte";
    import { PerfMonitor } from "@threlte/extras";
    import Position from "./ui/position/position.svelte";
    import { debugMode } from "$lib/store/player";
    import { topologyInit } from "$lib/topology";

    let keyboard: any;

    onMount(async () => {
        selectedKeyboard.subscribe((value) => {
            keyboard = { value };
        });

        await topologyInit();
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
                                        <Select.Value
                                            placeholder={keyboard?.value ||
                                                "Select keyboard"}
                                        />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item
                                            value="azerty"
                                            label="azerty">AZERTY</Select.Item
                                        >
                                        <Select.Item
                                            value="dvorak"
                                            label="dvorak">DVORAK</Select.Item
                                        >
                                        <Select.Item
                                            value="qwerty"
                                            label="qwerty">QWERTY</Select.Item
                                        >
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
