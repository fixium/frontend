<script>
import { fetchUserById, changePassword } from '$lib/api/apiUsers.js';
import { onMount } from 'svelte';

export let data;
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

onMount(async () => {
    try {
        user = await fetchUserById(userId);
        console.log('Usuario cargado:', user);
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
        await changePassword({
            userId,
            currentPassword,
            newPassword
        });
        passwordSuccess = 'Contraseña cambiada correctamente';
        currentPassword = '';
        newPassword = '';
        confirmPassword = '';
        showChangePassword = false;
    } catch (e) {
        passwordError = e.message;
    }
}
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <div class="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Gestión de mi cuenta</h1>
        {#if loading}
            <p class="text-gray-500 text-center">Cargando usuario...</p>
        {:else if error}
            <p class="text-red-500 text-center">{error}</p>
        {:else if user}
            <div class="flex flex-col items-center mb-8">
                <!-- Avatar de usuario de acuerdo al nombre -->
                <img src="https://ui-avatars.com/api/?name={user.name}&background=0D8ABC&color=fff" alt="Avatar" class="w-24 h-24 rounded-full mb-4 shadow" />
                <h2 class="text-xl font-semibold text-gray-700">{user.name}</h2>
                <p class="text-gray-500">@{user.username}</p>
            </div>
            <div class="mb-6 space-y-2">
                <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Teléfono:</span>
                    <span class="text-gray-800">{user.phoneNumber}</span>
                </div>
            </div>

            <button
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition mb-4"
                on:click={() => showChangePassword = !showChangePassword}
            >
                {showChangePassword ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
            </button>

            {#if showChangePassword}
                <form on:submit|preventDefault={handleChangePassword} class="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4 mb-4">
                    <div>
                        <label for="current-password" class="block text-gray-700 mb-1">Contraseña actual:</label>
                        <input id="current-password" type="password" bind:value={currentPassword} required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-1">Nueva contraseña:</label>
                        <input type="password" bind:value={newPassword} required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-1">Confirmar nueva contraseña:</label>
                        <input type="password" bind:value={confirmPassword} required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    {#if passwordError}
                        <p class="text-red-500">{passwordError}</p>
                    {/if}
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
                        Guardar nueva contraseña
                    </button>
                </form>
            {/if}

            {#if passwordSuccess}
                <p class="text-green-600 text-center mb-4">{passwordSuccess}</p>
            {/if}

            <!-- Sugerencias de secciones adicionales -->
            <div class="mt-8 space-y-4">
                <button class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition">
                    Editar información personal
                </button>
                <button class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition">
                    Preferencias de notificación
                </button>
                <button class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition">
                    Ver historial de actividad
                </button>
                <button class="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded transition">
                    Eliminar cuenta
                </button>
            </div>
        {/if}
    </div>
</div>