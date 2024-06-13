import { writable } from "svelte/store";

export const paintMode = writable<boolean>(false);

export interface Coords {
  x: number;
  y: number;
  z: number;
}

export const mousePosition = writable<Coords>({ x: 0, y: 0, z: 0 });

export const canPaint = writable(false);
export function setCanPaint(value: boolean) {
  canPaint.set(value);
}