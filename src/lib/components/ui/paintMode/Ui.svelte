<script lang="ts">
    import { paintMode } from "$lib/store/player";
    import { fly } from "svelte/transition";
    
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF5',
        '#FF8C33', '#B833FF', '#F5FF33', '#FF335E', '#33FF8A', 
    ];
</script>

{#if $paintMode}
    <div transition:fly="{{ x: -100, duration: 500 }}" class="fixed z-50 left-0 top-1/2 transform -translate-y-1/2 h-[50vh] w-[100px] bg-white flex items-center justify-center p-2">
        <div class="grid grid-cols-2 grid-rows-5 gap-2 w-full h-full">
            {#each colors as color}
                <div class="relative w-full pb-full rounded-lg" style="background-color: {color};">
                    <div class="absolute top-0 left-0 w-full h-full rounded-lg" style="background-color: {color};"></div>
                </div>
            {/each}
        </div>
    </div>
{/if}
