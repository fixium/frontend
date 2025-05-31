<script>
    import { deleteUser as apiDeleteUser } from '$lib/api/main-backend-requests/users.js';

    export let data;
    let users = data.users;
    
    let showModal = false;
    let isDeleting = false;
    let userToDelete = null;
    let emailConfirmation = '';

    function confirmDelete(user) {
        userToDelete = user;
        emailConfirmation = '';
        showModal = true;
    }

    async function deleteUser() {
        isDeleting = true;
        try {
            await apiDeleteUser(userToDelete.id);
            users = users.filter(user => user.id !== userToDelete.id);
            showModal = false;
            userToDelete = null;
        } catch (error) {
            alert('Error al eliminar el usuario: ' + error.message);
        } finally {
            isDeleting = false;
        }
    }
</script>

<h1 class="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight">Usuarios registrados</h1>

<div class="flex justify-end mb-4">
    <a href="/admin/usuarios/nuevo" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-semibold mb-4">
        Registrar Usuario
    </a>
</div>

<div class="overflow-x-auto rounded-xl shadow-lg bg-white">
    <!-- Header fijo -->
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-600 sticky top-0 z-10">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Correo</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Teléfono</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Rol</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Fecha de Creación</th>
                <th class="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
            </tr>
        </thead>
    </table>
    <!-- Cuerpo con scroll -->
    <div class="max-h-[500px] overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <tbody class="bg-white divide-y divide-gray-100">
                {#each users as user}
                    <tr class="hover:bg-blue-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phoneNumber}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold 
                                {user.role === 'TECHNICIAN' ? 'bg-blue-100 text-blue-800' : ''}
                                {user.role === 'RECEPTIONIST' ? 'bg-yellow-100 text-yellow-800' : ''}
                                {user.role === 'ADMIN' ? 'bg-green-100 text-green-800' : ''}">
                                {user.role}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                            <a 
                                href={`usuarios/editar/${user.id}`} 
                                class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
                            >
                                Editar
                            </a>
                            <button 
                                on:click={() => confirmDelete(user)} 
                                class="bg-red-500 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded-full shadow transition-all duration-150"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

{#if showModal}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-center w-full">Eliminación de usuario</h2>
            <button on:click={() => (showModal = false)} class="text-2xl font-bold text-black absolute top-4 right-6">✕</button>
        </div>

        <div class="mt-6">
            <p class="text-center text-gray-800 mb-4">
                ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.name}</strong>?
            </p>
            <input 
                id="emailConfirmation" 
                type="text" 
                bind:value={emailConfirmation} 
                class="w-full border-4 border-black text-center text-lg rounded-full px-4 py-3 focus:outline-none"
                placeholder="Correo electrónico:"
            />
        </div>

        <div class="mt-6 flex flex-col space-y-4">
            <button 
                on:click={deleteUser} 
                class="w-full rounded-full py-3 text-white text-lg font-semibold transition
                    {emailConfirmation !== userToDelete.username || isDeleting
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'}"
                disabled={emailConfirmation !== userToDelete.username || isDeleting}
            >
                {#if isDeleting}
                    <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                {:else}
                    Confirmar
                {/if}
            </button>
            <button 
                on:click={() => (showModal = false)} 
                class="w-full bg-red-500 hover:bg-red-600 text-white text-lg font-semibold py-3 rounded-full transition"
            >
                Cancelar
            </button>
        </div>
    </div>
</div>
{/if}