<script>
	import { onMount } from 'svelte';
	import { getAllMyTickets, getAllTickets } from '$lib/api/main-backend-requests/tickets.js';
	import { getAllRepairs, updateRepair } from '$lib/api/main-backend-requests/repairs.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getRepairsByImei } from '$lib/api/main-backend-requests/repairs.js';

	export let data;
	let { role } = data;

	let editMode = false;
	let editDiagnosis = '';
	let editRepairActions = '';

	let tickets = [];
	let repairs = [];
	let selectedTicketId = '';
	let error = '';

	// Estado para mostrar detalles
	let selectedRepair = null;

	let imei = '';

	$: urlTicketId = $page.url.searchParams.get('ticketId');

	let showActions = true;

	let loadingRepairs = false;

	onMount(async () => {
		if (urlTicketId) {
			loadingRepairs = true;
			showActions = false;
		} else {
			showActions = true;
		}
		try {
			if (urlTicketId) {
				if (role === 'ROLE_ADMIN') {
					tickets = await getAllTickets();
				} else {
					tickets = await getAllMyTickets();
				}
			} else {
				if (role === 'ROLE_TECHNICIAN') {
					tickets = await getAllMyTickets();
				} else {
					tickets = await getAllTickets();
				}
			}

			if (urlTicketId && tickets.some((t) => t.id == urlTicketId)) {
				selectedTicketId = urlTicketId;
				await handleTicketChange();
			}
		} catch (e) {
			error = e.message;
		}
	});

	async function handleTicketChange() {
		imei = '';
		if (!selectedTicketId) {
			repairs = [];
			return;
		}
		loadingRepairs = true;
		try {
			repairs = await getAllRepairs(selectedTicketId);
		} catch (e) {
			error = e.message;
		} finally {
			loadingRepairs = false;
		}
	}

	async function handleImeiSearch() {
		if (!imei.trim()) {
			error = 'Ingresa un IMEI válido';
			return;
		}
		loadingRepairs = true;
		try {
			repairs = await getRepairsByImei(imei.trim());
			selectedTicketId = ''; // Limpiar selección de ticket
			error = '';
		} catch (e) {
			repairs = [];
			error = e.message;
		} finally {
			loadingRepairs = false;
		}
	}

	function handleView(repair) {
		selectedRepair = repair;
	}

	function closeDetails() {
		selectedRepair = null;
		editMode = false;
	}

	function handleEditModal(repair) {
		selectedRepair = repair;
		editDiagnosis = repair.diagnosis;
		editRepairActions = repair.repairActions;
		editMode = true;
	}

	async function saveEdit() {
		if (
			!editDiagnosis ||
			editDiagnosis.trim().length < 5 ||
			!editRepairActions ||
			editRepairActions.trim().length < 5
		) {
			error = 'Completa todos los campos correctamente para guardar.';
			return;
		}
		try {
			await updateRepair(selectedRepair.id, {
				diagnosis: editDiagnosis,
				repairActions: editRepairActions
			});
			// Actualiza la lista local
			selectedRepair.diagnosis = editDiagnosis;
			selectedRepair.repairActions = editRepairActions;
			editMode = false;
			window.location.reload();
		} catch (e) {
			error = e.message;
		}
	}

	function cancelEdit() {
		editMode = false;
		selectedRepair = null;
	}
</script>

<div class="main-container">
	<h1
		class="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-6 text-center tracking-tight"
	>
		<i class="fa fa-tools mr-2"></i>
		{showActions ? 'Gestión de Reparaciones' : 'Reparaciones'}
	</h1>

	{#if error}
		<p class="text-red-600 font-semibold mb-4 text-center">
			<i class="fa fa-exclamation-circle mr-1"></i>{error}
		</p>
	{/if}

	<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
		{#if showActions}
			<div class="flex-1 flex flex-col md:flex-row md:items-end gap-4">
				<div>
					<label
						for="ticket-select"
						class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
					>
						<i class="fa fa-ticket-alt mr-1"></i>
						Filtrar por ticket:
					</label>
					<select
						id="ticket-select"
						bind:value={selectedTicketId}
						on:change={handleTicketChange}
						class="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
					>
						<option value="">-- Selecciona --</option>
						{#each tickets as ticket}
							<option value={ticket.id}>
								{ticket.ticketNumber}
							</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="imei-input" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
						<i class="fa fa-search mr-1"></i>
						Buscar por IMEI:
					</label>
					<div class="flex gap-2">
						<input
							id="imei-input"
							type="text"
							bind:value={imei}
							placeholder="Ingresa IMEI"
							class="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
						/>
						<button
							class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow font-semibold transition-all duration-150 flex items-center"
							on:click={handleImeiSearch}
							type="button"
						>
							<i class="fa fa-search mr-1"></i>Buscar
						</button>
					</div>
				</div>
			</div>
		{/if}
		<div class="flex gap-3 mt-4 md:mt-0">
			{#if (selectedTicketId || (imei && repairs.length > 0)) && role !== 'ROLE_ADMIN'}
				<button
					class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow font-semibold flex items-center"
					on:click={() => {
						// Usar selectedTicketId si existe, si no, usar el ticketId del primer repair
						const ticketIdToUse =
							selectedTicketId || (repairs.length > 0 ? repairs[0].ticketId : '');
						goto(`/technician/repairs/new?ticketId=${ticketIdToUse}`);
					}}
				>
					<i class="fa fa-plus mr-1"></i>Registrar reparación
				</button>
			{/if}
		</div>
	</div>

	{#if loadingRepairs}
		<div class="flex flex-col items-center justify-center mt-10">
			<span class="animate-spin text-4xl text-blue-600 mb-2"><i class="fa fa-spinner"></i></span>
			<span class="text-blue-700 font-semibold">Cargando reparaciones...</span>
		</div>
	{:else}
		{#if !selectedTicketId && !(imei && repairs.length > 0)}
			<div class="text-center mt-10 mb-10">
				<p class="text-gray-600 dark:text-gray-300 mb-4 text-lg">
					<i class="fa fa-info-circle mr-1"></i>
					Selecciona un ticket para poder visualizar sus reparaciones.
				</p>
				<img
					src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
					alt="Selecciona ticket"
					class="mx-auto w-24 opacity-60"
				/>
			</div>
		{/if}

		{#if selectedTicketId || (imei && repairs.length > 0)}
			{#if showActions}
				<h2 class="text-2xl font-bold mb-4 text-gray-800 text-center dark:text-white">
					<i class="fa fa-wrench mr-2"></i>
					Reparaciones del ticket seleccionado
				</h2>
			{/if}

			{#if repairs.length === 0}
				<p class="text-gray-600 text-center mb-8">
					<i class="fa fa-exclamation-circle mr-1"></i>
					No hay reparaciones para este ticket.
				</p>
			{:else}
				<div class="overflow-x-auto mb-6 rounded-lg border border-gray-200 bg-white shadow">
					<table class="min-w-full divide-y divide-gray-200">
						<thead>
							<tr class="bg-gray-100">
								<th class="px-4 py-2 text-left font-semibold text-gray-700"
									><i class="fa fa-hashtag mr-1"></i>ID</th
								>
								<th class="px-4 py-2 text-left font-semibold text-gray-700"
									><i class="fa fa-ticket-alt mr-1"></i>N° Ticket</th
								>
								<th class="px-4 py-2 text-left font-semibold text-gray-700"
									><i class="fa fa-user mr-1"></i>Email Tecnico</th
								>
								<th class="px-4 py-2 text-left font-semibold text-gray-700"
									><i class="fa fa-calendar-plus mr-1"></i>Creado</th
								>
								<th class="px-4 py-2 text-left font-semibold text-gray-700"
									><i class="fa fa-calendar-check mr-1"></i>Actualizado</th
								>
								<th class="px-4 py-2 text-left font-semibold text-gray-700"
									><i class="fa fa-cogs mr-1"></i>Acciones</th
								>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
							{#each repairs as repair}
								<tr class="hover:bg-blue-50 transition dark:text-white dark:hover:text-black">
									<td class="px-4 py-2 border-b">{repair.id}</td>
									<td class="px-4 py-2 border-b">{repair.ticketNumber}</td>
									<td class="px-4 py-2 border-b">{repair.userEmail}</td>
									<td class="px-4 py-2 border-b"
										>{new Date(repair.createdAt).toLocaleString('es-MX')}</td
									>
									<td class="px-4 py-2 border-b"
										>{new Date(repair.updatedAt).toLocaleString('es-MX')}</td
									>
									<td class="px-4 py-2 border-b flex gap-2 justify-center">
										{#if role !== 'ROLE_ADMIN'}
											<button
												class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150 flex items-center"
												on:click={() => handleEditModal(repair)}
											>
												<i class="fa fa-edit mr-1"></i>Editar
											</button>
										{/if}
										<button
											class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150 flex items-center"
											on:click={() => handleView(repair)}
										>
											<i class="fa fa-eye mr-1"></i>Detalles
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{/if}

		{#if selectedRepair}
			<div class="fixed inset-0 flex items-center justify-center modal-bg">
				<div
					class="modal-content bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative border border-blue-100"
				>
					<button
						class="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
						on:click={closeDetails}
						aria-label="Cerrar"
					>
						<i class="fa fa-times"></i>
					</button>
					<h3 class="text-xl font-bold mb-4 text-blue-700 text-center">
						<i class="fa fa-tools mr-2"></i>
						Detalles de la reparación #{selectedRepair.id}
					</h3>
					{#if editMode}
						<div class="mb-4">
							<label for="diagnosis-textarea" class="block font-semibold mb-1 text-gray-700">
								<i class="fa fa-stethoscope mr-1"></i>
								Diagnóstico:
							</label>
							<textarea
								id="diagnosis-textarea"
								class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="3"
								bind:value={editDiagnosis}
								required
							></textarea>
						</div>
						<div class="mb-6">
							<label for="repair-actions-textarea" class="block font-semibold mb-1 text-gray-700">
								<i class="fa fa-tools mr-1"></i>
								Acciones de Reparación:
							</label>
							<textarea
								id="repair-actions-textarea"
								class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="3"
								bind:value={editRepairActions}
								required
							></textarea>
						</div>
						<div class="flex justify-end space-x-2">
							<button
								class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center"
								on:click={saveEdit}
								disabled={!editDiagnosis ||
									editDiagnosis.trim().length < 5 ||
									!editRepairActions ||
									editRepairActions.trim().length < 5}
							>
								<i class="fa fa-save mr-1"></i>Guardar
							</button>
							<button
								class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold flex items-center"
								on:click={cancelEdit}
							>
								<i class="fa fa-times mr-1"></i>Cancelar
							</button>
						</div>
					{:else}
						<div class="mb-4">
							<strong class="block text-gray-700">
								<i class="fa fa-stethoscope mr-1"></i>
								Diagnóstico:
							</strong>
							<div class="whitespace-pre-line text-gray-800 bg-gray-100 rounded p-2">
								{selectedRepair.diagnosis}
							</div>
						</div>
						<div>
							<strong class="block text-gray-700">
								<i class="fa fa-tools mr-1"></i>
								Acciones de Reparación:
							</strong>
							<div class="whitespace-pre-line text-gray-800 bg-gray-100 rounded p-2">
								{selectedRepair.repairActions}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.main-container {
		max-width: 1280px;
		margin: 2rem auto 0 auto;
		padding: 2rem 1rem 3rem 1rem;
		border-radius: 1rem;
		box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.07);
	}
	.modal-bg {
		background: rgba(0, 0, 0, 0.45);
		z-index: 50;
	}
	.modal-content {
		animation: fadeIn 0.2s;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (max-width: 600px) {
		.main-container {
			padding: 1rem 0.2rem;
		}
		table {
			font-size: 0.92rem;
		}
	}
</style>
