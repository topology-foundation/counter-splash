import { updatePixels } from './store/wall';

export function generateRandomPixels(width: number, height: number, count: number) {
  const updates = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 255; 
    updates.push({ x, y, r, g, b, a });
  }
  updatePixels(updates);
}