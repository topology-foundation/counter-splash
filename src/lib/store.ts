import { writable } from 'svelte/store';
import { throttle } from 'lodash-es';

export const selectedKeyboard = writable<string>('qwerty');

interface PixelData {
  [key: string]: string;
}

const initialPixelData: PixelData = {};
export const pixels = writable<PixelData>(initialPixelData);

interface PixelUpdate {
  x: number;
  y: number;
  color: string;
}

const applyUpdates = throttle((updates: PixelUpdate[]) => {
  pixels.update(p => {
    const updatedPixels = { ...p };
    updates.forEach(({ x, y, color }) => {
      updatedPixels[`${x},${y}`] = color;
    });
    return updatedPixels;
  });
}, 100); // Throttle updates to once every 100ms

export function updatePixels(updates: PixelUpdate[]): void {
  applyUpdates(updates);
}