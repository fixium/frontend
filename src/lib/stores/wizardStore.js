import { writable } from 'svelte/store';

export const wizardData = writable({
  clientId: null,
  deviceId: null,
  ticketId: null,
  deviceImages: []
});