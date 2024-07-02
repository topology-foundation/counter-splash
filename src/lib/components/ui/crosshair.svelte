<script>
  import { onMount } from "svelte";
  import { Line, BufferGeometry, Vector3, LineBasicMaterial } from "three";

  let crosshair;

  onMount(() => {
    // Create a crosshair
    const material = new LineBasicMaterial({ color: 0xffffff });
    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 10, 0),
      new Vector3(0, -10, 0),
      new Vector3(0, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(-10, 0, 0),
    ]);

    crosshair = new Line(geometry, material);

    // Position the crosshair
    crosshair.position.z = -0.5;
  });

  export { crosshair };
</script>
