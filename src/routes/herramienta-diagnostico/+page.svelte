<script lang="ts">
  import {
    pairDevice,
    unpairDevice,
    fetchDeviceInfo,
    enterRecoveryMode,
    exitRecoveryMode,
    getLatestFirmware
  } from '$lib/apiLocal';
  import Message from '$lib/components/Message.svelte';
  import { onMount } from 'svelte';

  let loading = false;
  let loadingMessage = '';

  let successMessage = '';
  let errorMessage = '';
  let successTimeout: number | null = null;
  let errorTimeout: number | null = null;

  // Función para mostrar el mensaje de éxito temporalmente
  function showSuccessMessage(message: string) {
    successMessage = message;
    if (successTimeout) clearTimeout(successTimeout);
    successTimeout = setTimeout(() => {
      successMessage = '';
    }, 5000); // Oculta el mensaje después de 5 segundos
  }

  // Función para mostrar el mensaje de error temporalmente
  function showErrorMessage(message: string) {
    errorMessage = message;
    if (errorTimeout) clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
      errorMessage = '';
    }, 5000); // Oculta el mensaje después de 5 segundos
  }

  let deviceInfo: any = null;
  let firmwareInfo: any = null;
  let error: string = '';
  let isPaired = false; // Estado para controlar si el dispositivo está emparejado
  let showFirmwareModal = false; // Estado para controlar el modal de firmware

  async function call(fn: () => Promise<any>, message: string = 'Procesando...') {
    errorMessage = '';
    successMessage = '';
    loading = true;
    loadingMessage = message;
    try {
      const result = await fn();
      console.log(result);
      if (result?.message) {
        showSuccessMessage(result.message); // Muestra el mensaje de éxito
      }
    } catch (err) {
      showErrorMessage(err.message || 'Ocurrió un error inesperado'); // Muestra el mensaje de error
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  async function pairAndFetchInfo() {
    await call(pairDevice);
    if (!error) {
      isPaired = true;
      deviceInfo = await fetchDeviceInfo();
    }
  }

  async function fetchDeviceInformation() {
    try {
      deviceInfo = await fetchDeviceInfo();
      isPaired = true;
    } catch (err) {
      isPaired = false;
      error = 'El dispositivo no está emparejado. Por favor, empareje el dispositivo.';
    }
  }

  onMount(async () => {
    await fetchDeviceInformation();
  });

  // Función para abrir el modal de firmware
  async function openFirmwareModal() {
    showFirmwareModal = true;
    firmwareInfo = await getLatestFirmware();
  }

  // Función para descargar el firmware
  function downloadFirmware() {
    if (firmwareInfo?.url) {
      window.location.href = firmwareInfo.url; // Descarga el archivo sin exponer el enlace
    }
  }
</script>

<div class="flex min-h-screen bg-gray-50 p-6">
  <!-- Contenido principal -->
  <div class="w-full space-y-8">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Herramientas de Diagnóstico</h1>

    <!-- Acciones Básicas --> 
    <section class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Acciones Básicas
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button on:click={pairAndFetchInfo} class="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Emparejar
        </button>
        <button on:click={() => call(unpairDevice)} class="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          Desemparejar
        </button>
      </div>
    </section>

    <!-- Modo Recovery y Gestión de Respaldo -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Modo Recovery -->
        <section class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Modo Recovery
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <!-- Botones "Entrar Recovery" y "Salir Recovery" con ancho reducido -->
            <button on:click={() => call(enterRecoveryMode)} class="bg-indigo-600 text-white py-3 px-2 sm:px-4 rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Entrar Recovery
            </button>
            <button on:click={() => call(exitRecoveryMode)} class="bg-teal-600 text-white py-3 px-2 sm:px-4 rounded-lg hover:bg-teal-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Salir Recovery
            </button>
          </div>
        </section>
    </div>

    <!-- Firmware -->
    <section class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" /></svg>
        Firmware
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button on:click={openFirmwareModal} class="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold w-full shadow-md flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" /></svg>
          Consultar Último Firmware
        </button>
      </div>
    </section>
  </div>

  <!-- Panel lateral con información del dispositivo -->
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
      <p class="text-sm text-gray-700">No hay dispositivos conectados.</p>
    {/if}
  </div>

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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" /></svg>
          Último Firmware
        </h2>
        {#if firmwareInfo}
          <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
            <div><strong>Versión:</strong> {firmwareInfo.version}</div>
            <div><strong>Build ID:</strong> {firmwareInfo.buildid}</div>
            <div><strong>Fecha de lanzamiento:</strong> {new Date(firmwareInfo.releasedate).toLocaleString()}</div>
          </div>
          <button on:click={downloadFirmware} class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>
            Descargar Firmware
          </button>
        {/if}
        <button on:click={() => showFirmwareModal = false} class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          Cerrar
        </button>
      </div>
    </div>
  {/if}

  <!-- Mensaje de éxito -->
{#if successMessage}
<Message
  type="success"
  message={successMessage}
  onClose={() => (successMessage = '')}
/>
{/if}

<!-- Mensaje de error -->
{#if errorMessage}
<Message
  type="error"
  message={errorMessage}
  onClose={() => (errorMessage = '')}
/>
{/if}
</div>