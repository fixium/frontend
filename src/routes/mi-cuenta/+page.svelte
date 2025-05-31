<script>
	import { fetchUserById, changePassword, deleteMyAccount } from '$lib/api/main-backend-requests/users.js';
	import { onMount } from 'svelte';

	export let data;
	let role = data.role;
	let userId = data.id;

	let user = null;
	let loading = true;
	let error = '';
	let showChangePassword = false;

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let passwordError = '';
	let passwordSuccess = '';
	let deleteError = '';
	let deleteSuccess = '';

	let confirmEmail = '';
	let confirmEmailError = '';

	let showDeleteModal = false;

	async function handleDeleteAccount() {
		deleteError = '';
		deleteSuccess = '';
		showDeleteModal = true;
	}

	async function confirmDeleteAccount() {
		confirmEmailError = '';
		if (confirmEmail.trim().toLowerCase() !== user.username.toLowerCase()) {
			confirmEmailError = 'El correo ingresado no coincide con el de tu cuenta.';
			return;
		}
		showDeleteModal = false;
		try {
			await deleteMyAccount();
			deleteSuccess = 'Tu cuenta ha sido eliminada correctamente.';
			goto('/auth/login');
		} catch (e) {
			deleteError = e.message;
		}
		confirmEmail = '';
	}
	function cancelDeleteAccount() {
		showDeleteModal = false;
		confirmEmail = '';
		confirmEmailError = '';
	}

	onMount(async () => {
		try {
			user = await fetchUserById(userId);
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	});

	async function handleChangePassword() {
		passwordError = '';
		passwordSuccess = '';
		if (newPassword !== confirmPassword) {
			passwordError = 'Las contraseñas no coinciden';
			return;
		}
		try {
			const response = await changePassword({
				oldPassword: currentPassword,
				newPassword: newPassword
			});
			passwordSuccess = response;
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			showChangePassword = false;
		} catch (e) {
			passwordError = e.message;
		}
	}
</script>

{#if showDeleteModal}
	<div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
		<div class="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full border border-red-200">
			<h2 class="text-xl font-bold text-red-700 mb-4">¿Eliminar cuenta?</h2>
			<p class="mb-4 text-gray-700">
				¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.<br />
				Por favor, ingresa tu correo <span class="font-semibold">{user.email}</span> para confirmar.
			</p>
			<input
				type="email"
				placeholder="Tu correo"
				bind:value={confirmEmail}
				class="input-focus w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none transition"
			/>
			{#if confirmEmailError}
				<div
					class="fade-in bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg mb-2 text-sm"
				>
					{confirmEmailError}
				</div>
			{/if}
			<div class="flex justify-end gap-3 mt-4">
				<button
					class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
					on:click={cancelDeleteAccount}
				>
					Cancelar
				</button>
				<button
					class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
					on:click={confirmDeleteAccount}
				>
					Eliminar
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="min-h-screen flex flex-col items-center py-10">
	<div class="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10 border border-blue-100">
		<h1 class="text-4xl font-extrabold text-blue-700 mb-8 text-center tracking-tight drop-shadow">
			Gestión de mi cuenta
		</h1>
		{#if loading}
			<div class="flex flex-col items-center justify-center py-10">
				<svg
					class="animate-spin h-8 w-8 text-blue-500 mb-2"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
				</svg>
				<p class="text-gray-500 text-center">Cargando usuario...</p>
			</div>
		{:else if error}
			<div
				class="fade-in flex items-center justify-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 shadow"
			>
				<svg
					class="w-6 h-6 mr-2 text-red-500"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
					/>
				</svg>
				<span>{error}</span>
			</div>
		{:else if user}
			<div class="flex flex-col items-center mb-8">
				<img
					src="https://ui-avatars.com/api/?name={user.name}&background=0D8ABC&color=fff"
					alt="Avatar"
					class="w-28 h-28 rounded-full mb-4 shadow-lg border-4 border-blue-200"
				/>
				<h2 class="text-2xl font-semibold text-gray-700">{user.name}</h2>
				<p class="text-gray-500">{user.username}</p>
			</div>
			<div class="mb-8 space-y-2">
				<div class="flex justify-between items-center">
					<span class="font-medium text-gray-600">Teléfono:</span>
					<span class="text-gray-800">{user.phoneNumber}</span>
				</div>
			</div>

			<button
				class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transition mb-6"
				on:click={() => (showChangePassword = !showChangePassword)}
			>
				{showChangePassword ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
			</button>

			{#if showChangePassword}
				<form
					on:submit|preventDefault={handleChangePassword}
					class="fade-in bg-blue-50 p-6 rounded-xl shadow-inner space-y-5 mb-4 border border-blue-200"
				>
					<div>
						<label for="current-password" class="block text-gray-700 mb-1 font-medium"
							>Contraseña actual:</label
						>
						<input
							id="current-password"
							type="password"
							bind:value={currentPassword}
							required
							class="input-focus w-full border border-gray-300 rounded px-3 py-2 focus:outline-none transition"
						/>
					</div>
					<div>
						<label for="new-password" class="block text-gray-700 mb-1 font-medium"
							>Nueva contraseña:</label
						>
						<input
							id="new-password"
							type="password"
							bind:value={newPassword}
							required
							class="input-focus w-full border border-gray-300 rounded px-3 py-2 focus:outline-none transition"
						/>
					</div>
					<div>
						<label for="confirm-password" class="block text-gray-700 mb-1 font-medium"
							>Confirmar nueva contraseña:</label
						>
						<input
							id="confirm-password"
							type="password"
							bind:value={confirmPassword}
							required
							class="input-focus w-full border border-gray-300 rounded px-3 py-2 focus:outline-none transition"
						/>
					</div>
					{#if passwordError}
						<div
							class="fade-in flex items-center bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg mt-2"
						>
							<svg
								class="w-5 h-5 mr-2 text-red-500"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
								/>
							</svg>
							<span>{passwordError}</span>
						</div>
					{/if}
					<button
						type="submit"
						class="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg shadow transition"
					>
						Guardar nueva contraseña
					</button>
				</form>
			{/if}

			{#if passwordSuccess}
				<div
					class="fade-in flex items-center justify-center bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 shadow"
				>
					<svg
						class="w-6 h-6 mr-2 text-green-500"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					<span>{passwordSuccess}</span>
				</div>
			{/if}

			{#if deleteError}
				<div
					class="fade-in flex items-center justify-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 shadow"
				>
					<svg
						class="w-6 h-6 mr-2 text-red-500"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
						/>
					</svg>
					<span>{deleteError}</span>
				</div>
			{/if}
			{#if deleteSuccess}
				<div
					class="fade-in flex items-center justify-center bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 shadow"
				>
					<svg
						class="w-6 h-6 mr-2 text-green-500"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					<span>{deleteSuccess}</span>
				</div>
			{/if}

			{#if role !== 'ROLE_ADMIN'}
				<div class="space-y-4">
					<button
						class="w-full bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 font-bold py-2 px-4 rounded-lg shadow transition"
						on:click={handleDeleteAccount}
					>
						Eliminar cuenta
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.fade-in {
		animation: fadeIn 0.5s;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.input-focus:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 2px #60a5fa33;
	}
</style>
