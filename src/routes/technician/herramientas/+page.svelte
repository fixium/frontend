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
	} from '$lib/api/apiLocal';
	import Message from '$lib/components/Message.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { onMount } from 'svelte';
	import NeonButtons from '$lib/components/NeonButtons.svelte';

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
			const errorMsg =
				err.message === 'Descarga cancelada'
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

	const neonActions = [
		{
			label: 'Emparejar',
			color: '#ff22bb',
			onClick: pairAndFetchInfo
		},
		{
			label: 'Desemparejar',
			color: '#ff6666',
			onClick: () => call(unpairDevice, 'Desemparejando dispositivo...')
		},
		{
			label: 'Reiniciar',
			color: '#00ccff',
			onClick: () => call(restartDevice, 'Reiniciando dispositivo…')
		},
		{
			label: 'Apagar',
			color: '#22e622',
			onClick: () => call(shutdownDevice, 'Apagando dispositivo…')
		},
		{
			label: 'Activar',
			color: '#44cc88',
			onClick: () => call(activateDevice, 'Intentando activar dispositivo...')
		},
		{
			label: 'Entrar en Recovery',
			color: '#ff9900',
			onClick: () => call(enterRecoveryMode, 'Entrando en modo recovery...')
		},
		{
			label: 'Salir de Recovery',
			color: '#ffcc00',
			onClick: () => call(exitRecoveryMode, 'Saliendo de modo recovery...')
		},
		{
			label: 'Seleccionar Carpeta',
			color: '#ffcc00',
			onClick: selectFolder
		},
		{
			label: 'Crear Backup',
			color: '#3366ff',
			onClick: createBackup
		},
		{
			label: 'Restaurar Backup',
			color: '#6633ff',
			onClick: restoreBackup
		},
    {
      label: 'Seleccionar IPSW',
      color: '#ffcc00',
      onClick: selectFile
    },
    {
      label: 'Restaurar con IPSW',
      color: '#3366ff',
      onClick: () => restoreWithIPSW(ipswPath)
    },
    {
      label: 'Consultar Firmwares',
      color: '#6633ff',
      onClick: openFirmwareModal
    },
    {
      label: 'Extraer Logs',
      color: '#3366ff',
      onClick: downloadLogs
    }

		
	];

	function getActionByLabel(label: string) {
		return neonActions.find((action) => action.label === label);
	}
</script>

<!-- Mostrar la barra de progreso si está activa -->
{#if showProgressBar}
	<ProgressBar {progress} onCancel={cancelDownload} />
{/if}

<div class="flex min-h-screen bg-gray-50 p-6">
	<!-- Contenido principal -->
	<div class="w-full space-y-8">
		<!-- Acciones Básicas -->
		<section class="bg-white shadow-lg rounded-lg p-6">
			<h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Acciones Básicas
			</h2>
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<!-- Botón para emparejar -->
				<NeonButtons actions={[neonActions[0]]} />
				<!-- Botón para desemparejar -->
				<NeonButtons actions={[neonActions[1]]} />
				<!-- Botón para reiniciar -->
				<NeonButtons actions={[neonActions[2]]} />
				<!-- Botón para apagar -->
				<NeonButtons actions={[neonActions[3]]} />
				<!-- Botón para activar -->
				<NeonButtons actions={[neonActions[4]]} />
			</div>
		</section>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Modo Recovery -->
			<section class="bg-white shadow-lg rounded-lg p-6">
				<h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					Modo Recovery
				</h2>

				<!-- Botones en fila que llenan el contenedor -->
				<!-- neonButtons -->
				<NeonButtons actions={[neonActions[5], neonActions[6]]} />
			</section>

			<!-- Gestión de Respaldo -->
			<section class="bg-white shadow-lg rounded-lg p-6">
				<h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
						/>
					</svg>
					Gestión de Respaldo
					<span class="text-red-600 text-sm"
						>(Compatible únicamente con iOS 13 o versiones anteriores)</span
					>
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<!-- Botón para seleccionar carpeta -->
					<NeonButtons actions={[getActionByLabel('Seleccionar Carpeta')]} />

					<!-- Botón para crear backup -->
					<NeonButtons actions={[getActionByLabel('Crear Backup')]} />
					<!-- Botón para restaurar backup -->
					<NeonButtons actions={[getActionByLabel('Restaurar Backup')]} />

				</div>
				<!-- Mostrar la carpeta seleccionada -->
				{#if selectedFolder}
					<p class="mt-4 text-sm text-gray-700">{selectedFolder}</p>
				{/if}
			</section>
		</div>

		<!-- Gestión de Firmware -->
		<section class="bg-white shadow-lg rounded-lg p-6">
			<h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z"
					/>
				</svg>
				Gestión de Firmwares
			</h2>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<!-- Botón para seleccionar archivo -->
				<NeonButtons actions={[getActionByLabel('Seleccionar IPSW')]} />

				<!-- Botón "Restaurar con IPSW" -->
				<NeonButtons actions={[getActionByLabel('Restaurar con IPSW')]} />

				<!-- Botón para consultar firmware -->
				<NeonButtons actions={[getActionByLabel('Consultar Firmwares')]} />
				<!-- Mostrar la carpeta seleccionada -->
				{#if selectedIpsw}
					<p class="mt-4 text-sm text-gray-700">{selectedIpsw}</p>
				{/if}
			</div>
		</section>

		<!-- Logs -->
		<section class="bg-white shadow-lg rounded-lg p-6">
			<h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z"
					/>
				</svg>
				Logs
			</h2>
			<!-- Ajuste: Se usa col-span-2 para que el botón ocupe las dos columnas -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Botón para descargar logs -->
        <NeonButtons actions={[getActionByLabel('Extraer Logs')]} />
			</div>
		</section>
	</div>

	<!-- Panel lateral -->
	<div
		class="hidden md:block ml-7 w-72 bg-white shadow-lg rounded-lg p-6 sticky top-6 max-h-[670px] overflow-y-auto overflow-x-hidden"
	>
		<h2 class="text-l font-bold text-gray-800 mb-4 flex items-center gap-2">
			<!-- Ícono móvil -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-12 w-12 text-blue-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M16 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM12 18h.01"
				/>
			</svg>
			Información del Dispositivo
		</h2>

		{#if isPaired && deviceInfo}
			<div class="grid grid-cols-1 gap-4 text-sm text-gray-700">
				<!-- Información principal -->
				<div class="space-y-1">
					<h3 class="text-xs font-semibold text-gray-500 uppercase mb-1">Datos principales</h3>
					{#if deviceInfo.DeviceName}<div class="break-words">
							<strong>Nombre:</strong>
							{deviceInfo.DeviceName}
						</div>{/if}
					{#if deviceInfo.DeviceClass}<div class="break-words">
							<strong>Clase:</strong>
							{deviceInfo.DeviceClass}
						</div>{/if}
					{#if deviceInfo.ProductType}<div class="break-words">
							<strong>Modelo:</strong>
							{deviceInfo.ProductType}
						</div>{/if}
					{#if deviceInfo.ModelNumber}<div class="break-words">
							<strong>Modelo N°:</strong>
							{deviceInfo.ModelNumber}
						</div>{/if}
					{#if deviceInfo.InternationalMobileEquipmentIdentity}<div class="break-words">
							<strong>IMEI:</strong>
							{deviceInfo.InternationalMobileEquipmentIdentity}
						</div>{/if}
					{#if deviceInfo.SerialNumber}<div class="break-words">
							<strong>Serial:</strong>
							{deviceInfo.SerialNumber}
						</div>{/if}
					{#if deviceInfo.UniqueDeviceID}<div class="break-words">
							<strong>UDID:</strong>
							{deviceInfo.UniqueDeviceID}
						</div>{/if}
					{#if deviceInfo.ProductVersion}<div class="break-words">
							<strong>iOS:</strong>
							{deviceInfo.ProductVersion}
						</div>{/if}
					{#if deviceInfo.ActivationState}<div class="break-words">
							<strong>Estado activación:</strong>
							{deviceInfo.ActivationState}
						</div>{/if}
				</div>

				<!-- Información avanzada colapsable -->
				<details>
					<summary class="cursor-pointer text-xs font-semibold text-gray-500 uppercase mb-1"
						>Detalles avanzados</summary
					>
					<div class="mt-2 space-y-1">
						{#if deviceInfo.BuildVersion}<div class="break-words">
								<strong>Build:</strong>
								{deviceInfo.BuildVersion}
							</div>{/if}
						{#if deviceInfo.FirmwareVersion}<div class="break-words">
								<strong>Firmware:</strong>
								{deviceInfo.FirmwareVersion}
							</div>{/if}
						{#if deviceInfo.BasebandVersion}<div class="break-words">
								<strong>Baseband:</strong>
								{deviceInfo.BasebandVersion}
							</div>{/if}
						{#if deviceInfo.HardwareModel}<div class="break-words">
								<strong>Modelo HW:</strong>
								{deviceInfo.HardwareModel}
							</div>{/if}
						{#if deviceInfo.CPUArchitecture}<div class="break-words">
								<strong>Arquitectura CPU:</strong>
								{deviceInfo.CPUArchitecture}
							</div>{/if}
						{#if deviceInfo.ChipID}<div class="break-words">
								<strong>Chip ID:</strong>
								{deviceInfo.ChipID}
							</div>{/if}
						{#if deviceInfo.MobileEquipmentIdentifier}<div class="break-words">
								<strong>MEID:</strong>
								{deviceInfo.MobileEquipmentIdentifier}
							</div>{/if}
						{#if deviceInfo.ProductName}<div class="break-words">
								<strong>Nombre Producto:</strong>
								{deviceInfo.ProductName}
							</div>{/if}
					</div>
				</details>
			</div>
		{:else}
			<p class="text-sm text-gray-700">No hay información disponible.</p>
			<br />
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>

	<!-- Carga -->
	{#if loading}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
				<svg
					class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v4m0 8v4m4-4h4m-8 0H4m16-4a8 8 0 11-16 0 8 8 0 0116 0z"
					/>
				</svg>
				<p class="text-gray-800 font-semibold">{loadingMessage}</p>
				<button
					on:click={() => ((loading = false), (loadingMessage = ''))}
					class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v2a3 3 0 01-3 3z"
						/>
					</svg>
					Último Firmware
				</h2>
				{#if loading}
					<div class="flex flex-col items-center">
						<svg
							class="animate-spin h-8 w-8 text-blue-600 mb-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v4m0 8v4m4-4h4m-8 0H4m16-4a8 8 0 11-16 0 8 8 0 0116 0z"
							/>
						</svg>
						<p class="text-gray-800 font-semibold">{loadingMessage}</p>
					</div>
				{:else if firmwareList}
					{#each firmwareList as firmware}
						<div class="grid grid-cols-1 gap-2 text-sm text-gray-700">
							<div><strong>Versión:</strong> {firmware?.version}</div>
							<div><strong>Build ID:</strong> {firmware?.buildid}</div>
							<div>
								<strong>Fecha de lanzamiento:</strong>
								{new Date(firmware.releasedate).toLocaleString()}
							</div>
						</div>
						<button
							on:click={() => startDownload(firmware.url)}
							class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
							Descargar Firmware
						</button>
					{/each}
				{/if}
				<button
					on:click={() => (showFirmwareModal = false)}
					class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold w-full flex items-center justify-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
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
