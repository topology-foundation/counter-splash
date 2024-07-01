import { writable } from "svelte/store";

const width = 4000;
const height = 3000;
const size = width * height * 4; // RGBA format

const initialPixelData = new Uint8Array(size); // black canvas set up

export const pixels = writable<Uint8Array>(initialPixelData);

interface PixelUpdate {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

export function updatePixels(updates: PixelUpdate[]): void {
  pixels.update((p) => {
    const newPixels = p.slice();
    updates.forEach(({ x, y, r, g, b, a }) => {
      const index = (y * width + x) * 4;
      newPixels[index] = r;
      newPixels[index + 1] = g;
      newPixels[index + 2] = b;
      newPixels[index + 3] = a;
    });
    return newPixels;
  });
}

export { width, height };
