<script>
    import { onMount } from 'svelte';
    import { getAllTickets } from '$lib/api/apiTickets.js';
    import { createRepair } from '$lib/api/apiRepair.js';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    let tickets = [];
    let ticketId = '';
    let diagnosis = '';
    let repairActions = '';
    let error = '';
    let success = '';

    // Lee el parámetro ticketId de la URL
    $: urlTicketId = $page.url.searchParams.get('ticketId');

    onMount(async () => {
        try {
            tickets = await getAllTickets();
            // Si viene ticketId en la URL, seleccionarlo
            if (urlTicketId && tickets.some(t => t.id == urlTicketId)) {
                ticketId = urlTicketId;
            }
        } catch (e) {
            error = e.message;
        }
    });

    async function handleSubmit() {
        error = '';
        success = '';
        if (!ticketId || diagnosis.length < 5 || repairActions.length < 5) {
            error = 'Completa todos los campos correctamente.';
            return;
        }
        try {
            await createRepair({ ticketId: Number(ticketId), diagnosis, repairActions });
            success = 'Reparación creada con éxito';
            setTimeout(() => goto('/receptionist/tickets'), 1000);
        } catch (e) {
            error = e.message;
        }
    }
</script>

<style>
    .form-container {
        max-width: 520px;
        margin: 2.5rem auto 0 auto;
        padding: 2.5rem 2rem 2rem 2rem;
        background: #f8fafc;
        border-radius: 1.2rem;
        box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
        border: 1px solid #e0e7ef;
    }
    .form-title {
        text-align: center;
        color: #2563eb;
        font-weight: 800;
        font-size: 2rem;
        margin-bottom: 2rem;
        letter-spacing: -0.5px;
    }
    .form-label {
        font-weight: 600;
        color: #334155;
        margin-bottom: 0.5rem;
        display: block;
    }
    .form-input, .form-textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
        font-size: 1rem;
        margin-bottom: 0.5rem;
        background: #fff;
        transition: border 0.2s;
    }
    .form-input:focus, .form-textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 2px #93c5fd;
    }
    .form-btn {
        background: #2563eb;
        color: #fff;
        font-weight: 600;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 8px 0 rgba(37,99,235,0.08);
        transition: background 0.2s;
    }
    .form-btn:hover {
        background: #1d4ed8;
    }
    .form-message {
        text-align: center;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    .form-message.error {
        color: #dc2626;
    }
    .form-message.success {
        color: #16a34a;
    }
    @media (max-width: 600px) {
        .form-container {
            padding: 1.2rem 0.5rem;
        }
        .form-title {
            font-size: 1.3rem;
        }
    }
</style>

<div class="form-container">
    <h2 class="form-title">Nueva reparación</h2>
    {#if error}
        <p class="form-message error">{error}</p>
    {/if}
    {#if success}
        <p class="form-message success">{success}</p>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div>
            <label for="diagnosis" class="form-label">Diagnóstico:</label>
            <input
                id="diagnosis"
                type="text"
                bind:value={diagnosis}
                minlength="5"
                maxlength="100"
                required
                class="form-input"
                placeholder="Describe el diagnóstico del problema"
            />
        </div>
        <div>
            <label for="repairActions" class="form-label">Acciones de reparación:</label>
            <textarea
                id="repairActions"
                bind:value={repairActions}
                minlength="5"
                maxlength="1000"
                required
                rows="4"
                class="form-textarea"
                placeholder="Indica las acciones realizadas para la reparación"
            ></textarea>
        </div>
        <div class="flex justify-end">
            <button
                type="submit"
                class="form-btn"
            >
                Crear reparación
            </button>
        </div>
    </form>
</div>