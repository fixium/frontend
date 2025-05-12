<h1>  </h1>

<!-- <script>
    export let data;
    let users = data.users;
    
    let showModal = false;
    let userToDelete = null;

    function confirmDelete(user) {
        userToDelete = user;
        showModal = true;
    }

    async function deleteUser() {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                users = users.filter(user => user.id !== userToDelete.id);
                showModal = false;
                userToDelete = null;
            } else {
                alert('Error al eliminar el usuario.');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }
</script>

<h1 class="text-2xl font-bold mb-4">Lista de Usuarios</h1>

<div class="overflow-x-auto">
    <table class="table-auto w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-100">
                <th class="border border-gray-300 px-4 py-2">ID</th>
                <th class="border border-gray-300 px-4 py-2">Nombre</th>
                <th class="border border-gray-300 px-4 py-2">Teléfono</th>
                <th class="border border-gray-300 px-4 py-2">Rol</th>
                <th class="border border-gray-300 px-4 py-2">Usuario</th>
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
                    <td class="border border-gray-300 px-4 py-2 flex space-x-2">
                        <a 
                            href={`edit/${user.id}`} 
                            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                            Editar
                        </a>
                        <button 
                            on:click={() => confirmDelete(user)} 
                            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
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
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 class="text-xl font-bold mb-4">Confirmar eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.name}</strong>?</p>
        <div class="mt-4 flex justify-end space-x-2">
            <button 
                on:click={() => (showModal = false)} 
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
                Cancelar
            </button>
            <button 
                on:click={deleteUser} 
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
                Eliminar
            </button>
        </div>
    </div>
</div>
{/if} -->