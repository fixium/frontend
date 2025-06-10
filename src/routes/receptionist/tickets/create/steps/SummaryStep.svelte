<script>
	import { wizardData } from '$lib/stores/wizardStore';
	import { downloadTicketPdf } from '$lib/api/main-backend-requests/tickets';
	import { step } from '$lib/stores/stepStore';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { getTicket } from '$lib/api/main-backend-requests/tickets';
	import { getCustomer } from '$lib/api/main-backend-requests/customers';
	import { getDevice } from '$lib/api/main-backend-requests/devices';
	import { goto } from '$app/navigation';

	let customer = null;
	let device = null;
	let ticket = null;
	let loading = true;
	let error = null;

	const data = get(wizardData);

	let loadingPdf = false;

	async function handleDownloadPdf(id) {
		loadingPdf = true;
		try {
			await downloadTicketPdf(id);
		} finally {
			loadingPdf = false;
		}
	}

	onMount(async () => {
		loading = true;
		error = null;
		try {
			customer = await getCustomer(data.customerId);
			device = await getDevice(data.deviceId);
			ticket = await getTicket(data.ticketId);
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<div
	class="p-8 rounded-2xl shadow-xl bg-white max-w-2xl mx-auto mt-8 border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
>
	<h2
		class="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight dark:text-blue-300"
	>
		<i class="fa fa-clipboard-check mr-2"></i>
		Resumen
	</h2>
	{#if loading}
		<div class="flex items-center justify-center py-8">
			<i class="fa fa-spinner fa-spin text-2xl text-gray-400 mr-2"></i>
			<span class="text-gray-500">Cargando datos...</span>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-center">
			<i class="fa fa-exclamation-circle mr-1"></i>
			Error: {error}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<!-- Bloque Cliente -->
			<div
				class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600"
			>
				<h3 class="text-lg font-bold mb-3 text-blue-700 dark:text-blue-300">
					<i class="fa fa-user mr-1"></i>
					Datos del cliente
				</h3>
				<ul class="space-y-2">
					<li>
						<i class="fa fa-id-card mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">ID Cliente:</span
						> <span class="text-gray-900 dark:text-white">{customer.id}</span>
					</li>
					<li>
						<i class="fa fa-user-tag mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Nombre:</span
						> <span class="text-gray-900 dark:text-white">{customer.name}</span>
					</li>
					<li>
						<i class="fa fa-phone mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Teléfono:</span
						> <span class="text-gray-900 dark:text-white">{customer.phone}</span>
					</li>
					<li>
						<i class="fa fa-envelope mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Email:</span
						> <span class="text-gray-900 dark:text-white">{customer.email}</span>
					</li>
					<li>
						<i class="fa fa-sticky-note mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Notas:</span
						> <span class="text-gray-900 dark:text-white">{customer.notes}</span>
					</li>
				</ul>
			</div>
			<!-- Bloque Dispositivo -->
			<div
				class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600"
			>
				<h3 class="text-lg font-bold mb-3 text-blue-700 dark:text-blue-300">
					<i class="fa fa-mobile-alt mr-1"></i>
					Datos del dispositivo
				</h3>
				<ul class="space-y-2">
					<li>
						<i class="fa fa-id-card mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">ID Dispositivo:</span
						> <span class="text-gray-900 dark:text-white">{device.id}</span>
					</li>
					<li>
						<i class="fa fa-tablet-alt mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Modelo:</span
						> <span class="text-gray-900 dark:text-white">{device.model}</span>
					</li>
					<li>
						<i class="fa fa-palette mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Color:</span
						> <span class="text-gray-900 dark:text-white">{device.color}</span>
					</li>
					<li>
						<i class="fa fa-hashtag mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">IMEI:</span
						> <span class="text-gray-900 dark:text-white">{device.imei}</span>
					</li>
					<li>
						<i class="fa fa-barcode mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Número de serie:</span
						> <span class="text-gray-900 dark:text-white">{device.serialNumber}</span>
					</li>
					<li>
						<i class="fa fa-sticky-note mr-1 text-gray-400"></i><span
							class="font-semibold text-gray-700 dark:text-white">Notas:</span
						> <span class="text-gray-900 dark:text-white">{device.notes}</span>
					</li>
				</ul>
			</div>
		</div>
		<!-- Bloque Ticket -->
		<div
			class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600 mb-6"
		>
			<h3 class="text-lg font-bold mb-3 text-blue-700 dark:text-blue-300">
				<i class="fa fa-ticket-alt mr-1"></i>
				Datos del ticket
			</h3>
			<ul class="space-y-2">
				<li>
					<i class="fa fa-id-card mr-1 text-gray-400"></i><span
						class="font-semibold text-gray-700 dark:text-white">ID Ticket:</span
					> <span class="text-gray-900 dark:text-white">{ticket.id}</span>
				</li>
				<li>
					<i class="fa fa-info-circle mr-1 text-gray-400"></i><span
						class="font-semibold text-gray-700 dark:text-white">Descripción inicial:</span
					> <span class="text-gray-900 dark:text-white">{ticket.initialStateDescription}</span>
				</li>
			</ul>
		</div>
		<!-- Imágenes -->
		<div class="mb-4">
			<span class="font-semibold text-gray-700 dark:text-white">
				<i class="fa fa-images mr-1"></i>Imágenes:
			</span>
			<span class="ml-2 text-gray-900 dark:text-white"
				>{data.deviceImages ? data.deviceImages.length : 0}</span
			>
		</div>
		{#if data.deviceImages && data.deviceImages.length > 0}
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
				{#each data.deviceImages as url}
					<div class="relative">
						<i class="fa fa-image absolute left-2 top-2 text-white text-lg drop-shadow"></i>
						<img
							src={url}
							alt="Imagen del dispositivo"
							class="w-full h-28 object-cover rounded-lg border border-gray-200 shadow-sm"
						/>
					</div>
				{/each}
			</div>
		{/if}
		<div class="flex justify-end gap-4">
			<button
				class="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition-colors duration-150 flex items-center"
				on:click={() => handleDownloadPdf(ticket.id)}
				disabled={loadingPdf}
			>
				{#if loadingPdf}
					<span class="animate-spin mr-2"><i class="fa fa-spinner"></i></span>
					Descargando...
				{:else}
					<i class="fa fa-file-pdf mr-2"></i>
					Descargar PDF
				{/if}
			</button>
			<button
				class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors duration-150 flex items-center"
				on:click={() => {
					goto('/receptionist/tickets');
					step.set(1);
					wizardData.set({
						customerId: null,
						deviceId: null,
						ticketId: null,
						deviceImages: [],
						initialStateDescription: ''
					});
				}}
			>
				<i class="fa fa-check mr-2"></i>
				Finalizar
			</button>
		</div>
	{/if}
</div>
