<script>
    import { onMount } from 'svelte';
    import { getAllTickets } from '$lib/api/apiTickets.js';
    import { getAllRepairs } from '$lib/api/apiRepair.js';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { getRepairsByImei } from '$lib/api/apiRepair.js';

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

    onMount(async () => {
        if (urlTicketId) {
            showActions = false;
        } else {
            showActions = true;
        }
        try {
            tickets = await getAllTickets();
            // Si viene ticketId en la URL, selecciónalo y carga reparaciones
            if (urlTicketId && tickets.some(t => t.id == urlTicketId)) {
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
        try {
            repairs = await getAllRepairs(selectedTicketId);
        } catch (e) {
            error = e.message;
        }
    }

    async function handleImeiSearch() {
        if (!imei.trim()) {
            error = 'Ingresa un IMEI válido';
            return;
        }
        try {
            repairs = await getRepairsByImei(imei.trim());
            selectedTicketId = ''; // Limpiar selección de ticket
            error = '';
        } catch (e) {
            repairs = [];
            error = e.message;
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
        if (!editDiagnosis || editDiagnosis.trim().length < 5 || !editRepairActions || editRepairActions.trim().length < 5) {
            error = 'Completa todos los campos correctamente para guardar.';
            return;
       }
        try {
            const response = await fetch(`http://localhost:8080/api/repairs/${selectedRepair.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    diagnosis: editDiagnosis,
                    repairActions: editRepairActions
                })
            });
            if (!response.ok) throw new Error('Error al actualizar la reparación');
            // Actualiza la lista local
            selectedRepair.diagnosis = editDiagnosis;
            selectedRepair.repairActions = editRepairActions;
            editMode = false;
            // recargar para reflejar cambios
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

<style>
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .main-container {
        max-width: 1280px;
        margin: 2rem auto 0 auto;
        padding: 2rem 1rem 3rem 1rem;
        background: #f8fafc;
        border-radius: 1rem;
        box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
    }
    .modal-bg {
        background: rgba(0,0,0,0.45);
        z-index: 50;
    }
    .modal-content {
        animation: fadeIn 0.2s;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
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

<div class="main-container">
    <h1 class="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">{showActions ? 'Gestión de Reparaciones' : 'Reparaciones'}</h1>

    {#if error}
        <p class="text-red-600 font-semibold mb-4 text-center">{error}</p>
    {/if}

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        {#if showActions}
            <div class="flex-1 flex flex-col md:flex-row md:items-end gap-4">
                <div>
                    <label for="ticket-select" class="block mb-2 font-medium text-gray-700">Filtrar por ticket:</label>
                    <select
                        id="ticket-select"
                        bind:value={selectedTicketId}
                        on:change={handleTicketChange}
                        class="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label for="imei-input" class="block mb-2 font-medium text-gray-700">Buscar por IMEI:</label>
                    <div class="flex gap-2">
                        <input
                            id="imei-input"
                            type="text"
                            bind:value={imei}
                            placeholder="Ingresa IMEI"
                            class="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow font-semibold transition-all duration-150"
                            on:click={handleImeiSearch}
                            type="button"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
        {/if}
        <div class="flex gap-3 mt-4 md:mt-0">
            {#if (selectedTicketId || (imei && repairs.length > 0)) && role !== 'ROLE_RECEPTIONIST'}
                <button
                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow font-semibold"
                    on:click={() => {
                        // Usar selectedTicketId si existe, si no, usar el ticketId del primer repair
                        const ticketIdToUse = selectedTicketId || (repairs.length > 0 ? repairs[0].ticketId : '');
                        goto(`/technician/reparaciones/nueva?ticketId=${ticketIdToUse}`);}}
                >
                    Registrar reparación
                </button>
            {/if}
        </div>
    </div>

    {#if !selectedTicketId && !(imei && repairs.length > 0)}
        <div class="text-center mt-10 mb-10">
            <p class="text-gray-600 mb-4 text-lg">
                Selecciona o crea un ticket para poder registrar una reparación.
            </p>
            <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="Selecciona ticket" class="mx-auto w-24 opacity-60" />
        </div>
    {/if}

    {#if selectedTicketId || (imei && repairs.length > 0)}
        {#if showActions}
            <h2 class="text-2xl font-bold mb-4 text-gray-800 text-center">Reparaciones del ticket seleccionado</h2>
        {/if}
        
        {#if repairs.length === 0}
            <p class="text-gray-600 text-center mb-8">No hay reparaciones para este ticket.</p>
        {:else}
            <div class="overflow-x-auto mb-6 rounded-lg border border-gray-200 bg-white shadow">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">N° Ticket</th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">Email Tecnico</th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">Creado</th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">Actualizado</th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each repairs as repair}
                            <tr class="hover:bg-blue-50 transition">
                                <td class="px-4 py-2 border-b">{repair.id}</td>
                                <td class="px-4 py-2 border-b">{repair.ticketNumber}</td>
                                <td class="px-4 py-2 border-b">{repair.userEmail}</td>
                                <td class="px-4 py-2 border-b">{new Date(repair.createdAt).toLocaleString('es-MX')}</td>
                                <td class="px-4 py-2 border-b">{new Date(repair.updatedAt).toLocaleString('es-MX')}</td>
                                <td class="px-4 py-2 border-b flex gap-2 justify-center">
                                    {#if role !== 'ROLE_RECEPTIONIST'}
                                        <button
                                            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
                                            on:click={() => handleEditModal(repair)}
                                        >
                                            Editar
                                        </button>
                                    {/if}
                                    <button
                                        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
                                        on:click={() => handleView(repair)}
                                    >
                                        Detalles
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}

        {#if selectedRepair}
            <div class="fixed inset-0 flex items-center justify-center modal-bg">
                <div class="modal-content bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative border border-blue-100">
                    <button
                        class="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
                        on:click={closeDetails}
                        aria-label="Cerrar"
                    >×</button>
                    <h3 class="text-xl font-bold mb-4 text-blue-700 text-center">
                        Detalles de la reparación #{selectedRepair.id}
                    </h3>
                    {#if editMode}
                        <div class="mb-4">
                            <label for="diagnosis-textarea" class="block font-semibold mb-1 text-gray-700">Diagnóstico:</label>
                            <textarea
                                id="diagnosis-textarea"
                                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                bind:value={editDiagnosis}
                                required
                            ></textarea>
                        </div>
                        <div class="mb-6">
                            <label for="repair-actions-textarea" class="block font-semibold mb-1 text-gray-700">Acciones de Reparación:</label>
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
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                                on:click={saveEdit}
                                disabled={!editDiagnosis || editDiagnosis.trim().length < 5 || !editRepairActions || editRepairActions.trim().length < 5}
                            >Guardar</button>
                            <button
                                class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                                on:click={cancelEdit}
                            >Cancelar</button>
                        </div>
                    {:else}
                        <div class="mb-4">
                            <strong class="block text-gray-700">Diagnóstico:</strong>
                            <div class="whitespace-pre-line text-gray-800 bg-gray-100 rounded p-2">{selectedRepair.diagnosis}</div>
                        </div>
                        <div>
                            <strong class="block text-gray-700">Acciones de Reparación:</strong>
                            <div class="whitespace-pre-line text-gray-800 bg-gray-100 rounded p-2">{selectedRepair.repairActions}</div>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    {/if}
</div>