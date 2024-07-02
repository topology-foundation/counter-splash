<script lang="ts">
  import { sprayWheel } from "$lib/store/player";

  const imageCount = 9;

  function getImageSrc(index: number): string {
    return `sprays/spray${index + 1}.png`;
  }
</script>

{#if $sprayWheel}
  <div class="relative h-screen w-full">
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
      <div class="grid grid-cols-3 gap-2">
        {#each Array(imageCount) as _, index}
          <div class="flex items-center justify-center bg-white text-black p-2 rounded shadow hover:bg-gray-300">
            <img src={getImageSrc(index)} alt="spray image" />
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
