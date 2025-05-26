<script>
    import { step } from '$lib/stores/stepStore';
    import { wizardData } from '$lib/stores/wizardStore';
    import { get } from 'svelte/store';
    import { registerTicket } from '$lib/api/apiTickets';

    let initialStateDescription = '';
    let loading = false;
    let error = '';

    const handleCreateTicket = async () => {
        loading = true;
        error = '';
        try {
            const { deviceId } = get(wizardData);
            const ticketId = await registerTicket({
                deviceId,
                initialStateDescription
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

<div class="p-8 rounded-2xl shadow-xl bg-white max-w-lg mx-auto mt-8 border border-gray-100">
  <h2 class="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">Estado del dispositivo</h2>
  <textarea
    bind:value={initialStateDescription}
    rows="5"
    class="form-textarea w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    placeholder="Ej. No enciende, pantalla rota, etc."
    required
  ></textarea>
  {#if error}
    <p class="text-red-600 mb-4 text-center font-semibold">{error}</p>
  {/if}
  <div class="flex justify-end">
    <button
      on:click={handleCreateTicket}
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150 disabled:opacity-60"
      disabled={loading || !initialStateDescription}
    >
      {loading ? 'Creando...' : 'Crear ticket'}
    </button>
  </div>
</div>