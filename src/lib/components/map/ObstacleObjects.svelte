<!--
  ObstacleObjects generates random objects to practice parkour on
-->
<script lang="ts">
    import { T } from "@threlte/core";
    import { AutoColliders, type AutoCollidersShapes } from "@threlte/rapier";

    export let center = [0, 50, 20];
    export let containerHeight = 100;
    export let containerWidth = 100;
    export let containerLength = 100;
    export let minSize = 1;
    export let maxSize = 9;
    export let numShapes = 300; // number of shapes to generate
    export let seed = 12345; // change this to get a different set of random shapes


    const shapes = ["cylinder", "sphere", "box", "torus", "jumpPad"]; // add more shapes as needed
    const colors = [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#00FFFF",
        "#FF00FF",
    ]; // add more colors as needed

    const meshShape : Record<string, AutoCollidersShapes | undefined> = {
        "cylinder": "trimesh",
        "sphere": "ball",
        "box": "cuboid",
        "torus": "convexHull"
    };


    // Simple seedable pseudo-random number generator
    function seedRandom(seed: number) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    const occupiedPositions : number[][] = [];

    function getRandomShape(seed: number, center: number[],  containerHeight : number, containerWidth : number, containerLength : number, minSize: number, maxSize: number) {
        const color = colors[Math.floor(seedRandom(seed + 4) * colors.length)]; // random color
        const shape = shapes[Math.floor(seedRandom(seed) * shapes.length)];
        const size = seedRandom(seed) * (maxSize - minSize) + minSize; // random size between minSize and maxSize        
        
        let position = [-1,-1,-1];
        let tooClose;
        let tries = 0;
        do {          
          position = [
            seedRandom(seed + 1) * containerWidth + center[0] - containerWidth / 2, // random x position within the box
            (seedRandom(seed + 2) ** 2) * containerHeight + center[1] - containerHeight / 2, // random y position within the box
            seedRandom(seed + 3) * containerLength + center[2] - containerLength / 2, // random z position within the box
          ];

          tooClose = occupiedPositions.some(occupiedPosition => {
            const dx = position[0] - occupiedPosition[0];
            const dy = position[1] - occupiedPosition[1];
            const dz = position[2] - occupiedPosition[2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            return distance < size * 2; // change this value to adjust the minimum distance between objects
          });

          if (!tooClose || tries > 10) {
            occupiedPositions.push(position);
          }
          tries++
        } while (tooClose && tries <= 10);
    
        const rotation = [
            seedRandom(seed + 5) * Math.PI * 2, // random x rotation between 0 and 2π
            seedRandom(seed + 6) * Math.PI * 2, // random y rotation between 0 and 2π
            seedRandom(seed + 7) * Math.PI * 2, // random z rotation between 0 and 2π
        ];

        return { shape, size, position, color, rotation };
    }    

    const randomShapes = Array.from({ length: numShapes }, (_, i) =>
        getRandomShape(seed + i, center, containerHeight, containerWidth, containerLength, minSize, maxSize),
    );
</script>

{#each randomShapes as { shape, size, position, color, rotation }}
  {#if shape === 'jumpPad'}
  <AutoColliders shape={meshShape[shape]} friction={0}>
    <T.Mesh position={position}>
      <T.BoxGeometry args={[4, .2, 4]} />
      <T.MeshStandardMaterial color="#808080" />
    </T.Mesh>
    <T.Mesh name={'jumpPad'} position={[position[0], position[1] + .1, position[2]]}>
      <T.BoxGeometry args={[4 * 0.9, .3, 4 * 0.9]} />
      <T.MeshStandardMaterial color="#A9A9A9" />
    </T.Mesh>
  </AutoColliders>
  {:else}
    <AutoColliders shape={meshShape[shape]} friction={0} restitution={0}>
      <T.Mesh position={position} rotation={rotation} name={shape}>
        {#if shape === 'cylinder'}
          <T.CylinderGeometry args={[size / 2, size / 2, size, 32]} />
        {:else if shape === 'sphere'}
          <T.SphereGeometry args={[size / 2, 32, 32]} />
        {:else if shape === 'box'}
          <T.BoxGeometry args={[size, size, size]} />
        {:else if shape === 'torus'}
          <T.TorusGeometry args={[size / 2, size / 4, 16, 100]} />
        {/if}
        <T.MeshStandardMaterial color={color} />
      </T.Mesh>
    </AutoColliders>
  {/if}
{/each}