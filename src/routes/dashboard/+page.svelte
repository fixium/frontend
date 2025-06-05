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
        const dashboardRes = await getDashboardData();
        const dashboardData = await dashboardRes.json();
        totalTickets = dashboardData.totalTickets;
        totalRepairs = dashboardData.totalRepairs;
        totalCustomers = dashboardData.totalCustomers;

        const statusCounts = await getTicketsCountByStatus();
        ticketsByStatus = statusCounts.reduce((acc, item) => {
            acc[item.status] = item.count;
            return acc;
        }, {});

        const usersByRoleArr = await getUsersCountByRole();
        usersByRole = usersByRoleArr.reduce((acc, item) => {
            acc[item.role] = item.count;
            return acc;
        }, {});
        totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0);

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
        const ctx1 = document.getElementById('ticketsChart').getContext('2d');
        if (chartTickets) chartTickets.destroy();
        chartTickets = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: Object.keys(ticketsByStatus),
                datasets: [{
                    data: Object.values(ticketsByStatus),
                    backgroundColor: ['#2563eb', '#22d3ee', '#f59e42', '#22c55e', '#ef4444', '#64748b'],
                }]
            },
            options: {
                plugins: {
                    legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--dashboard-text') || '#222' } }
                }
            }
        });

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
        setTimeout(renderCharts, 100);
    });

    if (typeof window !== 'undefined') {
        const observer = new MutationObserver(() => setTimeout(renderCharts, 100));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
</script>

<div class="flex flex-col gap-10 px-6 py-8 md:px-12 bg-gradient-to-br from-white to-slate-100 dark:from-zinc-900 dark:to-slate-950 min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-300 dark:border-slate-700 pb-4">
        <div>
            <h1 class="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 drop-shadow">Dashboard Fixium</h1>
            <p class="text-slate-600 dark:text-slate-300 mt-1">
                👤 <strong>{usuario}</strong> <span class="mx-2 text-gray-400">|</span> 🛡️ <strong>{rol ? rol.replace('ROLE_', '') : ''}</strong>
            </p>
        </div>
        <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 text-right leading-relaxed">
            <div class="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                <i class="fa-solid fa-industry text-blue-600 dark:text-blue-400"></i>
            </div>
            <div>
                <strong>🏭 Taller:</strong> {workshopName}
                {#if workshopPhone}<br><strong>📞 Tel:</strong> {workshopPhone}{/if}
                {#if workshopEmail}<br><strong>✉️ Email:</strong> {workshopEmail}{/if}
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="dashboard-card flex items-center gap-4 bg-blue-50 dark:bg-blue-900/30">
        <div class="text-blue-500 text-4xl"><i class="fa-solid fa-ticket"></i></div>
        <div>
            <h2 class="dashboard-card-title">Total de tickets</h2>
            {#if totalTickets === '--'}
                <div class="flex justify-center items-center h-20">
                    <span class="loader"></span>
                </div>
            {:else}
                <p class="dashboard-value">{totalTickets}</p>
            {/if}
        </div>
    </div>
    <div class="dashboard-card flex items-center gap-4 bg-green-50 dark:bg-green-900/30">
        <div class="text-green-500 text-4xl"><i class="fa-solid fa-screwdriver-wrench"></i></div>
        <div>
            <h2 class="dashboard-card-title">Reparaciones hoy</h2>
            {#if totalRepairs === '--'}
                <div class="flex justify-center items-center h-20">
                    <span class="loader"></span>
                </div>
            {:else}
                <p class="dashboard-value">{totalRepairs}</p>
            {/if}
        </div>
    </div>
    <div class="dashboard-card flex items-center gap-4 bg-yellow-50 dark:bg-yellow-900/30">
    <div class="text-yellow-500 text-4xl"><i class="fa-solid fa-users"></i></div>
    <div>
        <h2 class="dashboard-card-title">Clientes registrados</h2>
        {#if totalCustomers === '--'}
            <div class="flex justify-center items-center h-20">
                <span class="loader"></span>
            </div>
        {:else}
            <p class="dashboard-value">{totalCustomers}</p>
        {/if}
    </div>
</div>
    <div class="dashboard-card flex items-center gap-4 bg-purple-50 dark:bg-purple-900/30">
    <div class="text-purple-500 text-4xl"><i class="fa-solid fa-user-shield"></i></div>
    <div>
        <h2 class="dashboard-card-title">Usuarios</h2>
        {#if totalUsers === '--'}
            <div class="flex justify-center items-center h-20">
                <span class="loader"></span>
            </div>
        {:else}
            <p class="dashboard-value">{totalUsers}</p>
        {/if}
    </div>
</div>
</div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="chart-card bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 transition hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500">
        <h3 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-6 text-center tracking-tight">Tickets por estado</h3>
        <div class="relative w-full max-w-[420px] h-[280px] flex items-center justify-center">
            <canvas id="ticketsChart" class="dashboard-chart"></canvas>
        </div>
    </div>
    <div class="chart-card bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 transition hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500">
        <h3 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-6 text-center tracking-tight">Usuarios por rol</h3>
        <div class="relative w-full max-w-[420px] h-[280px] flex items-center justify-center">
            <canvas id="usersChart" class="dashboard-chart"></canvas>
        </div>
    </div>
</div>
</div>


<style>
    .loader {
        border: 4px solid #e5e7eb;
        border-top: 4px solid #2563eb;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    :root {
    --dashboard-bg: linear-gradient(135deg, #f0f4ff 0%, #f9fafb 100%);
    --dashboard-bg-dark: linear-gradient(135deg, #18181b 0%, #23272f 100%);
    --dashboard-card: #fff;
    --dashboard-card-dark: #23272f;
    --dashboard-text: #222;
    --dashboard-text-dark: #f3f3f3;
    --dashboard-accent: #2563eb;
    --dashboard-accent-light: #60a5fa;
    --dashboard-separator: #e5e7eb;
    --dashboard-separator-dark: #334155;
}

.dashboard-card {
    background: var(--dashboard-card);
    border-radius: 1.2rem;
    box-shadow: 0 4px 24px 0 rgba(37, 99, 235, 0.09);
    padding: 2.2rem 2.7rem;
    min-width: 220px;
    text-align: center;
    transition: background 0.3s, box-shadow 0.2s, border 0.2s;
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.7s forwards;
}
.dashboard-card:nth-child(2) { animation-delay: 0.1s; }
.dashboard-card:nth-child(3) { animation-delay: 0.2s; }
.dashboard-card:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: none;
    }
}

.dashboard-card:hover {
    border: 2px solid var(--dashboard-accent);
    box-shadow: 0 8px 32px 0 rgba(37, 99, 235, 0.14);
    z-index: 1;
}
:global(.dark) .dashboard-card {
    background: var(--dashboard-card-dark);
}
.dashboard-card h2 {
    font-size: 1.15rem;
    color: #334155;
    margin-bottom: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
}
:global(.dark) .dashboard-card h2 {
    color: #cbd5e1;
}
.dashboard-value {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--dashboard-accent);
    letter-spacing: -1px;
    margin-top: 0.3rem;
    margin-bottom: 0.2rem;
    text-shadow: 0 2px 8px rgba(37,99,235,0.08);
}

canvas {
    border-radius: 1rem;
    background: linear-gradient(135deg, #f1f5fd 0%, #fff 100%);
    box-shadow: 0 2px 8px 0 rgba(37, 99, 235, 0.04);
}
:global(.dark) canvas {
    background: linear-gradient(135deg, #23272f 0%, #18181b 100%);
}
@media (max-width: 900px) {
    .dashboard-card, .chart-card {
        min-width: unset;
        width: 100%;
    }
}
</style>