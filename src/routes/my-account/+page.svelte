<script>
	import {
		fetchUserById,
		changePassword,
		deleteMyAccount
	} from '$lib/api/main-backend-requests/users.js';
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

	let successTimeout;
	let errorTimeout;

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
			clearTimeout(successTimeout);
			successTimeout = setTimeout(() => (deleteSuccess = ''), 3000);
			goto('/auth/login');
		} catch (e) {
			deleteError = e.message;
			clearTimeout(errorTimeout);
			errorTimeout = setTimeout(() => (deleteError = ''), 3000);
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
			clearTimeout(errorTimeout);
			errorTimeout = setTimeout(() => (passwordError = ''), 3000);
			return;
		}
		try {
			const response = await changePassword({
				oldPassword: currentPassword,
				newPassword: newPassword
			});
			passwordSuccess = response;
			clearTimeout(successTimeout);
			successTimeout = setTimeout(() => (passwordSuccess = ''), 3000);
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			showChangePassword = false;
		} catch (e) {
			passwordError = e.message;
			clearTimeout(errorTimeout);
			errorTimeout = setTimeout(() => (passwordError = ''), 3000);
		}
	}
</script>

{#if showDeleteModal}
	<div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
		<div class="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full border border-red-200">
			<h2 class="text-xl font-bold text-red-700 mb-4">
				<i class="fa fa-exclamation-triangle mr-2"></i>
				¿Eliminar cuenta?
			</h2>
			<p class="mb-4 text-gray-700">
				¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.<br />
				Por favor, ingresa tu correo <span class="font-semibold">{user.email}</span> para confirmar.
			</p>
			<div class="relative">
				<i class="fa fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
				<input
					type="email"
					placeholder="Tu correo"
					bind:value={confirmEmail}
					class="input-focus w-full border border-gray-300 rounded px-3 py-2 mb-2 pl-10 focus:outline-none transition"
				/>
			</div>
			{#if confirmEmailError}
				<div
					class="fade-in bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg mb-2 text-sm flex items-center gap-2"
				>
					<i class="fa fa-exclamation-circle"></i>
					{confirmEmailError}
				</div>
			{/if}
			<div class="flex justify-end gap-3 mt-4">
				<button
					class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold flex items-center gap-2"
					on:click={cancelDeleteAccount}
				>
					<i class="fa fa-times"></i>
					Cancelar
				</button>
				<button
					class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
					on:click={confirmDeleteAccount}
				>
					<i class="fa fa-trash"></i>
					Eliminar
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="min-h-screen flex flex-col items-center py-10">
	<div class="w-full max-w-xl rounded-2xl shadow-2xl p-10 border border-blue-100">
		<h1
			class="text-4xl font-extrabold text-blue-700 mb-8 text-center tracking-tight drop-shadow dark:text-blue-200"
		>
			<i class="fa fa-user-cog mr-2"></i>
			Gestión de mi cuenta
		</h1>
		{#if loading}
			<div class="flex flex-col items-center justify-center py-10">
				<i class="fa fa-spinner fa-spin h-8 w-8 text-blue-500 mb-2 text-3xl"></i>
				<p class="text-gray-500 text-center dark:text-gray-400">Cargando usuario...</p>
			</div>
		{:else if error}
			<!-- Mensaje de error -->
			<div
				class="fade-in flex items-center justify-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 shadow gap-2"
			>
				<i class="fa fa-times-circle text-red-500"></i>
				<span>{error}</span>
			</div>
		{:else if user}
			<div class="flex flex-col items-center mb-8">
				<img
					src="https://ui-avatars.com/api/?name={user.name}&background=0D8ABC&color=fff"
					alt="Avatar"
					class="w-28 h-28 rounded-full mb-4 shadow-lg border-4 border-blue-200"
				/>
				<h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
					<i class="fa fa-user mr-2"></i>{user.name}
				</h2>
				<p class="text-gray-500 dark:text-gray-400 flex items-center gap-2">
					<i class="fa fa-envelope"></i>
					{user.username}
				</p>
			</div>
			<div class="mb-8 space-y-2">
				<div class="flex justify-between items-center">
					<span class="font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
						<i class="fa fa-phone"></i>Teléfono:
					</span>
					<span class="text-gray-800 dark:text-gray-200">{user.phoneNumber}</span>
				</div>
			</div>

			<button
				class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transition mb-6 flex items-center justify-center gap-2"
				on:click={() => (showChangePassword = !showChangePassword)}
			>
				<i class="fa fa-key"></i>
				{showChangePassword ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
			</button>

			{#if showChangePassword}
				<form
					on:submit|preventDefault={handleChangePassword}
					class="fade-in bg-blue-50 p-6 rounded-xl shadow-inner space-y-5 mb-4 border border-blue-200 dark:bg-gray-800 dark:border-blue-700"
				>
					<div>
						<label
							for="current-password"
							class="block text-gray-700 mb-1 font-medium dark:text-gray-300 flex items-center gap-2"
							><i class="fa fa-lock"></i>Contraseña actual:</label
						>
						<input
							id="current-password"
							type="password"
							bind:value={currentPassword}
							required
							class="input-focus w-full border border-gray-300 rounded px-3 py-2 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
						/>
					</div>
					<div>
						<label
							for="new-password"
							class="block text-gray-700 mb-1 font-medium dark:text-gray-300 flex items-center gap-2"
							><i class="fa fa-lock"></i>Nueva contraseña:</label
						>
						<input
							id="new-password"
							type="password"
							bind:value={newPassword}
							required
							class="input-focus w-full border border-gray-300 rounded px-3 py-2 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
						/>
					</div>
					<div>
						<label
							for="confirm-password"
							class="block text-gray-700 mb-1 font-medium dark:text-gray-300 flex items-center gap-2"
							><i class="fa fa-lock"></i>Confirmar nueva contraseña:</label
						>
						<input
							id="confirm-password"
							type="password"
							bind:value={confirmPassword}
							required
							class="input-focus w-full border border-gray-300 rounded px-3 py-2 focus:outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
						/>
					</div>
					{#if passwordError}
						<div
							class="fade-in flex items-center bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg mt-2 gap-2"
						>
							<i class="fa fa-exclamation-circle"></i>
							<span>{passwordError}</span>
						</div>
					{/if}
					<button
						type="submit"
						class="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg shadow transition flex items-center justify-center gap-2"
					>
						<i class="fa fa-save"></i>
						Guardar nueva contraseña
					</button>
				</form>
			{/if}

			{#if passwordSuccess}
				<div
					class="fade-in flex items-center justify-center bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 shadow gap-2"
				>
					<i class="fa fa-check-circle"></i>
					<span>{passwordSuccess}</span>
				</div>
			{/if}

			{#if deleteError}
				<div
					class="fade-in flex items-center justify-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 shadow gap-2"
				>
					<i class="fa fa-exclamation-circle"></i>
					<span>{deleteError}</span>
				</div>
			{/if}
			{#if deleteSuccess}
				<div
					class="fade-in flex items-center justify-center bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4 shadow gap-2"
				>
					<i class="fa fa-check-circle"></i>
					<span>{deleteSuccess}</span>
				</div>
			{/if}

			{#if role !== 'ROLE_ADMIN'}
				<div class="space-y-4">
					<button
						class="w-full bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 font-bold py-2 px-4 rounded-lg shadow transition flex items-center justify-center gap-2"
						on:click={handleDeleteAccount}
					>
						<i class="fa fa-trash"></i>
						Eliminar cuenta
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>
