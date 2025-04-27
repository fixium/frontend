<script lang="ts">
  import {
    pairDevice,
    unpairDevice,
    fetchDeviceInfo,
    restartDevice,
    shutdownDevice,
    fetchDeviceLogs,
    enterRecoveryMode,
    exitRecoveryMode,
    getLatestFirmware
  } from '$lib/apiLocal';
  import Message from '$lib/components/Message.svelte';
  import { onMount } from 'svelte';

  // Estados generales
  let loading = false;
  let loadingMessage = '';
  let successMessage = '';
  let errorMessage = '';
  let deviceInfo: any = null;
  let firmwareInfo: any = null;
  let error: string = '';
  let isPaired = false;
  let showFirmwareModal = false;
  let logsExtracted = false; // Estado para indicar si los logs se extrajeron correctamente
  let showLogsModal = false; // Estado para controlar el modal de logs

  // Timeouts para mensajes
  let successTimeout: number | null = null;
  let errorTimeout: number | null = null;

  // Funciones para mostrar mensajes
  function showSuccessMessage(message: string) {
    successMessage = message;
    if (successTimeout) clearTimeout(successTimeout);
    successTimeout = setTimeout(() => (successMessage = ''), 5000);
  }

  function showErrorMessage(message: string) {
    errorMessage = message;
    if (errorTimeout) clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => (errorMessage = ''), 5000);
  }

  // Función genérica para llamadas asíncronas
  async function call(fn: () => Promise<any>, message: string = 'Procesando...') {
    errorMessage = '';
    successMessage = '';
    loading = true;
    loadingMessage = message;
    try {
      const result = await fn();
      console.log(result);
      if (result?.message) showSuccessMessage(result.message);
    } catch (err) {
      showErrorMessage(err.message || 'Ocurrió un error inesperado');
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  // Funciones específicas
  async function pairAndFetchInfo() {
    await call(pairDevice, 'Emparejando dispositivo...');
    if (!error) {
      isPaired = true;
    }
    fetchDeviceInformation();
  }

  async function fetchDeviceInformation() {
    try {
      const info = await fetchDeviceInfo();
      deviceInfo = { ...info };
      isPaired = true;
    } catch (err) {
      isPaired = false;
      error = 'El dispositivo no está emparejado. Por favor, empareje el dispositivo.';
      deviceInfo = null;
    }
  }

  async function openFirmwareModal() {
    showFirmwareModal = true;
    loading = true;
    loadingMessage = 'Consultando el último firmware...';
    try {
      firmwareInfo = await getLatestFirmware();
    } catch (err) {
      showErrorMessage(err.message || 'Error al consultar el firmware');
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  function downloadFirmware() {
    if (firmwareInfo?.url) {
      window.location.href = firmwareInfo.url;
    }
  }

  // Función para abrir el modal de logs y verificar si se pudieron extraer
  async function openLogsModal() {
    showLogsModal = true;
    loading = true;
    loadingMessage = 'Verificando disponibilidad de logs...';
    try {
      const response = await fetch('http://127.0.0.1:8081/device-api/device/extract-logs', { method: 'HEAD' });
      if (response.ok) {
        logsExtracted = true;
        showSuccessMessage('Los logs están disponibles para descargar.');
      } else if (response.status === 404) {
        logsExtracted = false;
        showErrorMessage('No se encontraron logs disponibles en el dispositivo.');
      } else {
        logsExtracted = false;
        showErrorMessage('Error al verificar los logs. Intente nuevamente.');
      }
    } catch (err) {
      logsExtracted = false;
      showErrorMessage(err.message || 'Error al verificar los logs.');
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  // Función para descargar los logs
  async function downloadLogs() {
    loading = true;
    loadingMessage = 'Descargando logs...';
    try {
      await fetchDeviceLogs(); // Llama al método actualizado en apiLocal.js
      showSuccessMessage('Logs descargados correctamente.');
    } catch (err) {
      showErrorMessage(err.message || 'Error al descargar los logs.');
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  // Montaje inicial
  onMount(async () => {
    await fetchDeviceInformation();
  });
</script>

<div class="flex min-h-screen bg-gray-50 p-6">
  <!-- Contenido principal -->
  <div class="w-full space-y-8">

    <!-- Acciones Básicas -->
    <section class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Acciones Básicas
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button on:click={pairAndFetchInfo} class="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Emparejar
        </button>
        <button on:click={() => call(unpairDevice, "Desemparejando dispositivo...")} class="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Desemparejar
        </button>
        <button on:click={() => call(restartDevice, "Reiniciando dispositivo...")} class="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Reiniciar
        </button>
        <button on:click={() => call(shutdownDevice, "Apagando dispositivo...")} class="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          Apagar
        </button>
      </div>
    </section>

    <!-- Modo Recovery -->
    <section class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Modo Recovery
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button on:click={() => call(enterRecoveryMode, "Entrando a modo recovery...")} class="bg-indigo-600 text-white py-3 px-2 sm:px-4 rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Entrar Recovery
        </button>
        <button on:click={() => call(exitRecoveryMode, "Saliendo de modo recovery...")} class="bg-teal-600 text-white py-3 px-2 sm:px-4 rounded-lg hover:bg-teal-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Salir Recovery
        </button>
      </div>
    </section>

    <!-- Logs y Firmware -->
    <section class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" /></svg>
        Logs y Firmware
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button on:click={openLogsModal} class="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold w-full shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" /></svg>
          Extraer logs
        </button>
        <button on:click={openFirmwareModal} class="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold w-full shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" /></svg>
          Consultar Último Firmware
        </button>
      </div>
    </section>
  </div>

    <!-- Panel lateral -->
    <div class="hidden md:block ml-8 w-72 bg-white shadow-lg rounded-lg p-6 sticky top-6 max-h-[500px] overflow-y-auto">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01" />
        </svg>
        Información del Dispositivo
      </h2>
      {#if isPaired && deviceInfo}
        <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
          <div><strong>Nombre:</strong> {deviceInfo.DeviceName}</div>
          <div><strong>Modelo:</strong> {deviceInfo.ProductType}</div>
          <div><strong>IMEI:</strong> {deviceInfo.InternationalMobileEquipmentIdentity}</div>
          <div><strong>Versión:</strong> {deviceInfo.ProductVersion}</div>
          <div><strong>Build:</strong> {deviceInfo.BuildVersion}</div>
          <div><strong>Baseband:</strong> {deviceInfo.BasebandVersion}</div>
          <div><strong>Serial:</strong> {deviceInfo.SerialNumber}</div>
          <div><strong>Modelo HW:</strong> {deviceInfo.HardwareModel}</div>
          <div><strong>Firmware:</strong> {deviceInfo.FirmwareVersion}</div>
        </div>
      {:else}
        <p class="text-sm text-gray-700">No hay información disponible.</p>
        <br>
        <p class="text-sm text-red-600">{error}</p>
      {/if}
    </div>

  <!-- Carga -->
  {#if loading}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 8v4m4-4h4m-8 0H4m16-4a8 8 0 11-16 0 8 8 0 0116 0z" />
        </svg>
        <p class="text-gray-800 font-semibold">{loadingMessage}</p>
      </div>
    </div>
  {/if}

  <!-- Modal de Firmware -->
  {#if showFirmwareModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" />
          </svg>
          Último Firmware
        </h2>
        {#if loading}
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 8v4m4-4h4m-8 0H4m16-4a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
            <p class="text-gray-800 font-semibold">{loadingMessage}</p>
          </div>
        {:else if firmwareInfo}
          <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
            <div><strong>Versión:</strong> {firmwareInfo.version}</div>
            <div><strong>Build ID:</strong> {firmwareInfo.buildid}</div>
            <div><strong>Fecha de lanzamiento:</strong> {new Date(firmwareInfo.releasedate).toLocaleString()}</div>
          </div>
          <button on:click={downloadFirmware} class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Descargar Firmware
          </button>
        {/if}
        <button on:click={() => (showFirmwareModal = false)} class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cerrar
        </button>
      </div>
    </div>
  {/if}

  <!-- Modal de Logs -->
  {#if showLogsModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" />
        </svg>
        Logs del Dispositivo
      </h2>
      {#if loading}
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 8v4m4-4h4m-8 0H4m16-4a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
          <p class="text-gray-800 font-semibold">{loadingMessage}</p>
        </div>
      {:else if logsExtracted}
        <p class="text-gray-700 mb-4">Los logs están listos para descargar. ¿Desea descargarlos?</p>
        <button on:click={downloadLogs} class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Descargar Logs
        </button>
      {:else}
        <p class="text-red-700 mb-4">No se pudieron extraer los logs. <br><br>{errorMessage}</p>
      {/if}
      <button on:click={() => showLogsModal = false} class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Cerrar
      </button>
    </div>
  </div>
  {/if}

  <!-- Mensajes -->
  {#if successMessage}
    <Message type="success" message={successMessage} onClose={() => (successMessage = '')} />
  {/if}
  {#if errorMessage}
    <Message type="error" message={errorMessage} onClose={() => (errorMessage = '')} />
  {/if}
</div>