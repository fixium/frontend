<script>
  import { analyzePanicLog } from "$lib/api/main-backend-requests/ai";
  let logContent = '';
  let respuesta = '';
  let isLoading = false;
  let error = '';
  let file = null;
  let useFile = false;

  let isDragActive = false;

  function handleDragOver(event) {
    event.preventDefault();
    isDragActive = true;
  }

  function handleDragLeave(event) {
    event.preventDefault();
    isDragActive = false;
  }

  function handleDrop(event) {
    event.preventDefault();
    isDragActive = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        file = droppedFile;
        error = '';
      } else {
        file = null;
        error = 'Solo se permiten archivos de texto (.txt o .ips) y máximo 5 MB.';
      }
    }
  }
  
  async function enviarLog() {
    if (!useFile && !logContent.trim()) return;
    if (useFile && !file) return;

    // Validación extra antes de enviar
    if (useFile && !isValidFile(file)) {
      error = 'Solo se permiten archivos de texto (.txt o .ips) y máximo 5 MB.';
      return;
    }

    isLoading = true;
    respuesta = '';
    error = '';

    try {
      const resTemp = await analyzePanicLog({
        logContent: useFile ? '' : logContent,
        file: useFile ? file : null
      });
      respuesta = resTemp.choices?.[0]?.message?.content || 'El log es demasiado largo y no se pudo procesar completamente. Intenta con un log más corto o revisa el contenido manualmente.';
    } catch (e) {
      error = e.message || 'Ocurrió un error al procesar el log';
    } finally {
      isLoading = false;
    }
  }

  function isValidFile(file) {
    if (!file) return false;
    const validExtensions = ['.txt', '.ips'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    // Algunos navegadores pueden no establecer correctamente el type para .ips, así que solo validamos extensión
    return hasValidExtension && file.size <= 5 * 1024 * 1024;
  }

</script>

<main class="flex items-start justify-center py-8">
  <div class="relative  shadow-xl rounded-xl p-8 w-full max-w-2xl border border-blue-100">
    <h1 class="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
      <svg class="w-8 h-8 text-blue-500 " fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      Analizador de Panic Full con IA
    </h1>
    <div class="mb-4 flex gap-4">
      <label class="flex items-center gap-2 cursor-pointer select-none text-dark dark:text-white">
        <input
          type="radio"
          bind:group={useFile}
          value={false}
          class="peer sr-only"
        />
        <span
          class="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center
          peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-colors duration-150 "
        >
          <span
            class="w-2.5 h-2.5 rounded-full bg-white peer-checked:bg-white peer-checked:shadow-[0_0_0_4px_rgba(37,99,235,0.5)] transition-all duration-150 "
          ></span>
        </span>
        Pegar texto
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none text-dark dark:text-white">
        <input
          type="radio"
          bind:group={useFile}
          value={true}
          class="peer sr-only"
        />
        <span
          class="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center
          peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-colors duration-150"
        >
          <span
            class="w-2.5 h-2.5 rounded-full bg-white peer-checked:bg-white peer-checked:shadow-[0_0_0_4px_rgba(37,99,235,0.5)] transition-all duration-150"
          ></span>
        </span>
        Subir archivo
      </label>
    </div>
    {#if !useFile}
      <label for="logContent" class="font-semibold mb-2 block text-gray-700 dark:text-gray-300">Pega aquí el contenido del archivo <code class="bg-blue-100 px-1 rounded text-blue-700">panic-full.ips</code>:</label>
      <textarea
        id="logContent"
        bind:value={logContent}
        rows="12"
        class="w-full p-3 border-2 border-blue-200 focus:border-blue-500 rounded-lg resize-y font-mono bg-blue-50 focus:bg-white dark:bg-gray-300 dark:text-gray-300 dark:focus:bg-gray-800 transition-colors duration-200 outline-none"
        placeholder="Pega aquí el contenido del log..."
        disabled={isLoading}
      ></textarea>
    {:else}
      <label for="fileInput" class="font-semibold mb-2 block text-gray-700">Selecciona el archivo <code class="bg-blue-100 px-1 rounded text-blue-700">panic-full.ips</code>:</label>
        <div class="flex items-center gap-4">
          <label
            class="flex flex-col items-center px-6 py-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer transition-colors duration-200 w-full max-w-xs
            hover:bg-blue-100
            {isDragActive ? 'border-blue-500 bg-blue-100' : ''}"
            on:dragover={handleDragOver}
            on:dragleave={handleDragLeave}
            on:drop={handleDrop}
            for="fileInput"
          >
            <svg class="w-8 h-8 text-blue-400 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16v-4a4 4 0 018 0v4M12 12v8m0 0l-3-3m3 3l3-3" />
            </svg>
            <span class="text-blue-700 font-medium mb-1">
              {isDragActive ? 'Suelta el archivo aquí' : 'Haz clic o arrastra el archivo aquí'}
            </span>
            <span class="text-xs text-gray-500">.ips o .txt</span>
            <input
              id="fileInput"
              type="file"
              accept=".ips,.txt"
              on:change={e => file = e.target.files[0]}
              disabled={isLoading}
              class="hidden"
            />
          </label>
          {#if file}
            <span class="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
          {/if}
        </div>
    {/if}
    {#if useFile && file}
      <div class="text-sm text-gray-500 mt-2">
        {#if file.size > 5 * 1024 * 1024}
          El archivo es demasiado grande. Máximo 5 MB.
        {:else if file.type !== 'text/plain'}
          Solo se permiten archivos de texto (.txt o .ips).
        {:else}
          Archivo válido.
        {/if}
      </div>
    {/if}
    <div class="flex justify-end mt-4">
      <button
        class="bg-blue-600 hover:bg-blue-700 transition-colors duration-150 text-white px-6 py-2 rounded-lg font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        on:click={enviarLog}
        disabled={isLoading || (!useFile && !logContent.trim()) || (useFile && !file)}
      >
        {#if isLoading}
          <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Analizando...
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Enviar
        {/if}
      </button>
    </div>
    {#if error}
      <div class="text-red-700 bg-red-100 border border-red-200 rounded p-3 mt-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414-1.414M5.636 5.636l1.414 1.414M17.657 17.657l1.414-1.414M12 8v4m0 4h.01" />
        </svg>
        {error}
      </div>
    {/if}
    {#if respuesta}
      <div class="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 shadow-inner">
        <h2 class="font-semibold mb-2 text-green-700 flex items-center gap-2">
          <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Posibles causas encontradas:
        </h2>
        <pre class="bg-white p-3 rounded-lg whitespace-pre-wrap text-gray-800 font-mono text-sm overflow-x-auto">{respuesta}</pre>
      </div>
    {/if}
     {#if isLoading}
      <div class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20 rounded-xl">
        <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span class="text-blue-700 font-bold text-lg">Analizando, por favor espera...</span>
      </div>
    {/if}
  </div>
</main>