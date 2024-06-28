<!--
  PaintPlatforms generates platforms near the wall for players to paint on
-->

<script lang="ts">
  import { T } from "@threlte/core";
  import { AutoColliders } from "@threlte/rapier";

  const platformWidth = 100 / 3 / 2; // adjust as needed
  const platformDepth = 10; // adjust as needed
  const splashWallWidth = 100; // total width of the splash wall
  const platformHeights = [10, 25, 45]; // 1/4, 2/4, and 3/4 of the splash wall height
  const platformPositions = [-splashWallWidth / 3, 0, splashWallWidth / 3]; // positions of the platforms along the x-axis
</script>

<T.Group position={[0, 0, -40]}>
  {#each platformHeights as height}
    {#each platformPositions as position}
      <AutoColliders shape={"cuboid"} friction={0}>
        <T.Mesh
          name={`Platform${height}${position}`}
          position={[position, height, 0]}
        >
          <T.BoxGeometry args={[platformWidth, 1, platformDepth]} />
          <T.MeshStandardMaterial />
        </T.Mesh>
      </AutoColliders>
    {/each}
  {/each}
</T.Group>
