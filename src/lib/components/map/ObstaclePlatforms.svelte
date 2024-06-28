<script lang="ts">
  import { T } from "@threlte/core";
  import { AutoColliders } from "@threlte/rapier";

  const numShapes = 250; // number of shapes to generate
  const seed = 12345; // change this to get a different set of random shapes

  // Simple seedable pseudo-random number generator
  function seedRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function getRandomShape(
    seed: number,
    center: number[],
    boxSize: number,
    minSize: number,
    maxSize: number,
  ) {
    const size = seedRandom(seed) * (maxSize - minSize) + minSize; // random size between minSize and maxSize
    const position = [
      seedRandom(seed + 1) * boxSize + center[0] - boxSize / 2, // random x position within the box
      seedRandom(seed + 2) * 2 + center[1] - 10, // random x position within the box
      seedRandom(seed + 3) * boxSize + center[2] - boxSize / 2, // random z position within the box
    ];
    const rotation = [
      seedRandom(seed + 5) * Math.PI * 2, // random x rotation between 0 and 2π
      seedRandom(seed + 6) * Math.PI * 2, // random y rotation between 0 and 2π
      seedRandom(seed + 7) * Math.PI * 2, // random z rotation between 0 and 2π
    ];

    return { shape: "box", size, position, rotation };
  }

  const center = [0, 0, 20];
  const boxSize = 120;
  const minSize = 2;
  const maxSize = 6;

  const randomShapes = Array.from({ length: numShapes }, (_, i) =>
    getRandomShape(seed + i, center, boxSize, minSize, maxSize),
  );
</script>

<T.Group>
  {#each randomShapes as { shape, size, position, rotation }}
    <AutoColliders shape={"cuboid"} friction={0}>
      <T.Mesh {position}>
        <T.BoxGeometry args={[size, size / 2, size]} />
        <T.MeshStandardMaterial />
      </T.Mesh>
    </AutoColliders>
  {/each}
</T.Group>
