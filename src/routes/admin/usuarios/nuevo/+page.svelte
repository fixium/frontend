<script>
    import { addUser } from "$lib/api/main-backend-requests/users";
    import { goto } from "$app/navigation";
    import { tick } from "svelte";
    import CameraModal from "$lib/components/CameraModal.svelte";

    let name = '';
    let phoneNumber = '';
    let username = '';
    let password = '';
    let confirmPassword = '';
    let role = '';
    let showPassword = false;

    let showReasonModal = false;

    let successMessage = '';
    let errorMessage = '';

    let isLoading = false;

    // --- NUEVO: para la cámara ---
    let imageBlobs = [];      // Cambia a arreglo
    let imagePreviews = [];   // Cambia a arreglo
    let showCameraModal = false;

    function openCameraModal() {
        errorMessage = '';
        showCameraModal = true;
    }

    function closeCameraModal() {
        showCameraModal = false;
    }

    // Permitir agregar varias fotos
    function handlePhoto(event) {
        if (imageBlobs.length < 3) {
            imageBlobs = [...imageBlobs, event.detail.blob];
            imagePreviews = [...imagePreviews, event.detail.url];
        }
    }

    function removePhoto(index) {
        imageBlobs = imageBlobs.filter((_, i) => i !== index);
        imagePreviews = imagePreviews.filter((_, i) => i !== index);
    }

    async function handleRegister() {
        successMessage = '';
        errorMessage = '';
        isLoading = true;

        if (!name || !phoneNumber || !username || !password || !confirmPassword || !role) {
            errorMessage = 'Por favor, completa todos los campos.';
            isLoading = false;
            return;
        }

        if (password !== confirmPassword) {
            errorMessage = 'Las contraseñas no coinciden.';
            isLoading = false;
            return;
        }

        if (imageBlobs.length < 3) {
            errorMessage = 'Debes tomar al menos 3 fotos del usuario.';
            isLoading = false;
            return;
        }

        try {
            await addUser({ name, phoneNumber, username, password, role, images: imageBlobs });
            successMessage = 'Usuario registrado exitosamente.';
            setTimeout(() => goto('/admin/usuarios'), 500);
        } catch (error) {
            errorMessage = error.message || 'Error al registrar el usuario.';
        } finally {
            isLoading = false;
        }
    }

    function handleCancel() {
        goto('/admin/usuarios');
    }

    function validateName(event) {
        event.target.value = event.target.value.replace(/[0-9]/g, '');
        name = event.target.value;
    }

    function validatePhoneNumber(event) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        phoneNumber = event.target.value;
    }
</script>

<div class="h-screen flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-4 text-center dark:text-white">Registro de nuevo usuario</h1>
        <div class="mb-4"></div>

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
            <!-- Nombre completo -->
            <div class="relative mb-3">
                <input
                    id="name"
                    type="text"
                    bind:value={name}
                    placeholder=""
                    class="input-style peer"
                    on:input={validateName}
                />
                <label for="name" class="floating-label">Nombre completo</label>
            </div>

            <!-- Teléfono -->
            <div class="relative mb-3">
                <input
                    id="phoneNumber"
                    type="text"
                    bind:value={phoneNumber}
                    on:input={validatePhoneNumber}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="phoneNumber" class="floating-label">Número de teléfono</label>
            </div>

            <!-- Correo electrónico -->
            <div class="relative mb-3">
                <input
                    id="username"
                    type="text"
                    bind:value={username}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="username" class="floating-label">Correo electrónico</label>
            </div>

            <!-- Contraseña -->
            <div class="relative mb-3">
                <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    bind:value={password}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="password" class="floating-label">Contraseña</label>
                <!-- Botón para mostrar/ocultar contraseña -->
                <button
                    type="button"
                    on:click={() => (showPassword = !showPassword)}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Mostrar u ocultar contraseña"
                >
                    {#if showPassword}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0c1.03 0 2.02.15 2.96.425M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10a10.05 10.05 0 01-1.98 5.777M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    {/if}
                </button>
            </div>

            <!-- Confirmar contraseña -->
            <div class="relative mb-3">
                <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    bind:value={confirmPassword}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="password" class="floating-label">Confirmar contraseña</label>
                <!-- Botón para mostrar/ocultar contraseña -->
                <button
                    type="button"
                    on:click={() => (showPassword = !showPassword)}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Mostrar u ocultar contraseña"
                >
                    {#if showPassword}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0c1.03 0 2.02.15 2.96.425M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.98 8.223A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10a10.05 10.05 0 01-1.98 5.777M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    {/if}
                </button>
            </div>

            <!-- Rol de usuario -->
            <div class="relative mb-3">
                <select
                    id="role"
                    bind:value={role}
                    class="input-style peer appearance-none"
                    style="color: #666;"
                >
                    <option value="" disabled></option>
                    <option value="TECHNICIAN">Técnico</option>
                    <option value="RECEPTIONIST">Recepcionista</option>
                </select>
                <label for="role" class="floating-label">Rol de usuario</label>
            </div>
        </div>

        <!-- Camara -->
        <div class="relative mb-3">
            <label for="take-photo-btn" class="block mb-1 font-semibold">Fotos del usuario (mínimo 3)
                <button
                type="button"
                class="ml-1 p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs"
                aria-label="¿Por qué pedimos la foto?"
                on:click={() => showReasonModal = true}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="white"/>
                    <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 8v4m0 4h.01"/>
                </svg>
            </button>
            </label>
            {#if imagePreviews.length < 3}
                <div class="flex justify-center">
                    <button id="take-photo-btn" type="button" class="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded mb-2" on:click={openCameraModal}>
                        Abrir cámara
                    </button>
                </div>
            {/if}
            <div class="flex gap-2 flex-wrap">
                {#each imagePreviews as preview, idx}
                    <div class="relative">
                        <img src={preview} alt="Foto tomada" class="w-24 object-cover rounded mb-2" />
                        <button type="button" class="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                            on:click={() => removePhoto(idx)}>
                            ×
                        </button>
                    </div>
                {/each}
            </div>
            {#if imagePreviews.length < 3}
                <div class="text-sm text-gray-500">Debes tomar al menos 3 fotos.</div>
            {/if}
        </div>

        <CameraModal
            bind:show={showCameraModal}
            on:photo={handlePhoto}
            on:close={closeCameraModal}
        />

        <div class="flex justify-between gap-4 mt-4 w-full">
            <button
                on:click={handleRegister}
                class="w-[48%] bg-green-600 text-white font-semibold py-2 rounded-full hover:bg-green-700"
            >
                {#if isLoading}
                    <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                {:else}
                    Confirmar
                {/if}
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

{#if showReasonModal}
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
            <h2 class="font-bold mb-2 text-lg">¿Por qué pedimos la foto?</h2>
            <p class="mb-4 text-sm">
                Solicitamos fotos del usuario para validar su identidad y proteger la seguridad de tu taller y de tus clientes. <br>Esta verificación nos ayuda a garantizar que solo personas autorizadas puedan realizar acciones importantes dentro del sistema.
            </p>
            <button class="bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded" on:click={() => showReasonModal = false}>
                Entendido
            </button>
        </div>
    </div>
{/if}

<style>

    :global(.dark) .input-style {
		background-color: #222;
		color: #f3f3f3;
		border-color: #66c188;
	}
	:global(.dark) .floating-label {
		color: #bbb;
		background: #222;
	}
	:global(.dark) .input-style:focus + .floating-label,
	:global(.dark) .input-style:not(:placeholder-shown) + .floating-label {
		color: #66c188;
		background: transparent;
	}
    .input-style {
        border: 2px solid black;
        border-radius: 2rem;
        padding: 0.6rem 1rem;
        outline: none;
        background-color: white;
        width: 100%;
        font-size: 1rem;
        transition: all 0.2s ease;
        -webkit-appearance: none; /* Para personalizar select */
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