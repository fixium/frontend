<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import { getDashboardData, getTicketsCountByStatus, getUsersCountByRole } from '$lib/api/main-backend-requests/dashboard.js';
    import { getWorkshopDetails } from '$lib/api/main-backend-requests/workshop.js';

    export let data;

    let usuario = data.name;
    let rol = data.role;

    let totalTickets = '--';
    let totalRepairs = '--';
    let totalCustomers = '--';
    let totalUsers = '--';

    let ticketsByStatus = {};
    let usersByRole = {};
    let chartTickets, chartUsers;

    let workshopName = '';
    let workshopPhone = '';
    let workshopEmail = '';

    async function fetchStats() {
        // Dashboard resumen
        const dashboardRes = await getDashboardData();
        const dashboardData = await dashboardRes.json();
        totalTickets = dashboardData.totalTickets;
        totalRepairs = dashboardData.totalRepairs;
        totalCustomers = dashboardData.totalCustomers;

        // Tickets por estado
        const statusCounts = await getTicketsCountByStatus();
        ticketsByStatus = statusCounts.reduce((acc, item) => {
            acc[item.status] = item.count;
            return acc;
        }, {});

        // Usuarios por rol (nuevo endpoint)
        const usersByRoleArr = await getUsersCountByRole();
        usersByRole = usersByRoleArr.reduce((acc, item) => {
            acc[item.role] = item.count;
            return acc;
        }, {});
        totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0);

        // Datos del taller
        try {
            const workshop = await getWorkshopDetails();
            workshopName = workshop.name;
            workshopPhone = workshop.phoneNumber;
            workshopEmail = workshop.contactEmail;
        } catch (e) {
            workshopName = 'No disponible';
            workshopPhone = '';
            workshopEmail = '';
        }
    }

    function renderCharts() {
        // Tickets por estado
        const ctx1 = document.getElementById('ticketsChart').getContext('2d');
        if (chartTickets) chartTickets.destroy();
        chartTickets = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: Object.keys(ticketsByStatus),
                datasets: [{
                    data: Object.values(ticketsByStatus),
                    backgroundColor: [
                        '#2563eb', '#22d3ee', '#f59e42', '#22c55e', '#ef4444', '#64748b'
                    ],
                }]
            },
            options: {
                plugins: {
                    legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--dashboard-text') || '#222' } }
                }
            }
        });

        // Usuarios por rol
        const ctx2 = document.getElementById('usersChart').getContext('2d');
        if (chartUsers) chartUsers.destroy();
        chartUsers = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(usersByRole),
                datasets: [{
                    label: 'Usuarios',
                    data: Object.values(usersByRole),
                    backgroundColor: '#2563eb'
                }]
            },
            options: {
                scales: {
                    x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--dashboard-text') || '#222' } },
                    y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--dashboard-text') || '#222' } }
                },
                plugins: {
                    legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--dashboard-text') || '#222' } }
                }
            }
        });
    }

    onMount(async () => {
        await fetchStats();
        // Espera al DOM para los canvas
        setTimeout(renderCharts, 100);
    });

    // Redibuja los gráficos si cambia el modo oscuro
    if (typeof window !== 'undefined') {
        const observer = new MutationObserver(() => setTimeout(renderCharts, 100));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
</script>

<div class="dashboard-container bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
    <div class="dashboard-header">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Fixium</h1>
            <p class="dashboard-user text-gray-600 dark:text-gray-300">
                Usuario: <strong>{usuario}</strong> | Rol: <strong>{rol ? rol.replace('ROLE_', '') : ''}</strong>
            </p>
        </div>
        <div class="dashboard-workshop text-gray-500 dark:text-gray-400" style="text-align: right;">
            <strong>Taller:</strong> {workshopName}
            {#if workshopPhone}
                <span> | <strong>Tel:</strong> {workshopPhone}</span>
            {/if}
            {#if workshopEmail}
                <span> | <strong>Email:</strong> {workshopEmail}</span>
            {/if}
        </div>
    </div>
    <div class="dashboard-cards">
        <div class="dashboard-card">
            <h2>Total de tickets</h2>
            <p class="dashboard-value">{totalTickets}</p>
        </div>
        <div class="dashboard-card">
            <h2>Reparaciones hoy</h2>
            <p class="dashboard-value">{totalRepairs}</p>
        </div>
        <div class="dashboard-card">
            <h2>Clientes registrados</h2>
            <p class="dashboard-value">{totalCustomers}</p>
        </div>
        <div class="dashboard-card">
            <h2>Usuarios</h2>
            <p class="dashboard-value">{totalUsers}</p>
        </div>
    </div>

    <div class="charts-grid">
        <div class="chart-card">
            <h3 class="chart-title">Tickets por estado</h3>
            <canvas id="ticketsChart" width="320" height="220"></canvas>
        </div>
        <div class="chart-card">
            <h3 class="chart-title">Usuarios por rol</h3>
            <canvas id="usersChart" width="320" height="220"></canvas>
        </div>
    </div>
</div>

<style>
    :root {
        --dashboard-bg: #f9fafb;
        /* --dashboard-bg-dark: #18181b; */
        --dashboard-card: #fff;
        --dashboard-card-dark: #23272f;
        --dashboard-text: #222;
        --dashboard-text-dark: #f3f3f3;
    }
    .workshop-info span {
        margin-right: 1.5rem;
    }
    .dashboard-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        min-height: 100vh;
        padding: 2rem 1rem;
        background: var(--dashboard-bg);
        transition: background 0.3s;
    }
    :global(.dark) .dashboard-container {
        background: var(--dashboard-bg-dark);
    }
    .dashboard-header {
        width: 100%;
        max-width: 900px;
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .dashboard-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--dashboard-text);
    }
    :global(.dark) .dashboard-header h1 {
        color: var(--dashboard-text-dark);
    }
    .dashboard-user {
        font-size: 1rem;
        color: #64748b;
    }
    :global(.dark) .dashboard-user {
        color: #cbd5e1;
    }
    .dashboard-cards {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    .dashboard-card {
        background: var(--dashboard-card);
        border-radius: 1rem;
        box-shadow: 0 2px 16px 0 rgba(37, 99, 235, 0.07);
        padding: 2rem 2.5rem;
        min-width: 220px;
        text-align: center;
        transition: background 0.3s;
    }
    :global(.dark) .dashboard-card {
        background: var(--dashboard-card-dark);
    }
    .dashboard-card h2 {
        font-size: 1.2rem;
        color: #334155;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    :global(.dark) .dashboard-card h2 {
        color: #cbd5e1;
    }
    .dashboard-value {
        font-size: 2.2rem;
        font-weight: 800;
        color: #2563eb;
    }
    .charts-grid {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    .chart-card {
        background: var(--dashboard-card);
        border-radius: 1rem;
        box-shadow: 0 2px 16px 0 rgba(37, 99, 235, 0.07);
        padding: 1.5rem 2rem;
        min-width: 340px;
        transition: background 0.3s;
    }
    :global(.dark) .chart-card {
        background: var(--dashboard-card-dark);
    }
    .chart-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #334155;
    }
    :global(.dark) .chart-title {
        color: #cbd5e1;
    }
</style>