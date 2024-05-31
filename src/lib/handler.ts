import { updatePixels } from "./store";

export function generateRandomPixels(width: number, height: number, count: number) {
  const updates = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    updates.push({ x, y, color });
  }
  updatePixels(updates);
}