import { writable } from 'svelte/store';

export const selectedKeyboard = writable<string>('qwerty');

export const paintMode = writable<boolean>(false);