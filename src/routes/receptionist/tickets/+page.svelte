<script>
	import { onMount } from 'svelte';
	import {
		getAllTickets,
		downloadTicketPdf,
		getTicketDetail,
		filterTickets
	} from '$lib/api/main-backend-requests/tickets.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let tickets = [];
	let error = '';
	let existsTickets = false;

	export let data;
	let { role } = data;

	// Diccionario de descripciones de estados
	const statusDescriptions = {
		RECEIVED: 'Recibido en el taller',
		DIAGNOSED_AWAITING_CUSTOMER: 'Diagnosticado y en espera de respuesta del cliente',
		IN_REPAIR: 'En proceso de reparación',
		REPAIRED: 'Reparado exitosamente',
		NOT_REPAIRED: 'No se pudo reparar',
		DELIVERED: 'Entregado al cliente'
	};

	const statusOptions = [
		'RECEIVED',
		'DIAGNOSED_AWAITING_CUSTOMER',
		'IN_REPAIR',
		'REPAIRED',
		'NOT_REPAIRED',
		'DELIVERED'
	];

	let showStatusModal = false;
	let selectedTicketId = null;
	let newStatus = '';
	let statusChangeError = '';

	let showStatusInfo = false;
	let currentStatus = '';
	let currentDescription = '';

	let showDetailModal = false;
	let selectedTicket = null;

	let filtroNombre = '';
	let filtroTicket = '';
	let filtroImei = '';

	async function aplicarFiltro() {
		try {
			tickets = await filterTickets({
				customerName: filtroNombre,
				ticketNumber: filtroTicket,
				imei: filtroImei
			});
			error = '';
		} catch (e) {
			error = e.message;
		}
	}

	function limpiarFiltro() {
		filtroNombre = '';
		filtroTicket = '';
		filtroImei = '';
		onMountCallback();
	}

	async function onMountCallback() {
		try {
			tickets = await getAllTickets();
			existsTickets = tickets.length > 0;
			error = '';
		} catch (e) {
			error = e.message;
		}
	}

	onMount(onMountCallback);

	function showInfo(status) {
		currentStatus = status;
		currentDescription = statusDescriptions[status] || 'Sin descripción';
		showStatusInfo = true;
	}

	function closeInfo() {
		showStatusInfo = false;
	}

	function descargarPdf(id) {
		downloadTicketPdf(id);
	}

	async function cambiarEstado(id) {
		selectedTicketId = id;
		newStatus = '';
		statusChangeError = '';
		showStatusModal = true;
	}

	async function confirmarCambioEstado() {
		try {
			await updateTicketStatus(selectedTicketId, newStatus);
			// Refresca la lista de tickets
			tickets = await getAllTickets();
			showStatusModal = false;
		} catch (e) {
			statusChangeError = e.message;
		}
	}

	async function handleTicketDetail(id) {
		try {
			selectedTicket = await getTicketDetail(id);
			showDetailModal = true;
		} catch (e) {
			alert(e.message);
		}
	}

	function closeDetailModal() {
		showDetailModal = false;
		selectedTicket = null;
	}
</script>

<!-- Modal de información de estado -->
{#if showStatusInfo}
	<div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
		<div class="modal-content bg-white rounded-lg shadow-lg p-6 max-w-sm w-full dark:bg-gray-800 dark:text-white">
			<h2 class="text-lg font-bold mb-2">Estado: {currentStatus}</h2>
			<p class="mb-4">{currentDescription}</p>
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
				on:click={closeInfo}>Cerrar</button
			>
		</div>
	</div>
{/if}

<div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <h1
        class="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight dark:text-blue-300 flex items-center justify-center gap-2"
    >
        <i class="fa fa-ticket-alt"></i>
        Tickets de recepción
    </h1>

    <div class="mb-6 flex flex-wrap gap-4 items-end">
        {#if existsTickets}
            <div class="flex flex-wrap gap-4 items-end flex-grow">
                <div>
                    <label
                        for="filtro-nombre"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
                    >
                        <i class="fa fa-user"></i>
                        Nombre cliente
                    </label>
                    <input
                        id="filtro-nombre"
                        type="text"
                        bind:value={filtroNombre}
                        class="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Nombre cliente"
                    />
                </div>
                <div>
                    <label
                        for="filtro-ticket"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
                    >
                        <i class="fa fa-hashtag"></i>
                        # Ticket
                    </label>
                    <input
                        id="filtro-ticket"
                        type="text"
                        bind:value={filtroTicket}
                        class="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Número ticket"
                    />
                </div>
                <div>
                    <label
                        for="filtro-imei"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
                    >
                        <i class="fa fa-mobile-alt"></i>
                        IMEI
                    </label>
                    <input
                        id="filtro-imei"
                        type="text"
                        bind:value={filtroImei}
                        class="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="IMEI"
                    />
                </div>
                <button
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                    on:click={aplicarFiltro}
                >
                    <i class="fa fa-filter"></i>
                    Filtrar
                </button>
                <button
                    class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-2"
                    on:click={limpiarFiltro}
                >
                    <i class="fa fa-eraser"></i>
                    Limpiar
                </button>
            </div>
        {/if}

        {#if role !== 'ROLE_TECHNICIAN'}
            <div class="ml-auto">
                <button
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                    on:click={() => goto('/receptionist/tickets/create')}
                >
                    <i class="fa fa-plus"></i>
                    Registrar recepción
                </button>
            </div>
        {/if}
    </div>

    {#if error}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mb-6 flex items-center gap-2">
            <i class="fa fa-exclamation-circle"></i>
            <p class="font-semibold">{error}</p>
        </div>
    {:else}
        {#if tickets.length === 0}
            {#if !existsTickets}
                <div
                    class="mt-10 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded shadow-md text-center max-w-xl mx-auto flex flex-col items-center gap-4"
                >
                    <p class="text-lg font-semibold mb-2 flex items-center gap-2">
                        <i class="fa fa-info-circle"></i>
                        No hay tickets registrados.
                    </p>
                    <p>Por favor, crea un nuevo ticket.</p>
                </div>
            {/if}
        {/if}
        {#if existsTickets}
            <div class="mt-6 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
				<div class="overflow-x-auto max-h-[500px]">
					<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead class="bg-blue-600 sticky top-0 z-10">
							<tr>
								<th
									scope="col"
									class="px-6 py-3 w-24 text-left text-xs font-bold text-white uppercase tracking-wider"
									># Ticket</th
								>
								<th
									scope="col"
									class="px-6 py-3 w-40 text-left text-xs font-bold text-white uppercase tracking-wider"
									>Estado</th
								>
								<th
									scope="col"
									class="px-6 py-3 w-40 text-left text-xs font-bold text-white uppercase tracking-wider"
									>Recibido</th
								>
								<th
									scope="col"
									class="px-6 py-3 w-32 text-left text-xs font-bold text-white uppercase tracking-wider"
									>Email cliente</th
								>
								<th
									scope="col"
									class="px-6 py-3 w-32 text-center text-xs font-bold text-white uppercase tracking-wider"
									>Acciones</th
								>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
							{#each tickets as ticket (ticket.id)}
								<tr
									class="hover:bg-blue-50 transition-colors dark:text-white dark:hover:text-black"
								>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-semibold"
										>{ticket.ticketNumber}</td
									>
									<td class="px-6 py-4 whitespace-nowrap">
										<span
											class="inline-block px-2 py-1 rounded-full text-xs font-semibold
                                {ticket.ticketStatus === 'RECEIVED'
												? 'bg-yellow-100 text-yellow-800'
												: ''}
                                {ticket.ticketStatus === 'DIAGNOSED_AWAITING_CUSTOMER'
												? 'bg-orange-100 text-orange-800'
												: ''}
                                {ticket.ticketStatus === 'IN_REPAIR'
												? 'bg-blue-100 text-blue-800'
												: ''}
                                {ticket.ticketStatus === 'REPAIRED'
												? 'bg-green-100 text-green-800'
												: ''}
                                {ticket.ticketStatus === 'NOT_REPAIRED'
												? 'bg-red-100 text-red-800'
												: ''}
                                {ticket.ticketStatus === 'DELIVERED'
												? 'bg-gray-200 text-gray-800'
												: ''}
                            "
										>
											{ticket.ticketStatus}
											<button
												class="ml-2 text-blue-100 hover:text-white focus:outline-none"
												title="Ver información"
												aria-label="Ver información del estado"
												on:click={() => showInfo(ticket.ticketStatus)}
												type="button"
											>
												ℹ️
											</button>
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm"
										>{new Date(ticket.receivedAt).toLocaleString()}</td
									>
									<td class="px-6 py-4 whitespace-nowrap text-sm">{ticket.customerEmail}</td>
									<td class="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
										<button
											class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
											on:click={() => handleTicketDetail(ticket.id)}
											type="button"
										>
											Ver Detalles
										</button>
										<button
											class="bg-red-500 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
											on:click={() => descargarPdf(ticket.id)}
										>
											PDF
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
        {/if}
    {/if}
</div>

{#if showDetailModal && selectedTicket}
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="modal-content bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
            <button
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-xl"
                on:click={closeDetailModal}
                aria-label="Cerrar modal de detalles"
            >
                <i class="fa fa-times"></i>
            </button>
            <h2 class="text-xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center flex items-center gap-2">
                <i class="fa fa-ticket-alt"></i>
                Detalle del Ticket
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Columna izquierda -->
                <div class="flex flex-col gap-4">
                    <!-- Ticket -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                        <h3 class="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <i class="fa fa-ticket-alt"></i>
                            Ticket
                        </h3>
                        <div class="mb-1"><b># Ticket:</b> <span class="dark:text-white">{selectedTicket.ticketNumber}</span></div>
                        <div class="mb-1"><b>Estado:</b> <span class="dark:text-white">{selectedTicket.status}</span></div>
                        <div class="mb-1 flex items-center gap-2"><b>Recibido:</b> <i class="fa fa-calendar-alt text-gray-400"></i> <span class="dark:text-white">{new Date(selectedTicket.receivedAt).toLocaleString()}</span></div>
                        <div class="mb-1"><b>Descripción inicial:</b> <span class="dark:text-white">{selectedTicket.initialStateDescription}</span></div>
                    </div>
                    <!-- Cliente -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                        <h3 class="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <i class="fa fa-user"></i>
                            Cliente
                        </h3>
                        <div class="mb-1"><b>Nombre:</b> <span class="dark:text-white">{selectedTicket.customer.name}</span></div>
                        <div class="mb-1 flex items-center gap-2"><b>Teléfono:</b> <i class="fa fa-phone text-gray-400"></i> <span class="dark:text-white">{selectedTicket.customer.phone}</span></div>
                        <div class="mb-1 flex items-center gap-2"><b>Email:</b> <i class="fa fa-envelope text-gray-400"></i> <span class="dark:text-white">{selectedTicket.customer.email}</span></div>
                        <div class="mb-1"><b>Notas:</b> <span class="dark:text-white">{selectedTicket.customer.notes}</span></div>
                    </div>
                    <!-- Imágenes -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                        <h3 class="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <i class="fa fa-image"></i>
                            Imágenes
                        </h3>
                        {#if selectedTicket.images && selectedTicket.images.length > 0}
                            <div class="flex gap-2 mt-1 flex-wrap">
                                {#each selectedTicket.images as img}
                                    <img
                                        src={img}
                                        alt="Imagen ticket"
                                        class="w-20 h-20 object-cover rounded border"
                                    />
                                {/each}
                            </div>
                        {:else}
                            <span class="dark:text-white">No hay imágenes</span>
                        {/if}
                    </div>
                </div>
                <!-- Columna derecha -->
                <div class="flex flex-col gap-4 mt-6 md:mt-0">
                    <!-- Creador del Ticket -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                        <h3 class="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <i class="fa fa-user-cog"></i>
                            Creador del Ticket
                        </h3>
                        <div class="mb-1"><b>Nombre:</b> <span class="dark:text-white">{selectedTicket.ticketCreator?.name}</span></div>
                        <div class="mb-1 flex items-center gap-2"><b>Email:</b> <i class="fa fa-envelope text-gray-400"></i> <span class="dark:text-white">{selectedTicket.ticketCreator?.email}</span></div>
                    </div>
                    <!-- Técnico Asignado -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                        <h3 class="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <i class="fa fa-user-wrench"></i>
                            Técnico Asignado
                        </h3>
                        {#if selectedTicket.assignedTechnician}
                            <div class="mb-1"><b>Nombre:</b> <span class="dark:text-white">{selectedTicket.assignedTechnician.name}</span></div>
                            <div class="mb-1 flex items-center gap-2"><b>Email:</b> <i class="fa fa-envelope text-gray-400"></i> <span class="dark:text-white">{selectedTicket.assignedTechnician.username}</span></div>
                            <div class="mb-1 flex items-center gap-2"><b>Teléfono:</b> <i class="fa fa-phone text-gray-400"></i> <span class="dark:text-white">{selectedTicket.assignedTechnician.phoneNumber}</span></div>
                            <div class="mb-1 flex items-center gap-2"><b>Asignado el:</b> <i class="fa fa-calendar-alt text-gray-400"></i> <span class="dark:text-white">{new Date(selectedTicket.assignedTechnician.createdAt).toLocaleString()}</span></div>
                        {:else}
                            <span class="dark:text-white">No hay técnico asignado</span>
                        {/if}
                    </div>
                    <!-- Dispositivo -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                        <h3 class="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <i class="fa fa-mobile-alt"></i>
                            Dispositivo
                        </h3>
                        <div class="mb-1"><b>Modelo:</b> <span class="dark:text-white">{selectedTicket.device.model}</span></div>
                        <div class="mb-1"><b>Color:</b> <span class="dark:text-white">{selectedTicket.device.color}</span></div>
                        <div class="mb-1 flex items-center gap-2"><b>IMEI:</b> <i class="fa fa-mobile-alt text-gray-400"></i> <span class="dark:text-white">{selectedTicket.device.imei}</span></div>
                        <div class="mb-1"><b>Número de serie:</b> <span class="dark:text-white">{selectedTicket.device.serialNumber}</span></div>
                        <div class="mb-1"><b>Notas:</b> <span class="dark:text-white">{selectedTicket.device.notes}</span></div>
                    </div>
                </div>
            </div>
            <div class="mt-6 flex justify-end">
                <button
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    on:click={closeDetailModal}
                >
                    <i class="fa fa-times"></i>
                    Cerrar
                </button>
            </div>
        </div>
    </div>
{/if}