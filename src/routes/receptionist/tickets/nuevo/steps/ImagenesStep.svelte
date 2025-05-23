<script>
    import { wizardData } from '$lib/stores/wizardStore';
    import { step } from '$lib/stores/stepStore';
    import { uploadDeviceImages } from '$lib/api/apiRecepcion';
    import { get } from 'svelte/store';

    let files = [];
    let uploaded = false;
    let loading = false;
    let error = '';

    const handleUpload = async () => {
        loading = true;
        error = '';
        try {
            const { ticketId } = get(wizardData);
            const urls = await uploadDeviceImages(ticketId, files);
            uploaded = true;
            wizardData.update((s) => ({ ...s, deviceImages: urls }));
            step.set(5); // Avanza al paso 5
        } catch (e) {
            error = 'Error al subir imágenes.';
        } finally {
            loading = false;
        }
    };
</script>

<div class="p-8 rounded-2xl shadow-xl bg-white max-w-lg mx-auto mt-8 border border-gray-100">
  <h2 class="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">Imágenes del dispositivo</h2>
  <label class="block mb-4">
    <span class="block text-gray-700 mb-1 font-semibold">Selecciona imágenes</span>
    <input
      type="file"
      multiple
      accept="image/*"
      on:change={(e) => (files = Array.from(e.target.files))}
      class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100
        cursor-pointer"
    />
  </label>
  {#if error}
    <p class="text-red-600 mb-4 text-center font-semibold">{error}</p>
  {/if}
  <div class="flex justify-end gap-2">
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150 disabled:opacity-60 w-full sm:w-auto"
      on:click={handleUpload}
      disabled={loading || files.length === 0 || uploaded}
    >
      {loading ? 'Subiendo...' : uploaded ? 'Imágenes subidas' : 'Subir imágenes'}
    </button>
    {#if files.length === 0}
      <button
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150 w-full sm:w-auto"
        on:click={() => step.set(5)}
        disabled={loading}
        type="button"
      >
        Omitir
      </button>
    {/if}
  </div>
  {#if files.length > 0}
    <ul class="mt-4 space-y-1 text-gray-600 text-sm">
      {#each files as file}
        <li class="truncate">📷 {file.name}</li>
      {/each}
    </ul>
  {/if}
</div>