import { sprayCanvas } from './handler';
import { sprayStore } from '$lib/store/player';
import type { SprayData } from '$lib/store/player';

// ugly but i don't care
function generateSprayKey(spray: SprayData): string {
  return `${spray.id}-${spray.offset.x}-${spray.offset.y}-${spray.timestamp}`;
}

const paintedSprays = new Set<string>();

export function startSpraySubscription() {
  return sprayStore.subscribe((sprays: SprayData[]) => {
    sprays.forEach(spray => {
      const sprayKey = generateSprayKey(spray);
      if (!paintedSprays.has(sprayKey)) {
        const { id, offset } = spray;
        const x = Math.floor(offset.x);
        const y = Math.floor(offset.y);
        const imageUrl = `/sprays/spray${id + 1}.png`;
        sprayCanvas(imageUrl, x, y);
        paintedSprays.add(sprayKey);
      }
    });
  });
}
