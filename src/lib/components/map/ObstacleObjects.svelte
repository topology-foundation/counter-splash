<script lang="ts">
    import { T } from "@threlte/core";
    import { AutoColliders } from "@threlte/rapier";

    const shapes = ["cylinder", "sphere", "box", "torus"]; // add more shapes as needed
    const colors = [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#00FFFF",
        "#FF00FF",
    ]; // add more colors as needed
    const numShapes = 300; // number of shapes to generate
    const seed = 12345; // change this to get a different set of random shapes

    // Simple seedable pseudo-random number generator
    function seedRandom(seed: number) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    function getRandomShape(seed: number, center: number[], boxSize: number, minSize: number, maxSize: number) {
    const color = colors[Math.floor(seedRandom(seed + 4) * colors.length)]; // random color
    const shape = shapes[Math.floor(seedRandom(seed) * shapes.length)];
    const size = seedRandom(seed) * (maxSize - minSize) + minSize; // random size between minSize and maxSize
    const position = [
        seedRandom(seed + 1) * boxSize + center[0] - boxSize / 2, // random x position within the box
        seedRandom(seed + 2) * boxSize + center[1] - boxSize / 2, // random y position within the box
        seedRandom(seed + 3) * boxSize + center[2] - boxSize / 2, // random z position within the box
    ];
    const rotation = [
        seedRandom(seed + 5) * Math.PI * 2, // random x rotation between 0 and 2π
        seedRandom(seed + 6) * Math.PI * 2, // random y rotation between 0 and 2π
        seedRandom(seed + 7) * Math.PI * 2, // random z rotation between 0 and 2π
    ];

    return { shape, size, position, color, rotation };
}

    const center = [0, 50, 20];
    const boxSize = 100;
    const minSize = 1;
    const maxSize = 9;

    const randomShapes = Array.from({ length: numShapes }, (_, i) =>
        getRandomShape(seed + i, center, boxSize, minSize, maxSize),
    );
</script>

<T.Group>
    <AutoColliders shape={'cuboid'}>
      {#each randomShapes as { shape, size, position, color, rotation }}
        <T.Mesh position={position} rotation={rotation}>
          {#if shape === 'cylinder'}
            <T.CylinderGeometry args={[size / 2, size / 2, size, 32]} />
          {:else if shape === 'sphere'}
            <T.SphereGeometry args={[size / 2, 32, 32]} />
          {:else if shape === 'box'}
            <T.BoxGeometry args={[size, size, size]} />
          {:else if shape === 'torus'}
            <T.TorusGeometry args={[size / 2, size / 4, 16, 100]} />
          {/if}
          <T.MeshBasicMaterial color={color} />
        </T.Mesh>
      {/each}
    </AutoColliders>
  </T.Group>