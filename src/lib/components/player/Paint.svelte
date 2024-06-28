<script lang="ts">
  import {
    paintMode,
    isMouseDown,
    mousePosition,
    isIntersect,
    selectedColor,
  } from "$lib/store/player";
  import { get } from "svelte/store";
  import { updatePixels } from "$lib/store/wall";

     let lastMousePosition: { x: number; y: number } | null = null;

$: if ($isMouseDown && $paintMode && !$isIntersect) {
  // Convert the UV coordinates to pixel coordinates
  const x = Math.floor($mousePosition.x * 4000);
  const y = Math.floor($mousePosition.y * 3000);

  if (lastMousePosition) {
    const lastX = Math.floor(lastMousePosition.x * 4000);
    const lastY = Math.floor(lastMousePosition.y * 3000);
    drawLine(lastX, lastY, x, y);
  }

  lastMousePosition = { x: $mousePosition.x, y: $mousePosition.y };
}

function drawLine(x0: number, y0: number, x1: number, y1: number): void {
  const updates: {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    a: number;
  }[] = [];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    drawCircle(updates, x0, y0);

    if (x0 === x1 && y0 === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  updatePixels(updates);
}
function drawCircle(
  updates: {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    a: number;
  }[],
  x: number,
  y: number,
): void {
  const { r, g, b, a } = get(selectedColor);
  for (let i = -10; i < 10; i++) {
    for (let j = -10; j < 10; j++) {
      if (i * i + j * j < 100) {
        updates.push({ x: x + i, y: y + j, r, g, b, a });
      }
    }
  }
}
$: if (!$isMouseDown || $isIntersect) {
  lastMousePosition = null;
}
</script>