import { writable } from 'svelte/store';

export const selectedKeyboard = writable<string>('qwerty');
