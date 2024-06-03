import { writable } from 'svelte/store';

const width = 4000;
const height = 3000;
const size = width * height * 4; // RGBA format

// const initialPixelData = new Uint8Array(size); // white canvas set up
// for (let i = 0; i < size; i += 4) {
//   initialPixelData[i] = 255;     // Red
//   initialPixelData[i + 1] = 255; // Green
//   initialPixelData[i + 2] = 255; // Blue
//   initialPixelData[i + 3] = 255; // Alpha
// }
const initialPixelData = new Uint8Array(size); //black canvas set up


export const pixels = writable<Uint8Array>(initialPixelData);

export function updatePixels(updates: { x: number, y: number, r: number, g: number, b: number, a: number }[]): void {
  pixels.update(p => {
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