<script>
    import { step } from '$lib/stores/stepStore';
    import { wizardData } from '$lib/stores/wizardStore';
    import { get } from 'svelte/store';
    import { registerTicket } from '$lib/api/main-backend-requests/tickets';
    import { fetchTechnicians } from '$lib/api/main-backend-requests/users';
    import { onMount } from 'svelte';

    let initialStateDescription = '';
    let loading = false;
    let error = '';

    // Técnicos
    let technicians = [];
    let selectedTechnicianId = '';
    let technicianError = '';

    onMount(async () => {
        try {
            technicians = await fetchTechnicians();
        } catch (err) {
            technicianError = err.message;
        }
    });

    function resetTecnico() {
        selectedTechnicianId = '';
    }

    const handleCreateTicket = async () => {
        loading = true;
        error = '';
        // Validación: técnico obligatorio
        if (!selectedTechnicianId) {
            error = 'Debes seleccionar un técnico antes de continuar.';
            loading = false;
            return;
        }
        try {
            const { deviceId } = get(wizardData);
            const ticketId = await registerTicket({
                deviceId,
                initialStateDescription,
                technicianId: Number(selectedTechnicianId)
            });
            wizardData.update((s) => ({ ...s, ticketId }));
            step.set(4); // Avanza al paso 4
        } catch (e) {
            error = e.message || 'Error al crear ticket';
        } finally {
            loading = false;
        }
    };
</script>

<div class="p-8 rounded-2xl shadow-xl bg-white max-w-lg mx-auto mt-8 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
  <h2 class="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight dark:text-blue-300">
    <i class="fa fa-clipboard-list mr-2"></i>
    Estado del dispositivo
  </h2>
  <div class="relative mb-2">
    <i class="fa fa-info-circle absolute left-3 top-3 text-gray-400"></i>
    <textarea
      bind:value={initialStateDescription}
      rows="5"
      class="form-textarea w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
      placeholder="Ej. No enciende, pantalla rota, etc."
      required
    ></textarea>
  </div>

  <!-- Campo para asignar técnico -->
  <div class="mt-6">
    <label for="technician-select" class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
      <i class="fa fa-user-cog mr-1"></i>
      Asignar técnico:
    </label>
    <div class="relative">
      <i class="fa fa-users absolute left-3 top-3 text-gray-400"></i>
      <select
        id="technician-select"
        class="form-select w-full pl-10 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        bind:value={selectedTechnicianId}
      >
        <option value="">-- Sin técnico asignado --</option>
        {#each technicians as t}
          <option value={t.id}>
            {t.name} ({t.username})
          </option>
        {/each}
      </select>
    </div>
    {#if technicianError}
      <p class="text-red-600 mb-2 text-center font-semibold">
        <i class="fa fa-exclamation-circle mr-1"></i>{technicianError}
      </p>
    {/if}
    {#if selectedTechnicianId}
      <div class="bg-blue-50 border border-blue-300 rounded-lg p-2 mt-2 animate-fade-in flex items-center justify-between dark:bg-gray-700"> 
        <span class="text-blue-900 text-sm dark:text-blue-300 flex items-center">
          <i class="fa fa-user-check mr-1"></i>
          Técnico seleccionado:
          <strong class="ml-1">
            {#if technicians.length}
              {#each technicians.filter(t => String(t.id) === selectedTechnicianId) as t}
                {t.name} ({t.username})
              {/each}
            {/if}
          </strong>
        </span>
        <button type="button" class="ml-2 text-xs text-blue-600 hover:underline dark:text-blue-300 flex items-center" on:click={resetTecnico}>
          <i class="fa fa-times-circle mr-1"></i>Quitar
        </button>
      </div>
    {/if}
  </div>

  {#if error}
    <p class="text-red-600 mb-4 text-center font-semibold">
      <i class="fa fa-exclamation-circle mr-1"></i>{error}
    </p>
  {/if}
  <div class="flex justify-end mt-6">
    <button
      on:click={handleCreateTicket}
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150 disabled:opacity-60 flex items-center"
      disabled={loading || !initialStateDescription || !selectedTechnicianId}
    >
      {#if loading}
        <i class="fa fa-spinner fa-spin mr-2"></i>Creando...
      {:else}
        <i class="fa fa-plus mr-2"></i>Crear ticket
      {/if}
    </button>
  </div>
</div>