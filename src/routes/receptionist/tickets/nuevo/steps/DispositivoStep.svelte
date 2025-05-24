<script>
  import { wizardData } from '$lib/stores/wizardStore';
  import { step } from '$lib/stores/stepStore';
  import { get } from 'svelte/store';
  import { registerDevice } from '$lib/api/apiRecepcion';
	import { onMount } from 'svelte';
	import { validatePhoneNumber } from '$lib/utils/validation';
  import { fetchDevices } from '$lib/api/devices';

  let serialNumber = '';
  let imei = '';
  let model = '';
  let color = '';
  let notes = '';

  let isNewClient = false;

  $: {
    const data = get(wizardData);
    isNewClient = !!data.isNewClient;
    if (isNewClient) {
      selectedDeviceId = 'nuevo';
      showNewForm = true;
    }
  };

  let loading = false;
  let error = null;

  onMount(async () => {
    const { clientId } = get(wizardData);
    try {
      devices = await fetchDevices(clientId);
    } catch (err) {
      error = err.message;
    }
  });

  let devices = [];
  let selectedDeviceId = '';
  let showNewForm = false;

  const submit = async () => {
    const { clientId } = get(wizardData);
    if (!clientId) {
      error = 'No hay cliente registrado.';
      return;
    }

    loading = true;
    error = null;

    try {
      let deviceId;
      if (selectedDeviceId && selectedDeviceId !== 'nuevo') {
        // Seleccionó un dispositivo existente
        deviceId = selectedDeviceId;
      } else {
        // Registrar nuevo dispositivo
        deviceId = await registerDevice({
          clientId,
          serialNumber,
          imei,
          model,
          color,
          notes
        });
      }
      wizardData.update((data) => ({ ...data, deviceId }));

      step.set(3); // Avanza al paso 3
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  };
</script>

<div class="p-8 rounded-2xl shadow-xl bg-white max-w-lg mx-auto mt-8 border border-gray-100">
  <h2 class="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">Registrar dispositivo</h2>

  {#if error}
    <p class="text-red-600 mb-4 text-center font-semibold">{error}</p>
  {/if}

  <form on:submit|preventDefault={submit} class="space-y-4">
    {#if !isNewClient}
      <label for="device-select" class="block font-semibold mb-1">Selecciona un dispositivo existente:</label>
      <select
        id="device-select"
        class="form-select w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={selectedDeviceId}
        on:change={() => showNewForm = selectedDeviceId === 'nuevo'}
        required
        disabled={isNewClient}
      >
        <option value="" disabled selected>Selecciona un dispositivo... (IMEI - Modelo)</option>
        {#each devices as d}
          <option value={d.id}>{d.imei} - {d.model}</option>
        {/each}
        <option value="nuevo">Registrar nuevo dispositivo</option>
      </select>
    {/if}

    {#if showNewForm || selectedDeviceId === 'nuevo'}
      <input type="text" bind:value={serialNumber} placeholder="Número de serie" class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      <input type="text" bind:value={imei} on:input={(e) => imei = validatePhoneNumber(e.target.value)} placeholder="IMEI" class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      <input type="text" bind:value={model} placeholder="Modelo" class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      <input type="text" bind:value={color} placeholder="Color" class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      <textarea bind:value={notes} placeholder="Notas (opcional)" class="form-textarea w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
    {/if}

    <div class="flex justify-end">
      <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150 disabled:opacity-60" disabled={loading}>
        {#if loading}Registrando...{/if}
        {#if !loading}Siguiente →{/if}
      </button>
    </div>
  </form>
</div>