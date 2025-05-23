<script>
  import { wizardData } from '$lib/stores/wizardStore';
  import { registerClient } from '$lib/api/apiRecepcion';
  import { step } from '$lib/stores/stepStore';
  import { onMount } from 'svelte';
  import { validatePhoneNumber } from '$lib/utils/validation';

  let clients = [];
  let selectedClientId = '';
  let name = '';
  let phone = '';
  let email = '';
  let notes = '';

  let loading = false;
  let error = null;

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/clients', { credentials: 'include' });
      if (!res.ok) throw new Error('Error al obtener clientes');
      clients = await res.json();
    } catch (err) {
      error = err.message;
    }
  });

  const submit = async () => {
    loading = true;
    error = null;

    try {
      if (selectedClientId && selectedClientId !== 'new') {
        wizardData.update((data) => ({ ...data, clientId: Number(selectedClientId) }));
        step.set(2);
      } else {
        const clientId = await registerClient({ name, phone, email, notes });
        wizardData.update((data) => ({ ...data, clientId, isNewClient: true }));
        step.set(2);
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };
</script>

<div class="p-8 rounded-2xl shadow-xl bg-white max-w-lg mx-auto mt-8 border border-gray-100">
  <h2 class="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">Registrar cliente</h2>

  {#if error}
    <p class="text-red-600 mb-4 text-center font-semibold">{error}</p>
  {/if}

  <form on:submit|preventDefault={submit} class="space-y-5">
    <div>
      <label for="client-select" class="block mb-2 font-semibold text-gray-700">Selecciona un cliente existente o registra uno nuevo:</label>
      <select
        id="client-select"
        class="form-select w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        bind:value={selectedClientId}
        required
        on:change={() => {
          if (selectedClientId !== 'new' && selectedClientId) {
            const c = clients.find(c => c.id === Number(selectedClientId));
            name = c?.name ?? '';
            phone = c?.phone ?? '';
            email = c?.email ?? '';
            notes = c?.notes ?? '';
          } else {
            name = '';
            phone = '';
            email = '';
            notes = '';
          }
        }}
      >
        <option value="" disabled selected>Selecciona un cliente... (Email - Teléfono)</option>
        {#each clients as c}
          <option value={c.id}>{c.email} ({c.phone})</option>
        {/each}
        <option value="new">Registrar nuevo cliente</option>
      </select>
    </div>

    {#if selectedClientId === 'new'}
      <div class="space-y-3">
        <input
          type="text"
          bind:value={name}
          placeholder="Nombre completo"
          class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="tel"
          bind:value={phone}
          placeholder="Teléfono"
          class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          on:input={(e) => phone = validatePhoneNumber(e.target.value)}
        />
        <input
          type="email"
          bind:value={email}
          placeholder="Correo electrónico"
          class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          bind:value={notes}
          placeholder="Notas (opcional)"
          class="form-textarea w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>
      </div>
    {/if}

    <div class="flex justify-end">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150 disabled:opacity-60"
        disabled={loading}
      >
        {#if loading}Procesando...{/if}
        {#if !loading}Siguiente →{/if}
      </button>
    </div>
  </form>
</div>