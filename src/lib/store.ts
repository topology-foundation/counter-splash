import { writable } from 'svelte/store';
import { throttle } from 'lodash-es';

export const selectedKeyboard  = writable('qwerty');

const initialPixelData = {};
export const pixels = writable(initialPixelData);

const applyUpdates = throttle((updates) => {
  pixels.update(p => {
    updates.forEach(({ x, y, color }) => {
      p[`${x},${y}`] = color;
    });
    return p;
  });
}, 100); // Throttle updates to once every 100ms

export function updatePixels(updates) {
  applyUpdates(updates);
}