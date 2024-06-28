<script>
  import { playerPosition } from "$lib/store/player";
</script>

<div>
  Player Position:
  <p>X: {Math.floor($playerPosition[0])}</p>
  <p>Y: {Math.floor($playerPosition[1])}</p>
  <p>Z: {Math.floor($playerPosition[2])}</p>
</div>
