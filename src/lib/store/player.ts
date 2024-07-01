import { writable } from "svelte/store";

export const paintMode = writable<boolean>(false);

export const debugMode = writable<boolean>(false);
export const setDebugMode = (value: boolean) => {
  debugMode.set(value);
};

export interface Coords {
  x: number;
  y: number;
}

export type Position = number[];
export const playerPosition = writable<Position>([0, 10000, 20005]);
export const setPlayerPosition = (position: Position) => {
  playerPosition.set(position);
};

export const mousePosition = writable<Coords>({ x: 0, y: 0 });
export const isMouseDown = writable<boolean>(false);
export const isIntersect = writable<boolean>(false);

export type Color = { r: number; g: number; b: number; a: number };
export const selectedColor = writable<Color>({ r: 255, g: 0, b: 0, a: 255 });

export const palette = writable([
  { r: 255, g: 0, b: 0, a: 255 }, // Red
  { r: 0, g: 255, b: 0, a: 255 }, // Green
  { r: 0, g: 0, b: 255, a: 255 }, // Blue
  { r: 255, g: 255, b: 0, a: 255 }, // Yellow
  { r: 255, g: 0, b: 255, a: 255 }, // Magenta
  { r: 0, g: 255, b: 255, a: 255 }, // Cyan
  { r: 128, g: 128, b: 128, a: 255 }, // Gray
  { r: 0, g: 0, b: 0, a: 255 }, // Black
  { r: 255, g: 165, b: 0, a: 255 }, // Orange
  { r: 75, g: 0, b: 130, a: 255 }, // Indigo
]);

export const canPaint = writable(false);
export function setCanPaint(value: boolean) {
  canPaint.set(value);
}

export const sprayWheel = writable(false);
