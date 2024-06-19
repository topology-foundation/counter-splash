<script lang="ts">
    import { paintMode, palette, selectedColor } from "$lib/store/player";
    import type { Color } from "$lib/store/player"
    import { fly } from "svelte/transition";
    import { get } from 'svelte/store';

    let colors: Color[] = get(palette);
    let selected: Color = get(selectedColor);

    function selectColor(color: Color): void {
        selectedColor.set(color);
        selected = color;  // Update the local selected color
    }

    // Update colors and selected color when stores change
    $: colors = $palette;
    $: selected = $selectedColor;
</script>

{#if $paintMode}
    <div transition:fly="{{ x: -100, duration: 500 }}" class="fixed z-50 left-0 top-1/2 transform -translate-y-1/2 h-[50vh] w-[100px] bg-white flex items-center justify-center p-2">
        <div class="grid grid-cols-2 grid-rows-5 gap-2 w-full h-full">
            {#each colors as color}
                <button 
                    type="button" 
                    class="relative w-full pb-full rounded-lg focus:outline-none" 
                    style="background-color: rgba({color.r}, {color.g}, {color.b}, {color.a / 255}); border: 3px solid {selected.r === color.r && selected.g === color.g && selected.b === color.b && selected.a === color.a ? 'black' : 'transparent'};" 
                    on:click={() => selectColor(color)}
                    on:keydown={(e) => e.key === 'Enter' && selectColor(color)}
                    aria-label="Select color">
                </button>
            {/each}
        </div>
    </div>
{/if}
