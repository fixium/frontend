<script>
    import { onMount } from 'svelte';
    import { getAllMyTickets, downloadTicketPdf, updateTicketStatus, getTicketDetail, filterTickets, filterMyTickets } from '$lib/api/main-backend-requests/tickets.js';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let tickets = [];
    let error = '';
    let existsTickets = false;

    export let data;
    let { role } = data;

    const statusDescriptions = {
        RECEIVED: "Recibido en el taller",
        DIAGNOSED_AWAITING_CUSTOMER: "Diagnosticado y en espera de respuesta del cliente",
        IN_REPAIR: "En proceso de reparación",
        REPAIRED: "Reparado exitosamente",
        NOT_REPAIRED: "No se pudo reparar",
        DELIVERED: "Entregado al cliente"
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
            tickets = await filterMyTickets({
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
            tickets = await getAllMyTickets();
            existsTickets = tickets.length > 0;
            error = '';
        } catch (e) {
            error = e.message;
        }
    }

    onMount(onMountCallback);

    function showInfo(status) {
        currentStatus = status;
        currentDescription = statusDescriptions[status] || "Sin descripción";
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
            tickets = await getAllMyTickets();
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

{#if showStatusInfo}
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="modal-content bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 class="text-lg font-bold mb-2">Estado: {currentStatus}</h2>
            <p class="mb-4">{currentDescription}</p>
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" on:click={closeInfo}>Cerrar</button>
        </div>
    </div>
{/if}

{#if showStatusModal}
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="modal-content bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 class="text-lg font-bold mb-2">Cambiar estado del ticket</h2>
            <select bind:value={newStatus} class="w-full mb-4 border rounded px-2 py-1">
                <option value="" disabled>Selecciona un estado</option>
                {#each statusOptions as option}
                    <option value={option}>{statusDescriptions[option]}</option>
                {/each}
            </select>
            {#if statusChangeError}
                <div class="text-red-600 mb-2">{statusChangeError}</div>
            {/if}
            <div class="flex justify-end gap-2">
                <button class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded" on:click={() => showStatusModal = false}>Cancelar</button>
                <button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer" on:click={confirmarCambioEstado} disabled={!newStatus}>Confirmar</button>
            </div>
        </div>
    </div>
{/if}

<div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <h1 class="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight dark:text-white">Mis Tickets Asignados</h1> 
    {#if existsTickets}
    <div class="mb-6 flex flex-wrap gap-4 items-end">
        <div class="flex flex-wrap gap-4 items-end flex-grow">
        <div>
            <label for="filtro-nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre cliente</label>
            <input id="filtro-nombre" type="text" bind:value={filtroNombre} class="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-300" placeholder="Nombre cliente" /> 
        </div>
        <div>
            <label for="filtro-ticket" class="block text-sm font-medium text-gray-700 dark:text-gray-300"># Ticket</label>
            <input id="filtro-ticket" type="text" bind:value={filtroTicket} class="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-300" placeholder="Número ticket" />
        </div>
        <div>
            <label for="filtro-imei" class="block text-sm font-medium text-gray-700 dark:text-gray-300">IMEI</label>
            <input id="filtro-imei" type="text" bind:value={filtroImei} class="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-300" placeholder="IMEI" />
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" on:click={aplicarFiltro}>Filtrar</button>
        <button class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" on:click={limpiarFiltro}>Limpiar</button>
        </div>
    </div>
    {/if}
    {#if error}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mb-6">
            <p class="font-semibold">{error}</p>
        </div>
    {:else}
        {#if tickets.length === 0}
            {#if !existsTickets}
                <div class="mt-10 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded shadow-md text-center max-w-xl mx-auto flex flex-col items-center gap-4">
                    <p class="text-lg font-semibold mb-2">No tienes tickets asignados.</p>
                </div>
            {/if}
        {/if}
        {#if existsTickets}
            <div class="mt-6 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 ">
                        <thead class="bg-blue-600">
                            <tr>
                                <th scope="col" class="px-6 py-3 w-24 text-left text-xs font-bold text-white uppercase tracking-wider"># Ticket</th>
                                <th scope="col" class="px-6 py-3 w-40 text-left text-xs font-bold text-white uppercase tracking-wider">Estado</th>
                                <th scope="col" class="px-6 py-3 w-40 text-left text-xs font-bold text-white uppercase tracking-wider">Recibido</th>
                                <th scope="col" class="px-6 py-3 w-32 text-left text-xs font-bold text-white uppercase tracking-wider">Email cliente</th>
                                <th scope="col" class="px-6 py-3 w-32 text-center text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                    </table>
                    <div class="max-h-[500px] overflow-y-auto">
                        <table class="min-w-full divide-y divide-gray-200 ">
                        <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                            {#each tickets as ticket (ticket.id)}
                                <tr class="hover:bg-blue-50 transition-colors dark:text-white dark:hover:text-black">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm  font-semibold">{ticket.ticketNumber}</td>
                                    <td class="px-6 py-4 whitespace-nowrap ">
                                        <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold
                                            {ticket.ticketStatus === 'RECEIVED' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            {ticket.ticketStatus === 'DIAGNOSED_AWAITING_CUSTOMER' ? 'bg-orange-100 text-orange-800' : ''}
                                            {ticket.ticketStatus === 'IN_REPAIR' ? 'bg-blue-100 text-blue-800' : ''}
                                            {ticket.ticketStatus === 'REPAIRED' ? 'bg-green-100 text-green-800' : ''}
                                            {ticket.ticketStatus === 'NOT_REPAIRED' ? 'bg-red-100 text-red-800' : ''}
                                            {ticket.ticketStatus === 'DELIVERED' ? 'bg-gray-200 text-gray-800' : ''}
                                        ">
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
                                    <td class="px-6 py-4 whitespace-nowrap text-sm ">{new Date(ticket.receivedAt).toLocaleString()}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm ">{ticket.customerEmail}</td>
                                    <td class="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                                        <button
                                            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
                                            on:click={() => handleTicketDetail(ticket.id)}
                                            type="button"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            class="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
                                            on:click={() => cambiarEstado(ticket.id)}
                                            type="button"
                                        >
                                            Cambiar estado
                                        </button>
                                        <button
                                            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
                                            on:click={() => goto(`/technician/reparaciones?ticketId=${ticket.id}`)}
                                            type="button"
                                        >
                                            Reparaciones
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        {/if}
    {/if}
</div>

{#if showDetailModal && selectedTicket}
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="modal-content bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
            <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" on:click={closeDetailModal}>&times;</button>
            <h2 class="text-xl font-bold mb-4">Detalle del Ticket</h2>
            
            <div class="flex flex-col md:flex-row md:gap-6">
                <div class="flex-1 flex flex-col gap-4">
                    <!-- Sección Ticket -->
                    <div>
                        <h3 class="font-semibold text-blue-700 mb-2">Ticket</h3>
                        <div class="mb-1"><b># Ticket:</b> {selectedTicket.ticketNumber}</div>
                        <div class="mb-1"><b>Estado:</b> {selectedTicket.status}</div>
                        <div class="mb-1"><b>Recibido:</b> {new Date(selectedTicket.receivedAt).toLocaleString()}</div>
                        <div class="mb-1"><b>Descripción inicial:</b> {selectedTicket.initialStateDescription}</div>
                    </div>
                    <!-- Sección Cliente -->
                    <div>
                        <h3 class="font-semibold text-blue-700 mb-2">Cliente</h3>
                        <div class="mb-1"><b>Nombre:</b> {selectedTicket.customer.name}</div>
                        <div class="mb-1"><b>Teléfono:</b> {selectedTicket.customer.phone}</div>
                        <div class="mb-1"><b>Email:</b> {selectedTicket.customer.email}</div>
                        <div class="mb-1"><b>Notas:</b> {selectedTicket.customer.notes}</div>
                    </div>
                    <!-- Sección Imágenes -->
                    <div>
                        <h3 class="font-semibold text-blue-700 mb-2">Imágenes</h3>
                        {#if selectedTicket.images && selectedTicket.images.length > 0}
                            <div class="flex gap-2 mt-1 flex-wrap">
                                {#each selectedTicket.images as img}
                                    <img src={img} alt="Imagen ticket" class="w-20 h-20 object-cover rounded border" />
                                {/each}
                            </div>
                        {:else}
                            <span>No hay imágenes</span>
                        {/if}
                    </div>
                </div>
                <div class="flex-1 flex flex-col gap-4 mt-6 md:mt-0">
                    <!-- Sección Creador del Ticket -->
                    <div>
                        <h3 class="font-semibold text-blue-700 mb-2">Creador del Ticket</h3>
                        <div class="mb-1"><b>Nombre:</b> {selectedTicket.ticketCreator?.name}</div>
                        <div class="mb-1"><b>Email:</b> {selectedTicket.ticketCreator?.email}</div>
                    </div>
                    <!-- Sección Técnico Asignado -->
                    <div>
                        <h3 class="font-semibold text-blue-700 mb-2">Técnico Asignado</h3>
                        {#if selectedTicket.assignedTechnician}
                            <div class="mb-1"><b>Nombre:</b> {selectedTicket.assignedTechnician.name}</div>
                            <div class="mb-1"><b>Email:</b> {selectedTicket.assignedTechnician.username}</div>
                            <div class="mb-1"><b>Teléfono:</b> {selectedTicket.assignedTechnician.phoneNumber}</div>
                            <div class="mb-1"><b>Asignado el:</b> {new Date(selectedTicket.assignedTechnician.createdAt).toLocaleString()}</div>
                        {:else}
                            <span>No hay técnico asignado</span>
                        {/if}
                    </div>
                    <!-- Sección Dispositivo -->
                    <div>
                        <h3 class="font-semibold text-blue-700 mb-2">Dispositivo</h3>
                        <div class="mb-1"><b>Modelo:</b> {selectedTicket.device.model}</div>
                        <div class="mb-1"><b>Color:</b> {selectedTicket.device.color}</div>
                        <div class="mb-1"><b>IMEI:</b> {selectedTicket.device.imei}</div>
                        <div class="mb-1"><b>Número de serie:</b> {selectedTicket.device.serialNumber}</div>
                        <div class="mb-1"><b>Notas:</b> {selectedTicket.device.notes}</div>
                    </div>
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" on:click={closeDetailModal}>Cerrar</button>
            </div>
        </div>
    </div>
{/if}


<style>
    .modal-content {
        animation: fadeIn 0.22s;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
    }
</style>