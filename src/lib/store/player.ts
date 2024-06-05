import { writable } from "svelte/store";


export const canPaint = writable(false);

export function setCanPaint(value: boolean) {
  canPaint.set(value);
}