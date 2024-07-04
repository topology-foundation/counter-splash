import { writable } from "svelte/store";
import type { Player } from "./playersData";
import { Vector3, Euler } from "three";

// Player-related stores and functions
// -----------------------------------

/**
 * Represents the player's current position, rotation, and state.
 */
export const playerPosition = writable<Player>({
  id: "",
  position: new Vector3(0, 10000, 20005),
  rotation: new Euler(0, 0, 0, "XYZ"),
  state: "idle",
});

/**
 * Updates the player's position, rotation, and state.
 *
 * @param position - The new position as a Vector3 object.
 * @param rotation - The new rotation as an Euler object.
 * @param state - The new state as a string ("idle", "running", "walking", "jumping").
 */
export const setPlayerPosition = (
  position?: Vector3,
  rotation?: Euler,
  state?: "idle" | "running" | "walking" | "jumping",
) => {
  playerPosition.update((player) => ({
    ...player,
    position: position ?? player.position,
    rotation: rotation ?? player.rotation,
    state: state ?? player.state,
  }));
};

// Player state data
// --------------------
export interface Coords {
  x: number;
  y: number;
}
export const mousePosition = writable<Coords>({ x: 0, y: 0 });
export const isMouseDown = writable<boolean>(false);
export const isIntersect = writable<boolean>(false);

/**
 * Player Settings are variable modes
 */
export const paintMode = writable<boolean>(false);
export const debugMode = writable<boolean>(false);
export const canPaint = writable<boolean>(false);
// Sets
export function setCanPaint(value: boolean) {
  canPaint.set(value);
}
export const setDebugMode = (value: boolean) => {
  debugMode.set(value);
};

/**
 * Selected colors and availible colors
 */
export type Color = { r: number; g: number; b: number; a: number };
export const selectedColor = writable<Color>({ r: 255, g: 0, b: 0, a: 255 });
export const palette = writable<Color[]>([
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
