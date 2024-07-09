import { writable } from "svelte/store";

export const selectedKeyboard = writable<string>("qwerty");

export interface KeyMapping {
  forward: string;
  backward: string;
  left: string;
  right: string;
  jump: string;
  dash: string;
  debug: string;
  paint: string;
}

export const keyMapping: { [x: string]: KeyMapping } = {
  qwerty: {
    forward: "w",
    backward: "s",
    left: "a",
    right: "d",
    jump: " ",
    dash: "q",
    debug: "i",
    paint: "e",
  },
  dvorak: {
    forward: ",",
    backward: "o",
    left: "a",
    right: "e",
    jump: " ",
    dash: "r",
    debug: "c",
    paint: ".",
  },
  azerty: {
    forward: "z",
    backward: "s",
    left: "q",
    right: "d",
    jump: " ",
    dash: "r",
    debug: "i",
    paint: "e",
  },
};
