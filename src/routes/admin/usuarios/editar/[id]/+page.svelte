<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { updateUser } from "$lib/api/apiUsers.js";
    import { validateName, validatePhoneNumber } from "$lib/utils/validation";

    export let data;

    let user = {
        name: "",
        phoneNumber: "",
        role: ""
    };

    let successMessage = "";
    let errorMessage = "";

    onMount(() => {
        user = { ...data.user }; // Cargar los datos del usuario desde el servidor
    });

    async function handleUpdate() {
        successMessage = "";
        errorMessage = "";

        if (!user.name || !user.phoneNumber || !user.role) {
            errorMessage = "Por favor, completa todos los campos.";
            return;
        }

        try {
            await updateUser(data.user.id, user);
            successMessage = "Usuario actualizado exitosamente.";
            setTimeout(() => goto("/admin/usuarios"), 1000);
        } catch (error) {
            errorMessage = error.message || "Error al actualizar el usuario.";
        }
    }

    function handleCancel() {
        goto("/admin/usuarios");
    }

    function onNameInput(event) {
        user.name = validateName(event.target.value);
    }

    function onPhoneNumberInput(event) {
        user.phoneNumber = validatePhoneNumber(event.target.value);
    }
</script>

<div class="h-screen flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-4 text-center">Editar usuario</h1>

        {#if successMessage}
            <div class="bg-green-100 text-green-800 p-3 rounded mb-4 w-full text-center">
                {successMessage}
            </div>
        {/if}

        {#if errorMessage}
            <div class="bg-red-100 text-red-800 p-3 rounded mb-4 w-full text-center">
                {errorMessage}
            </div>
        {/if}

        <div class="flex flex-col gap-3 w-full">
            <!-- Nombre -->
            <div class="relative mb-3">
                <input
                    id="name"
                    type="text"
                    bind:value={user.name}
                    on:input={onNameInput}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="name" class="floating-label">Nombre</label>
            </div>

            <!-- Teléfono -->
            <div class="relative mb-3">
                <input
                    id="phoneNumber"
                    type="text"
                    bind:value={user.phoneNumber}
                    on:input={onPhoneNumberInput}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="phoneNumber" class="floating-label">Teléfono</label>
            </div>

            <!-- Rol -->
            <div class="relative mb-3">
                <select
                    id="role"
                    bind:value={user.role}
                    class="input-style peer appearance-none"
                    style="color: #666;"
                >
                    <option value="" disabled></option>
                    <option value="TECHNICIAN">Técnico</option>
                    <option value="RECEPTIONIST">Recepcionista</option>
                </select>
                <label for="role" class="floating-label">Rol</label>
            </div>
        </div>

        <div class="flex justify-between gap-4 mt-4 w-full">
            <button
                on:click={handleUpdate}
                class="w-[48%] bg-green-600 text-white font-semibold py-2 rounded-full hover:bg-green-700"
            >
                Guardar
            </button>
            <button
                on:click={handleCancel}
                class="w-[48%] bg-red-500 text-white font-semibold py-2 rounded-full hover:bg-red-600"
            >
                Cancelar
            </button>
        </div>
    </div>
</div>

<style>
    .input-style {
        border: 2px solid black;
        border-radius: 2rem;
        padding: 0.6rem 1rem;
        outline: none;
        background-color: white;
        width: 100%;
        font-size: 1rem;
        transition: all 0.2s ease;
        -webkit-appearance: none;
        appearance: none;
    }

    .floating-label {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        font-size: 1rem;
        pointer-events: none;
        transition: 0.2s ease all;
        background: white;
        padding: 0 0.25rem;
    }

    .input-style:focus + .floating-label,
    .input-style:not(:placeholder-shown) + .floating-label {
        top: -0.75rem;
        left: 0.75rem;
        font-size: 0.75rem;
        color: #000;
    }

    .bg-green-100 {
        background-color: #d4edda;
    }

    .text-green-800 {
        color: #155724;
    }

    .bg-red-100 {
        background-color: #f8d7da;
    }

    .text-red-800 {
        color: #721c24;
    }
</style>