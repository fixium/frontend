<script>
    import { addUser } from "$lib/api/apiCloud";
    import { goto } from "$app/navigation";

    let name = '';
    let phoneNumber = '';
    let username = '';
    let password = '';
    let confirmPassword = '';
    let role = '';

    let successMessage = '';
    let errorMessage = '';

    let isLoading = false;

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

        try {
            await addUser({ name, phoneNumber, username, password, role });
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

<div class="h-screen flex items-center justify-center bg-white p-4 overflow-auto">
    <div class="w-full max-w-md flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-4 text-center">Registro de nuevo usuario</h1>
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
                    type="password"
                    bind:value={password}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="password" class="floating-label">Contraseña</label>
            </div>

            <!-- Confirmar contraseña -->
            <div class="relative mb-3">
                <input
                    id="confirmPassword"
                    type="password"
                    bind:value={confirmPassword}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="confirmPassword" class="floating-label">Confirmar contraseña</label>
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

        <div class="flex justify-between gap-4 mt-4 w-full">
            <button
                on:click={handleRegister}
                class="w-[48%] bg-green-600 text-white font-semibold py-2 rounded-full hover:bg-green-700"
            >
                {#if isLoading}
                    Cargando...
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