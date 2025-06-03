<script>
  import { onMount } from 'svelte';
  import { getWorkshopDetails, updateWorkshopDetails } from '$lib/api/main-backend-requests/workshop.js';

  let name = '';
  let phoneNumber = '';
  let contactEmail = '';
  let createdAt = '';
  let loading = true;
  let success = false;
  let error = '';

  // Variables originales para comparar cambios
  let originalName = '';
  let originalPhoneNumber = '';
  let originalContactEmail = '';

  // Nueva variable para la fecha formateada
  let createdAtFormatted = '';

  $: formValid = name.trim() !== '' && phoneNumber.trim() !== '' && contactEmail.trim() !== '';
  $: formChanged = name !== originalName || phoneNumber !== originalPhoneNumber || contactEmail !== originalContactEmail;

  onMount(async () => {
    try {
      const details = await getWorkshopDetails();
      name = details.name;
      phoneNumber = details.phoneNumber;
      contactEmail = details.contactEmail;
      createdAt = details.createdAt;

      // Guardar valores originales
      originalName = details.name;
      originalPhoneNumber = details.phoneNumber;
      originalContactEmail = details.contactEmail;

      // Formatea la fecha
      createdAtFormatted = new Date(createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      error = 'Error al cargar los datos del taller.';
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    error = '';
    success = false;
    try {
      await updateWorkshopDetails({ name, phoneNumber, contactEmail });
      success = true;
      // Actualizar valores originales tras guardar
      originalName = name;
      originalPhoneNumber = phoneNumber;
      originalContactEmail = contactEmail;
    } catch (e) {
      error = 'Error al actualizar los datos.' + (e.message ? `: ${e.message}` : '');
    }
  }
</script>

{#if loading}
  <p class="text-center text-gray-500 mt-8">Cargando...</p>
{:else}
  <form on:submit|preventDefault={handleSubmit} class="max-w-md mx-auto mt-8 bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6 border border-gray-100">
    <h2 class="text-2xl font-bold mb-2 text-center text-blue-700">Actualizar detalles del taller</h2>
    {#if error}
      <p class="text-red-600 text-center">{error}</p>
    {/if}
    {#if success}
      <p class="text-green-600 text-center">¡Datos actualizados correctamente!</p>
    {/if}
    <div>
      <label for="workshop-name" class="block font-semibold mb-1 text-gray-700">Nombre</label>
      <input id="workshop-name" type="text" bind:value={name} required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
    </div>
    <div>
      <label for="workshop-phone" class="block font-semibold mb-1 text-gray-700">Teléfono</label>
      <input id="workshop-phone" type="text" bind:value={phoneNumber} required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
    </div>
    <div>
      <label for="workshop-email" class="block font-semibold mb-1 text-gray-700">Email de contacto</label>
      <input id="workshop-email" type="email" bind:value={contactEmail} required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
    </div>
    <div>
      <label for="workshop-created-at" class="block font-semibold mb-1 text-gray-700">Creado el</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <!-- Heroicon calendar -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        <input
          id="workshop-created-at"
          type="text"
          value={createdAtFormatted}
          disabled
          class="w-full border border-gray-200 bg-gray-100 rounded-lg px-10 py-2 text-gray-500 shadow-sm cursor-not-allowed"
        />
      </div>
    </div>
    <button type="submit" 
    class="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors"
    disabled={!formValid || !formChanged}
    >Actualizar</button>
  </form>
{/if}

<style>
    button:disabled {
        background-color: #cbd5e1; /* Tailwind slate-300 */
        color: #64748b;            /* Tailwind slate-500 */
        cursor: not-allowed;
        opacity: 0.7;
        box-shadow: none;
    }
</style>