<script>
  import SemiTransparentWall from "../GlassWall.svelte";
  // Define the positions of the walls

  //Generally spacing in units of 5

  let walls = [
    { position: [-5, -5, 15], rotation: [0, 0, 0], width: 20 },
    { position: [0, -5, 30], rotation: [0, 0, 0], width: 10 },
    { position: [-5, -5, 60], rotation: [0, Math.PI / 2, 0], width: 70 },
    { position: [5, -5, 35], rotation: [0, Math.PI / 2, 0], width: 40 },
    { position: [-15, -5, 20], rotation: [0, Math.PI / 2, 0], width: 30 },
    { position: [-30, -5, 20], rotation: [0, Math.PI / 2, 0], width: 70 },
    // Add more walls as needed
    { position: [-15, -5, -15], rotation: [0, 0, 0], width: 40 },
    { position: [20, -5, 0], rotation: [0, Math.PI / 2, 0], width: 30 },
    { position: [40, -5, 15], rotation: [0, 0, 0], width: 40 },
    { position: [30, -5, 50], rotation: [0, Math.PI / 2, 0], width: 30 },
    { position: [17, -5, 50], rotation: [0, 0, 0], width: 25 },

    { position: [10, -5, 30], rotation: [0, 0, 0], width: 10 },
    { position: [15, -5, 35], rotation: [0, Math.PI / 2, 0], width: 10 },

    { position: [60, -5, 30], rotation: [0, Math.PI / 2, 0], width: 90 },
    { position: [-50, -5, 30], rotation: [0, Math.PI / 2, 0], width: 110 },
    { position: [0, -5, 80], rotation: [0, 0, 0], width: 100 },
  ];
</script>

{#each walls as wall (wall.position.toString())}
  <SemiTransparentWall
    position={wall.position}
    rotation={wall.rotation}
    width={wall.width}
  />
{/each}
