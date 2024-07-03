<script>
  import { playerPosition } from "$lib/store/player";
</script>

<div>
  Player Position:
  <p>X: {Math.floor($playerPosition.position.x)}</p>
  <p>Y: {Math.floor($playerPosition.position.y)}</p>
  <p>Z: {Math.floor($playerPosition.position.z)}</p>
</div>
