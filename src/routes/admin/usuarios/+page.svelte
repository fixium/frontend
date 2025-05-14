<script>
    import { deleteUser as apiDeleteUser } from '$lib/api/apiCloud';

    export let data;
    let users = data.users;
    
    let showModal = false;
    let userToDelete = null;
    let emailConfirmation = '';

    function confirmDelete(user) {
        userToDelete = user;
        emailConfirmation = '';
        showModal = true;
    }

    async function deleteUser() {
        try {
            await apiDeleteUser(userToDelete.id);
            users = users.filter(user => user.id !== userToDelete.id);
            showModal = false;
            userToDelete = null;
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            alert('Error al eliminar el usuario.');
        }
    }
</script>

<h1 class="text-2xl font-bold mb-4">Usuarios registrados</h1>

<div class="flex justify-end mb-4">
    <a href="/admin/usuarios/nuevo" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
        Registrar Usuario
    </a>
</div>

<div class="overflow-x-auto">
    <table class="table-auto w-full border-collapse border border-gray-500">
        <thead>
            <tr class="bg-blue-400">
                <th class="border border-gray-300 px-4 py-2">ID</th>
                <th class="border border-gray-300 px-4 py-2">Nombre</th>
                <th class="border border-gray-300 px-4 py-2">Teléfono</th>
                <th class="border border-gray-300 px-4 py-2">Rol</th>
                <th class="border border-gray-300 px-4 py-2">Correo</th>
                <th class="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr class="hover:bg-gray-50">
                    <td class="border border-gray-300 px-4 py-2">{user.id}</td>
                    <td class="border border-gray-300 px-4 py-2">{user.name}</td>
                    <td class="border border-gray-300 px-4 py-2">{user.phoneNumber}</td>
                    <td class="border border-gray-300 px-4 py-2">{user.role}</td>
                    <td class="border border-gray-300 px-4 py-2">{user.username}</td>
                    <td class="border border-gray-300 px-2 py-2 flex justify-center space-x-2">
                        <a 
                            href={`usuarios/editar/${user.id}`} 
                            class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                            Editar
                        </a>
                        <button 
                            on:click={() => confirmDelete(user)} 
                            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
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
                    {emailConfirmation !== userToDelete.username 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'}"
                disabled={emailConfirmation !== userToDelete.username}
            >
                Confirmar
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
