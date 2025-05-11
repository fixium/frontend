<script>
    import { register } from "$lib/api/apiAuth";

    let workshopName = '';
    let workshopPhoneNumber = '';
    let workshopContactEmail = '';
    let name = '';
    let phoneNumber = '';
    let username = '';
    let password = '';

    let successMessage = '';
    let errorMessage = '';

    async function confirmarRegistro() {
        successMessage = '';
        errorMessage = '';

        if (!workshopName || !workshopPhoneNumber || !workshopContactEmail || !name || !phoneNumber || !username || !password) {
            errorMessage = 'Por favor, completa todos los campos.';
            return;
        }

        const response = await register({
            workshopName,
            workshopPhoneNumber,
            workshopContactEmail,
            name,
            phoneNumber,
            username,
            password
        });

        if (response.success) {
            successMessage = 'Registro exitoso. Redirigiendo...';
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 2000);
        } else {
            // Combinar errores en un solo string
            const errores = Object.values(response.errors).join(' ');
            errorMessage = errores || 'Error al registrar el taller. Por favor, intenta de nuevo.';
        }
    }


    function cancelar() {
        window.history.back();
    }
</script>

<div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-xl p-4">
        <h1 class="text-2xl font-bold text-center mb-6">Registro de taller</h1>

        <!-- Mensajes de éxito y error -->
        {#if successMessage}
            <div class="bg-green-100 text-green-800 p-3 rounded mb-4">
                {successMessage}
            </div>
        {/if}

        {#if errorMessage}
            <div class="bg-red-100 text-red-800 p-3 rounded mb-4">
                {errorMessage}
            </div>
        {/if}

        <div class="flex flex-col gap-3 text-sm">
            <!-- Nombre del taller -->
            <label class="bg-gray-400 rounded-full px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                <span class="text-black sm:w-1/2">Nombre del taller:</span>
                <input type="text" bind:value={workshopName} class="flex-1 bg-transparent outline-none border-b border-gray-600" />
            </label>

            <!-- Teléfono del taller -->
            <label class="bg-gray-400 rounded-full px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                <span class="text-black sm:w-1/2">Número de teléfono del taller:</span>
                <input type="tel" bind:value={workshopPhoneNumber} class="flex-1 bg-transparent outline-none border-b border-gray-600" />
            </label>

            <!-- Correo del taller -->
            <label class="bg-gray-400 rounded-full px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                <span class="text-black sm:w-1/2">Correo de contacto del taller:</span>
                <input type="email" bind:value={workshopContactEmail} class="flex-1 bg-transparent outline-none border-b border-gray-600" />
            </label>

            <!-- Nombre del administrador -->
            <label class="bg-gray-400 rounded-full px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                <span class="text-black sm:w-1/2">Nombre del administrador:</span>
                <input type="text" bind:value={name} class="flex-1 bg-transparent outline-none border-b border-gray-600" />
            </label>

            <!-- Teléfono del administrador -->
            <label class="bg-gray-400 rounded-full px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                <span class="text-black sm:w-1/2">Teléfono del administrador:</span>
                <input type="tel" bind:value={phoneNumber} class="flex-1 bg-transparent outline-none border-b border-gray-600" />
            </label>

            <!-- Correo del administrador -->
            <label class="bg-gray-400 rounded-full px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                <span class="text-black sm:w-1/2">Correo del administrador:</span>
                <input type="email" bind:value={username} class="flex-1 bg-transparent outline-none border-b border-gray-600" />
            </label>

            <!-- Contraseña del administrador -->
            <label class="bg-gray-400 rounded-full px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                <span class="text-black sm:w-1/2">Contraseña del administrador:</span>
                <input type="password" bind:value={password} class="flex-1 bg-transparent outline-none border-b border-gray-600" />
            </label>
        </div>

        <!-- Botones -->
        <div class="flex flex-col items-center gap-3 mt-6">
            <button
                on:click={confirmarRegistro}
                class="bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 px-6 rounded-full w-52 transition"
            >
                Confirmar registro
            </button>

            <button
                on:click={cancelar}
                class="bg-red-500 hover:bg-red-600 text-white font-medium text-sm py-2 px-6 rounded-full w-52 transition"
            >
                Cancelar
            </button>
        </div>
    </div>
</div>

<style>
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