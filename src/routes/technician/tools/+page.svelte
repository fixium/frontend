<script lang="ts">
  import {
    pairDevice,
    unpairDevice,
    fetchDeviceInfo,
    restartDevice,
    shutdownDevice,
    activateDevice,
    fetchDeviceLogs,
    enterRecoveryMode,
    exitRecoveryMode,
    createDeviceBackup,
    restoreDeviceBackup,
    getSignedFirmwares,
    restoreDeviceWithIPSW
  } from '$lib/api/local-backend-requests/apiLocal';
  import Message from '$lib/components/Message.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import { onMount } from 'svelte';

  // Estados generales
  let loading = false;
  let loadingMessage = '';
  let successMessage = '';
  let errorMessage = '';
  let error: string = '';

  // Estados del dispositivo
  let deviceInfo: any = null;
  let isPaired = false;

  // Estados de backups
  let selectedFolder: string | null = null;
  let backupPath = '';

  // Estados de firmware
  interface Firmware {
    version: string;
    buildid: string;
    releasedate: string;
    url: string;
  }

  let firmwareList: Firmware[] = null;
  let showFirmwareModal = false;
  let selectedIpsw: string | null = null;
  let ipswPath = '';

  // Estados de progreso
  let progress = 0;
  let showProgressBar = false;

  // Timeouts para mensajes
  let successTimeout: any | null = null;
  let errorTimeout: any | null = null;


  onMount(() => {
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
      });
    });
  });
  // Funciones generales
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

  async function call(fn: () => Promise<any>, message: string = 'Procesando...') {
    errorMessage = '';
    successMessage = '';
    loading = true;
    loadingMessage = message;
    try {
      const result = await fn();
      if (result?.status_code === 200 || result?.status === 200) {
        showSuccessMessage(result?.detail || result?.message || 'Operación exitosa');
      } else {
        const errorDetail = result?.detail || 'Error inesperado';
        showErrorMessage(errorDetail);
      }
    } catch (err) {
      showErrorMessage(err.message || 'Ocurrió un error inesperado');
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  // Gestión de dispositivo
  async function pairAndFetchInfo() {
    await call(pairDevice, 'Emparejando dispositivo...');
    if (!error) {
      isPaired = true;
      fetchDeviceInformation();
    }
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

  // Gestión de backups
  async function selectFolder() {
    try {
      backupPath = await window.electron.openFolderDialog();
      selectedFolder = backupPath
        ? `Carpeta seleccionada: ${backupPath}`
        : 'No se seleccionó ninguna carpeta.';
    } catch {
      selectedFolder = 'Error al seleccionar carpeta.';
    }
  }

  async function createBackup() {
    if (!backupPath) {
      showErrorMessage('Por favor, seleccione una carpeta para guardar el respaldo.');
      return;
    }
    await call(() => createDeviceBackup(backupPath), 'Creando backup...');
    backupPath = null;
    selectedFolder = null;
  }

  async function restoreBackup() {
    if (!backupPath) {
      showErrorMessage('Por favor, seleccione una carpeta para restaurar el respaldo.');
      return;
    }
    await call(() => restoreDeviceBackup(backupPath), 'Restaurando respaldo...');
    backupPath = null;
    selectedFolder = null;
  }

  // Gestión de firmware
  async function selectFile() {
    try {
      ipswPath = await window.electron.openFileDialog();
      selectedIpsw = ipswPath
        ? `Archivo seleccionado: ${ipswPath.split('/').pop()}`
        : 'No se seleccionó ningún archivo.';
    } catch {
      selectedIpsw = 'Error al seleccionar el archivo.';
    }
  }

  async function restoreWithIPSW(ipswPath: string) {
    if (!ipswPath.trim()) {
      showErrorMessage('Por favor, seleccione un archivo IPSW.');
      return;
    }
    await call(() => restoreDeviceWithIPSW(ipswPath), 'Restaurando dispositivo...');
    ipswPath = null;
    selectedIpsw = null;
  }

  async function openFirmwareModal() {
    showFirmwareModal = true;
    loading = true;
    loadingMessage = 'Consultando el último firmware...';
    try {
      firmwareList = await getSignedFirmwares();
    } catch (err) {
      showErrorMessage(err.message || 'Error al consultar el firmware');
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  // Gestión de logs
  async function downloadLogs() {
    loading = true;
    loadingMessage = 'Verificando disponibilidad de logs...';
    try {
      await fetchDeviceLogs();
      showSuccessMessage('Logs descargados correctamente.');
    } catch (err) {
      showErrorMessage(err.message || 'Error al descargar los logs.');
    } finally {
      loading = false;
      loadingMessage = '';
    }
  }

  // Gestión de descargas
  async function startDownload(url: string) {
    showProgressBar = true;
    progress = 0;

    window.electron.onDownloadProgress((currentProgress: number) => {
      progress = currentProgress;
    });

    try {
      await window.electron.startDownload(url);
      if (progress === 1) {
        showSuccessMessage('Descarga completada');
      }
    } catch (err) {
      const errorMsg = err.message === 'Descarga cancelada'
        ? 'Descarga cancelada por el usuario'
        : 'Error al descargar el archivo';
      showErrorMessage(errorMsg);
    } finally {
      showProgressBar = false;
    }
  }

  function cancelDownload() {
    window.electron.cancelDownload();
    showProgressBar = false;
  }

  // Montaje inicial
  onMount(fetchDeviceInformation);
</script>

<!-- Mostrar la barra de progreso si está activa -->
{#if showProgressBar}
  <ProgressBar {progress} onCancel={cancelDownload} />
{/if}

<div class="flex min-h-screen  p-6">
  <!-- Contenido principal -->
  <div class="w-full space-y-8">

    <!-- Acciones Básicas -->
    <section class=" shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 text-black dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Acciones Básicas
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button on:click={pairAndFetchInfo} class="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 emparejar-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Emparejar
        </button>
        <button on:click={() => call(unpairDevice, "Desemparejando dispositivo...")} class="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 desemparejar-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Desemparejar
        </button>
        <button on:click={() => call(restartDevice, "Reiniciando dispositivo...")} class="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 reiniciar-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Reiniciar
        </button>
        <button on:click={() => call(shutdownDevice, "Apagando dispositivo...")} class="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 apagar-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          Apagar
        </button>
        <button on:click={() => call(activateDevice, "Intentando activar dispositivo...")} class="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 activar-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Activar dispositivo
        </button>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Modo Recovery -->
      <section class=" shadow-lg rounded-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 text-black dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Modo Recovery
        </h2>

        <!-- Botones en fila que llenan el contenedor -->
        <div class="flex gap-4">
          <button on:click={() => call(enterRecoveryMode, "Entrando a modo recovery...")} 
            class="bg-indigo-600 text-white py-3 px-4 rounded-lg flex-1 hover:bg-indigo-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 entrar-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Entrar Recovery
          </button>

          <button on:click={() => call(exitRecoveryMode, "Saliendo de modo recovery...")} 
            class="bg-teal-600 text-white py-3 px-4 rounded-lg flex-1 hover:bg-teal-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 salir-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Salir Recovery
          </button>
        </div>
      </section>
      
      <!-- Gestión de Respaldo -->
      <section class=" shadow-lg rounded-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 text-black dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
            Gestión de Respaldo <span class="text-red-600 dark:text-red-400 text-sm">(Compatible únicamente con iOS 13 o versiones anteriores)</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Botón para seleccionar carpeta -->
          <button
            class="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 seleccionar-btn"
            on:click={() => selectFolder()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6h6v6m-6 0H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4m-6 0v6" />
            </svg>
            Seleccionar Carpeta
          </button>
      
          <!-- Botón para crear backup -->
          <button
            class="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 crear-btn"
            on:click={createBackup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Crear Backup
          </button>
      
          <!-- Botón para restaurar backup -->
          <button
            class="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-2 restaurar-btn"
            on:click={restoreBackup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Restaurar Backup
          </button>
        </div>
        <!-- Mostrar la carpeta seleccionada -->
        {#if selectedFolder}
          <p class="mt-4 text-sm text-gray-700">{selectedFolder}</p>
        {/if}
      </section>
    </div>

    <!-- Gestión de Firmware -->
    <section class="shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 text-black dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" />
        </svg>
        Gestión de Firmwares
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Botón para seleccionar archivo -->
        <button
          class="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold shadow-md flex items-center justify-center gap-1 sm:w-auto select-btn"
          on:click={() => selectFile()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6h6v6m-6 0H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4m-6 0v6" />
          </svg>
          Seleccionar .ipsw
        </button>

        <!-- Botón "Restaurar con IPSW" -->
        <button
          on:click={() => restoreWithIPSW(ipswPath)}
          class="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all text-sm font-semibold w-full shadow-md flex items-center justify-center gap-2 restaurar-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Restaurar
        </button>

        <!-- Botón para consultar firmware -->
        <button
          on:click={openFirmwareModal}
          class="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold w-full shadow-md flex items-center justify-center gap-2 consultar-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" />
          </svg>
          Consultar Firmwares
        </button>
        <!-- Mostrar la carpeta seleccionada -->
        {#if selectedIpsw}
          <p class="mt-4 text-sm text-gray-700">{selectedIpsw}</p>
        {/if}
      </div>
    </section>

    <!-- Logs -->
    <section class="shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 text-black dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" />
        </svg>
        Logs
      </h2>
      <!-- Ajuste: Se usa col-span-2 para que el botón ocupe las dos columnas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          on:click={downloadLogs} 
          class="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all text-sm font-semibold w-full shadow-md flex items-center justify-center gap-2 sm:col-span-2 descargar-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z" />
          </svg>
          Extraer logs
        </button>
      </div>
    </section>
  </div>

    <!-- Panel lateral -->
  <div class="hidden md:block ml-7 w-72  shadow-lg rounded-lg p-6 sticky top-6 max-h-[670px] overflow-y-auto overflow-x-hidden">
    <h2 class="text-l font-bold text-gray-800 mb-4 flex items-center gap-2 text-black dark:text-white">
      <!-- Ícono móvil -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM12 18h.01" />
      </svg>
      Información del Dispositivo
    </h2>

    {#if isPaired && deviceInfo}
      <div class="grid grid-cols-1 gap-4 text-sm text-gray-700">
        
        <!-- Información principal -->
        <div class="space-y-1">
          <h3 class="text-xs font-semibold text-gray-500 uppercase mb-1 text-black dark:text-white">Datos principales</h3>
          {#if deviceInfo.DeviceName}<div class="break-words"><strong>Nombre:</strong> {deviceInfo.DeviceName}</div>{/if}
          {#if deviceInfo.DeviceClass}<div class="break-words"><strong>Clase:</strong> {deviceInfo.DeviceClass}</div>{/if}
          {#if deviceInfo.ProductType}<div class="break-words"><strong>Modelo:</strong> {deviceInfo.ProductType}</div>{/if}
          {#if deviceInfo.ModelNumber}<div class="break-words"><strong>Modelo N°:</strong> {deviceInfo.ModelNumber}</div>{/if}
          {#if deviceInfo.InternationalMobileEquipmentIdentity}<div class="break-words"><strong>IMEI:</strong> {deviceInfo.InternationalMobileEquipmentIdentity}</div>{/if}
          {#if deviceInfo.SerialNumber}<div class="break-words"><strong>Serial:</strong> {deviceInfo.SerialNumber}</div>{/if}
          {#if deviceInfo.UniqueDeviceID}<div class="break-words"><strong>UDID:</strong> {deviceInfo.UniqueDeviceID}</div>{/if}
          {#if deviceInfo.ProductVersion}<div class="break-words"><strong>iOS:</strong> {deviceInfo.ProductVersion}</div>{/if}
          {#if deviceInfo.ActivationState}<div class="break-words"><strong>Estado activación:</strong> {deviceInfo.ActivationState}</div>{/if}
        </div>

        <!-- Información avanzada colapsable -->
        <details>
          <summary class="cursor-pointer text-xs font-semibold text-gray-500 uppercase mb-1">Detalles avanzados</summary>
          <div class="mt-2 space-y-1">

            {#if deviceInfo.BuildVersion}<div class="break-words"><strong>Build:</strong> {deviceInfo.BuildVersion}</div>{/if}
            {#if deviceInfo.FirmwareVersion}<div class="break-words"><strong>Firmware:</strong> {deviceInfo.FirmwareVersion}</div>{/if}
            {#if deviceInfo.BasebandVersion}<div class="break-words"><strong>Baseband:</strong> {deviceInfo.BasebandVersion}</div>{/if}
            {#if deviceInfo.HardwareModel}<div class="break-words"><strong>Modelo HW:</strong> {deviceInfo.HardwareModel}</div>{/if}
            {#if deviceInfo.CPUArchitecture}<div class="break-words"><strong>Arquitectura CPU:</strong> {deviceInfo.CPUArchitecture}</div>{/if}
            {#if deviceInfo.ChipID}<div class="break-words"><strong>Chip ID:</strong> {deviceInfo.ChipID}</div>{/if}
            {#if deviceInfo.MobileEquipmentIdentifier}<div class="break-words"><strong>MEID:</strong> {deviceInfo.MobileEquipmentIdentifier}</div>{/if}
            {#if deviceInfo.ProductName}<div class="break-words"><strong>Nombre Producto:</strong> {deviceInfo.ProductName}</div>{/if}
          </div>
        </details>

      </div>
    {:else}
      <p class="text-sm text-gray-700 dark:text-gray-300">No hay información disponible.</p>
      <br>
      <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
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
        <button
          on:click={() => (loading = false, loadingMessage = '')}
          class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cerrar
        </button>
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
        {:else if firmwareList}
          {#each firmwareList as firmware}
            <div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
              <div><strong>Versión:</strong> {firmware?.version}</div>
              <div><strong>Build ID:</strong> {firmware?.buildid}</div>
              <div><strong>Fecha de lanzamiento:</strong> {new Date(firmware.releasedate).toLocaleString()}</div>
            </div>
            <button on:click={() => startDownload(firmware.url)} class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Descargar Firmware
            </button>
          {/each}
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

  <!-- Mensajes -->
  {#if successMessage}
    <Message type="success" message={successMessage} onClose={() => (successMessage = '')} />
  {/if}
  {#if errorMessage}
    <Message type="error" message={errorMessage} onClose={() => (errorMessage = '')} />
  {/if}
</div>

<style>
:global(.dark) button {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  transition: color 0.3s;
  z-index: 1;
}

:global(.dark) button::before {
  content: '';
  position: absolute;
  left: var(--x, 50%);
  top: var(--y, 50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #00ffc3 10%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.4s ease;
  border-radius: 50%;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

:global(.dark) button:hover::before {
  transform: translate(-50%, -50%) scale(1.2);
}

:global(.dark) button:hover {
  color: #00ffc3;
}
:global(button svg) {
  display: inline-block;
  vertical-align: middle;
}

:global(.dark) .emparejar-btn::before {
  background: radial-gradient(circle, #00ffc3 10%, transparent 70%);
}
:global(.dark) .emparejar-btn:hover {
  color: #00ffc3;
}
:global(.dark) .desemparejar-btn::before {
  background: radial-gradient(circle, #f24343db 10%, transparent 70%);
}
:global(.dark) .desemparejar-btn:hover {
  color: #ff7f7f;
}
:global(.dark) .reiniciar-btn::before {
  background: radial-gradient(circle, #4caf50 10%, transparent 70%);
}
:global(.dark) .reiniciar-btn:hover {
  color: #4caf50;
}
:global(.dark) .apagar-btn::before {
  background: radial-gradient(circle, #ff9800 10%, transparent 70%);
}
:global(.dark) .apagar-btn:hover {
  color: #ff9800;
}
:global(.dark) .activar-btn::before {
  background: radial-gradient(circle, #2196f3 10%, transparent 70%);
}
:global(.dark) .activar-btn:hover {
  color: #2196f3;
}
:global(.dark) .entrar-btn::before {
  background: radial-gradient(circle, #a876ff 10%, transparent 70%);
}
:global(.dark) .entrar-btn:hover {
  color: #a571ff;
}
:global(.dark) .salir-btn::before {
  background: radial-gradient(circle, #e554ff 10%, transparent 70%);
}
:global(.dark) .salir-btn:hover {
  color: #e761ff;
}
:global(.dark) .seleccionar-btn::before {
  background: radial-gradient(circle, #5972ffcb 10%, transparent 70%);
}
:global(.dark) .seleccionar-btn:hover {
  color: #a9b6ff;
}
:global(.dark) .crear-btn::before {
  background: radial-gradient(circle, #009688 10%, transparent 70%);
}
:global(.dark) .crear-btn:hover {
  color: #009688;
}
:global(.dark) .restaurar-btn::before {
  background: radial-gradient(circle, #ff440bb0 10%, transparent 70%);
}
:global(.dark) .restaurar-btn:hover {
  color: #ffa98f;
}
:global(.dark) .consultar-btn::before {
  background: radial-gradient(circle, #00bcd4 10%, transparent 70%);
}

:global(.dark) .consultar-btn:hover {
  color: #00bcd4;
}
:global(.dark) .descargar-btn::before {
  background: radial-gradient(circle, rgba(235, 37, 221, 0.656) 10%, transparent 70%);
}
:global(.dark) .descargar-btn:hover {
  color: #cb5ce1;
}


</style>