<script>
  import { wizardData } from '$lib/stores/wizardStore';
  import { downloadTicketPdf } from '$lib/api/main-backend-requests/tickets';
  import { step } from '$lib/stores/stepStore';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import { getTicket } from '$lib/api/main-backend-requests/tickets';
  import { getClient } from '$lib/api/main-backend-requests/clients';
  import { getDevice } from '$lib/api/main-backend-requests/devices';
	import { goto } from '$app/navigation';

  let client = null;
  let device = null;
  let ticket = null;
  let loading = true;
  let error = null;

  const data = get(wizardData);

  onMount(async () => {
    loading = true;
    error = null;
    try {
      client = await getClient(data.clientId);
      device = await getDevice(data.deviceId);
      ticket = await getTicket(data.ticketId);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-8 rounded-2xl shadow-xl bg-white max-w-2xl mx-auto mt-8 border border-gray-100">
  <h2 class="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">Resumen</h2>
  {#if loading}
    <div class="flex items-center justify-center py-8">
      <svg class="animate-spin h-6 w-6 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span class="text-gray-500">Cargando datos...</span>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-center">
      Error: {error}
    </div>
  {:else}
    <ul class="mb-6 divide-y divide-gray-100 bg-gray-50 rounded-lg p-4">
      <li class="py-2"><span class="font-semibold text-gray-700">ID Cliente:</span> <span class="text-gray-900">{client.id}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Nombre:</span> <span class="text-gray-900">{client.name}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Teléfono:</span> <span class="text-gray-900">{client.phone}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Email:</span> <span class="text-gray-900">{client.email}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Notas Cliente:</span> <span class="text-gray-900">{client.notes}</span></li>
      <li class="py-2 mt-2"><span class="font-semibold text-gray-700">ID Dispositivo:</span> <span class="text-gray-900">{device.id}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Modelo:</span> <span class="text-gray-900">{device.model}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Color:</span> <span class="text-gray-900">{device.color}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">IMEI:</span> <span class="text-gray-900">{device.imei}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Número de serie:</span> <span class="text-gray-900">{device.serialNumber}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Notas Dispositivo:</span> <span class="text-gray-900">{device.notes}</span></li>
      <li class="py-2 mt-2"><span class="font-semibold text-gray-700">ID Ticket:</span> <span class="text-gray-900">{ticket.id}</span></li>
      <li class="py-2"><span class="font-semibold text-gray-700">Descripción inicial:</span> <span class="text-gray-900">{ticket.initialStateDescription}</span></li>
    </ul>
    <div class="mb-4">
      <span class="font-semibold text-gray-700">Imágenes:</span>
      <span class="ml-2 text-gray-900">{data.deviceImages ? data.deviceImages.length : 0}</span>
    </div>
    {#if data.deviceImages && data.deviceImages.length > 0}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {#each data.deviceImages as url}
          <img src={url} alt="Imagen del dispositivo" class="w-full h-28 object-cover rounded-lg border border-gray-200 shadow-sm" />
        {/each}
      </div>
    {/if}
    <div class="flex justify-end gap-4">
      <button
        class="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition-colors duration-150"
        on:click={() => downloadTicketPdf(ticket.id)}
        >
        Descargar PDF
      </button>
      <button class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors duration-150"
        on:click={() => {
          goto('/receptionist/tickets');
          step.set(1);
          wizardData.set({
            clientId: null,
            deviceId: null,
            ticketId: null,
            deviceImages: [],
            initialStateDescription: ''
          });
        }}>
        Finalizar
      </button>
    </div>
  {/if}
</div>