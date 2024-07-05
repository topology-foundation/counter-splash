<script lang="ts">
  import { sprayWheel, selectedSpray } from "$lib/store/player";

  const imageCount = 5;
  let spray: number = 0;

  function getImageSrc(index: number): string {
    return `sprays/spray${index + 1}.png`;
  }

  function selectSpray(index: number) {
    selectedSpray.set(index);
    spray = index;
  }
</script>

<div class="relative h-screen w-full z-30">
  <div class="p-3">
      <img
        src={getImageSrc(spray)}
        alt="spray selected"
        width="100"
        height="100"
      />
  </div>
  {#if $sprayWheel}
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-4 rounded-lg shadow-lg"
    >
      <div class="grid grid-cols-3 gap-2">
        {#each Array(imageCount) as _, index}
          <div
            class="flex items-center justify-center bg-white text-black p-2 rounded shadow hover:bg-gray-300"
          >
            <button
              type="button"
              class="flex items-center justify-center bg-white text-black p-2 rounded shadow hover:bg-gray-300"
              on:click={() => selectSpray(index)}
            >
              <!-- svelte-ignore a11y-img-redundant-alt -->
              <img src={getImageSrc(index)} alt="spray image" />
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
