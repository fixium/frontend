<script>
	import { onMount } from 'svelte';
	import { getDashboardData } from '$lib/api/apiDashboard.js';

	export let data;

	let usuario = data.name;
	let rol = data.role;

	// Variables reactivas para los valores del dashboard
	let totalTickets = '--';
	let totalRepairs = '--';
	let totalClients = '--';

	onMount(async () => {
		try {
			const response = await getDashboardData();
			const dashboardData = await response.json();

			totalTickets = dashboardData.totalTickets;
			totalRepairs = dashboardData.totalRepairs;
			totalClients = dashboardData.totalClients;
		} catch (e) {
			totalTickets = totalRepairs = totalClients = 'Error';
		}
	});
</script>

<div class="dashboard-container">
	<div class="dashboard-header">
		<div>
			<h1>Dashboard Fixium</h1>
			<p class="dashboard-user">
				Usuario: <strong>{usuario}</strong> | Rol: <strong>{rol}</strong>
			</p>
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
			<p class="dashboard-value">{totalClients}</p>
		</div>
	</div>
</div>

<style>
	.dashboard-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		min-height: 100vh;
		padding: 2rem 1rem;
		background: #f8fafc;
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
		color: #2563eb;
		margin-bottom: 0.5rem;
	}
	.dashboard-user {
		font-size: 1rem;
		color: #64748b;
	}
	.dashboard-cards {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.dashboard-card {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 2px 16px 0 rgba(37, 99, 235, 0.07);
		padding: 2rem 2.5rem;
		min-width: 220px;
		text-align: center;
	}
	.dashboard-card h2 {
		font-size: 1.2rem;
		color: #334155;
		margin-bottom: 1rem;
		font-weight: 600;
	}
	.dashboard-value {
		font-size: 2.2rem;
		font-weight: 800;
		color: #2563eb;
	}
</style>
