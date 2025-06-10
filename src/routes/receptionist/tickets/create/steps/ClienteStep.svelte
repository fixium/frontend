<script>
	import { wizardData } from '$lib/stores/wizardStore';
	import { registerCustomer, getCustomers } from '$lib/api/main-backend-requests/customers';
	import { step } from '$lib/stores/stepStore';
	import { onMount } from 'svelte';
	import { validatePhoneNumber, validateName } from '$lib/utils/validation';

	let customers = [],
		filteredCustomers = [];
	let name = '',
		phone = '',
		notes = '';
	let email = ''; // solo para búsqueda
	let registerEmail = ''; // solo para registro
	let selectedCustomerId = '',
		loading = false,
		error = null;

	onMount(async () => {
		try {
			customers = await getCustomers();
		} catch (err) {
			error = err.message;
		}
	});

	$: filteredCustomers = email.length
		? customers.filter((c) => c.email.toLowerCase().includes(email.toLowerCase()))
		: [];

	function cargarCliente(c) {
		selectedCustomerId = String(c.id);
		name = c.name ?? '';
		phone = c.phone ?? '';
		registerEmail = c.email ?? '';
		notes = c.notes ?? '';
	}

	function resetFormulario() {
		selectedCustomerId = 'new';
		name = '';
		phone = '';
		registerEmail = '';
		notes = '';
	}

	async function submit() {
		loading = true;
		error = null;

		try {
			if (selectedCustomerId && selectedCustomerId !== 'new') {
				wizardData.update((data) => ({ ...data, customerId: Number(selectedCustomerId) }));
			} else {
				const customerId = await registerCustomer({ name, phone, email: registerEmail, notes });
				wizardData.update((data) => ({ ...data, customerId: customerId, isNewClient: true }));
			}
			step.set(2);
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="p-8 rounded-2xl shadow-xl bg-white max-w-lg mx-auto mt-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
>
	<h2 class="text-2xl font-extrabold text-blue-700 mb-6 text-center dark:text-blue-300">
		<i class="fa fa-user-plus mr-2"></i>
		Registrar cliente
	</h2>

	{#if error}
		<p class="text-red-600 mb-4 text-center font-semibold">
			<i class="fa fa-exclamation-circle mr-1"></i>{error}
		</p>
	{/if}

	<!-- Buscar cliente -->
	<label
		for="buscar-cliente-email"
		class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
	>
		<i class="fa fa-search mr-1"></i>
		Buscar cliente:
	</label>
	<div class="relative">
		<i class="fa fa-envelope absolute left-3 top-3 text-gray-400"></i>
		<input
			id="buscar-cliente-email"
			type="email"
			placeholder="Ej: cliente@email.com"
			class="form-input w-full mb-2 pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
			bind:value={email}
			on:input={() => {
				if (email.length === 0) {
					resetFormulario();
				} else {
					const c = customers.find((c) => c.email === email);
					if (c) cargarCliente(c);
					else selectedCustomerId = '';
				}
			}}
			autocomplete="off"
		/>
	</div>

	{#if email.length > 0 && filteredCustomers.length > 0 && !selectedCustomerId}
		<ul
			class="border border-blue-200 rounded-lg mt-2 shadow max-h-40 overflow-auto animate-fade-in"
		>
			{#each filteredCustomers as c}
				<button
					type="button"
					class="w-full text-left px-4 py-2 cursor-pointer hover:bg-blue-100 focus:outline-none focus:bg-blue-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-600"
					on:click={() => cargarCliente(c)}
				>
					<i class="fa fa-user mr-2"></i>
					{c.email} ({c.phone})
				</button>
			{/each}
		</ul>
	{:else if email.length > 0 && filteredCustomers.length === 0}
		<div class="text-gray-400 text-sm mt-2">
			<i class="fa fa-info-circle mr-1"></i>
			No se encontraron clientes.
		</div>
	{/if}

	<div class="mt-4 text-right">
		<button
			on:click={resetFormulario}
			class="text-sm font-semibold text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
		>
			<i class="fa fa-user-plus mr-1"></i>
			Registrar nuevo cliente
		</button>
	</div>

	<!-- Datos del cliente -->
	{#if selectedCustomerId && selectedCustomerId !== 'new'}
		<div
			class="bg-blue-50 border border-blue-300 rounded-lg p-4 mt-4 animate-fade-in dark:bg-gray-700 dark:border-gray-600"
		>
			<p class="text-blue-900 text-sm dark:text-gray-300">
				<i class="fa fa-user mr-1"></i>
				Nombre: <strong>{name}</strong>
			</p>
			<p class="text-blue-900 text-sm dark:text-gray-300">
				<i class="fa fa-envelope mr-1"></i>
				Correo: <strong>{registerEmail}</strong>
			</p>
			<p class="text-blue-900 text-sm dark:text-gray-300">
				<i class="fa fa-phone mr-1"></i>
				Teléfono: <strong>{phone}</strong>
			</p>
			{#if notes}
				<p class="text-blue-900 text-sm dark:text-gray-300">
					<i class="fa fa-sticky-note mr-1"></i>
					Notas: <strong>{notes}</strong>
				</p>
			{/if}
		</div>
	{/if}

	{#if !selectedCustomerId || selectedCustomerId === 'new'}
		<form on:submit|preventDefault={submit} class="space-y-4 mt-6 animate-fade-in">
			<div class="relative">
				<i class="fa fa-user absolute left-3 top-3 text-gray-400"></i>
				<input
					type="text"
					bind:value={name}
					placeholder="Nombre completo"
					class="form-input w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
					required
					on:input={(e) => (name = validateName(e.target.value))}
				/>
			</div>
			<div class="relative">
				<i class="fa fa-phone absolute left-3 top-3 text-gray-400"></i>
				<input
					type="tel"
					bind:value={phone}
					placeholder="Teléfono (10 dígitos)"
					class="form-input w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
					required
					on:input={(e) => (phone = validatePhoneNumber(e.target.value))}
					maxlength="10"
				/>
			</div>
			<div class="relative">
				<i class="fa fa-envelope absolute left-3 top-3 text-gray-400"></i>
				<input
					type="email"
					bind:value={registerEmail}
					placeholder="Correo electrónico"
					class="form-input w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
					autocomplete="email"
					required
				/>
			</div>
			<div class="relative">
				<i class="fa fa-sticky-note absolute left-3 top-3 text-gray-400"></i>
				<textarea
					bind:value={notes}
					placeholder="Notas (opcional)"
					class="form-textarea w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
					rows="3"
				></textarea>
			</div>
		</form>
	{/if}

	<div class="flex justify-end mt-6">
		<button
			on:click={submit}
			class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition flex items-center"
			disabled={loading || !name || !phone || !registerEmail}
		>
			<i class="fa fa-arrow-right mr-2"></i>
			{loading ? 'Cargando...' : 'Siguiente'}
		</button>
	</div>
</div>

<style>
	.animate-fade-in {
		animation: fadeIn 0.3s;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	button:disabled {
		background-color: #cbd5e1; /* gris claro */
		color: #94a3b8; /* texto gris */
		cursor: not-allowed;
		opacity: 0.7;
	}
</style>
