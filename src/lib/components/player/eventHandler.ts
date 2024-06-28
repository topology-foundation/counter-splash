// src/eventHandlers.ts
import { keyMapping, selectedKeyboard } from "$lib/store/settings";
import { setDebugMode, debugMode } from "$lib/store/player";
import { get } from "svelte/store";

export function createEventHandlers() {
  let forward = 0;
  let backward = 0;
  let left = 0;
  let right = 0;
  let jump = false;

  function onKeyDown(e: KeyboardEvent) {
    const selectedKey = get(selectedKeyboard);
    const mapping = keyMapping[selectedKey];
    switch (e.key) {
      case mapping.backward:
      case "ArrowDown":
        backward = 1;
        break;
      case mapping.forward:
      case "ArrowUp":
        forward = 1;
        break;
      case mapping.left:
      case "ArrowLeft":
        left = 1;
        break;
      case mapping.right:
      case "ArrowRight":
        right = 1;
        break;
      case mapping.jump:
        if (e.key === mapping.jump || e.key === " ") {
          jump = true;
        }
        break;
      case mapping.debug:
        setDebugMode(!get(debugMode));
        break;
      default:
        break;
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    const selectedKey = get(selectedKeyboard);
    const mapping = keyMapping[selectedKey];
    switch (e.key) {
      case mapping.backward:
      case "ArrowDown":
        backward = 0;
        break;
      case mapping.forward:
      case "ArrowUp":
        forward = 0;
        break;
      case mapping.left:
      case "ArrowLeft":
        left = 0;
        break;
      case mapping.right:
      case "ArrowRight":
        right = 0;
        break;
      case mapping.jump:
        if (e.key === mapping.jump || e.key === " ") {
          jump = false;
        }
        break;
      default:
        break;
    }
  }

  return {
    onKeyDown,
    onKeyUp,
    getControls: () => ({ forward, backward, left, right, jump }),
  };
}
