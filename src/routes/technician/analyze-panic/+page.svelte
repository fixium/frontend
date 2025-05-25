<script lang="ts">
  let logContent = '';
  let respuesta = '';
  let isLoading = false;
  let error = '';

  async function enviarLog() {
    if (!logContent.trim()) return;
    isLoading = true;
    respuesta = '';
    error = '';
    try {
      const res = await fetch('http://localhost:8080/api/chat/analyze-panic-log', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: logContent,
        credentials: "include"
      });
      if (!res.ok) {
        throw new Error('Error al analizar el log');
      }
      const resTemp = await res.json();
      respuesta = resTemp.choices?.[0]?.message?.content
    } catch (e) {
      error = 'No se pudo analizar el log. Intenta de nuevo.';
    } finally {
      isLoading = false;
    }
  }
</script>

<main class="flex items-start justify-center py-8">
  <div class="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl border border-blue-100">
    <h1 class="text-3xl font-extrabold text-blue-700 mb-4 flex items-center gap-2">
      <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      Analizador de Panic Full Log
    </h1>
    <label class="font-semibold mb-2 block text-gray-700">Pega aquí el contenido del archivo <code class="bg-blue-100 px-1 rounded text-blue-700">panic-full.ips</code>:</label>
    <textarea
      bind:value={logContent}
      rows="12"
      class="w-full p-3 border-2 border-blue-200 focus:border-blue-500 rounded-lg resize-y font-mono bg-blue-50 focus:bg-white transition-colors duration-200 outline-none"
      placeholder="Pega aquí el contenido del log..."
      disabled={isLoading}
    ></textarea>
    <div class="flex justify-end mt-4">
      <button
        class="bg-blue-600 hover:bg-blue-700 transition-colors duration-150 text-white px-6 py-2 rounded-lg font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        on:click={enviarLog}
        disabled={isLoading || !logContent.trim()}
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
          Respuesta:
        </h2>
        <pre class="bg-white p-3 rounded-lg whitespace-pre-wrap text-gray-800 font-mono text-sm overflow-x-auto">{respuesta}</pre>
      </div>
    {/if}
  </div>
</main>