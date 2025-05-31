<script>
  import { wizardData } from '$lib/stores/wizardStore';
  import { downloadTicketPdf } from '$lib/api/main-backend-requests/tickets';
  import { step } from '$lib/stores/stepStore';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import { getTicket } from '$lib/api/main-backend-requests/tickets';
  import { getCustomer } from '$lib/api/main-backend-requests/customers';
  import { getDevice } from '$lib/api/main-backend-requests/devices';
	import { goto } from '$app/navigation';

  let customer = null;
  let device = null;
  let ticket = null;
  let loading = true;
  let error = null;

  const data = get(wizardData);

  onMount(async () => {
    loading = true;
    error = null;
    try {
      customer = await getCustomer(data.customerId);
      device = await getDevice(data.deviceId);
      ticket = await getTicket(data.ticketId);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-8 rounded-2xl shadow-xl bg-white max-w-2xl mx-auto mt-8 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
  <h2 class="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight dark:text-blue-300">Resumen</h2>
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Bloque Cliente -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
        <h3 class="text-lg font-bold mb-3 text-blue-700 dark:text-blue-300">Datos del cliente</h3>
        <ul class="space-y-2">
          <li><span class="font-semibold text-gray-700 dark:text-white">ID Cliente:</span> <span class="text-gray-900 dark:text-white">{customer.id}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Nombre:</span> <span class="text-gray-900 dark:text-white">{customer.name}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Teléfono:</span> <span class="text-gray-900 dark:text-white">{customer.phone}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Email:</span> <span class="text-gray-900 dark:text-white">{customer.email}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Notas:</span> <span class="text-gray-900 dark:text-white">{customer.notes}</span></li>
        </ul>
      </div>
      <!-- Bloque Dispositivo -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
        <h3 class="text-lg font-bold mb-3 text-blue-700 dark:text-blue-300">Datos del dispositivo</h3>
        <ul class="space-y-2">
          <li><span class="font-semibold text-gray-700 dark:text-white">ID Dispositivo:</span> <span class="text-gray-900 dark:text-white">{device.id}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Modelo:</span> <span class="text-gray-900 dark:text-white">{device.model}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Color:</span> <span class="text-gray-900 dark:text-white">{device.color}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">IMEI:</span> <span class="text-gray-900 dark:text-white">{device.imei}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Número de serie:</span> <span class="text-gray-900 dark:text-white">{device.serialNumber}</span></li>
          <li><span class="font-semibold text-gray-700 dark:text-white">Notas:</span> <span class="text-gray-900 dark:text-white">{device.notes}</span></li>
        </ul>
      </div>
    </div>
    <!-- Bloque Ticket -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600 mb-6">
      <h3 class="text-lg font-bold mb-3 text-blue-700 dark:text-blue-300">Datos del ticket</h3>
      <ul class="space-y-2">
        <li><span class="font-semibold text-gray-700 dark:text-white">ID Ticket:</span> <span class="text-gray-900 dark:text-white">{ticket.id}</span></li>
        <li><span class="font-semibold text-gray-700 dark:text-white">Descripción inicial:</span> <span class="text-gray-900 dark:text-white">{ticket.initialStateDescription}</span></li>
      </ul>
    </div>
    <!-- Imágenes -->
    <div class="mb-4">
      <span class="font-semibold text-gray-700 dark:text-white">Imágenes:</span>
      <span class="ml-2 text-gray-900 dark:text-white">{data.deviceImages ? data.deviceImages.length : 0}</span>
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
            customerId: null,
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