import { writable } from 'svelte/store';

export const wizardData = writable({
  customerId: null,
  deviceId: null,
  ticketId: null,
  deviceImages: []
});