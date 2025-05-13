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
            const errores = Object.values(response.errors).join(' ');
            errorMessage = errores || 'Error al registrar el taller. Por favor, intenta de nuevo.';
        }
    }

    function cancelar() {
        window.history.back();
    }
</script>

<div class="h-screen flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-4 text-center">Registro de taller</h1>

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
            <!-- Todos tus campos con floating label -->
            <div class="relative mb-3">
                <input id="workshopName" type="text" bind:value={workshopName} placeholder="" class="input-style peer" />
                <label for="workshopName" class="floating-label">Nombre del taller</label>
            </div>

            <div class="relative mb-3">
                <input id="workshopPhoneNumber" type="tel" bind:value={workshopPhoneNumber} placeholder="" class="input-style peer" />
                <label for="workshopPhoneNumber" class="floating-label">Número de teléfono del taller</label>
            </div>

            <div class="relative mb-3">
                <input id="workshopContactEmail" type="email" bind:value={workshopContactEmail} placeholder="" class="input-style peer" />
                <label for="workshopContactEmail" class="floating-label">Correo de contacto del taller</label>
            </div>

            <div class="relative mb-3">
                <input id="name" type="text" bind:value={name} placeholder="" class="input-style peer" />
                <label for="name" class="floating-label">Nombre del administrador</label>
            </div>

            <div class="relative mb-3">
                <input id="phoneNumber" type="tel" bind:value={phoneNumber} placeholder="" class="input-style peer" />
                <label for="phoneNumber" class="floating-label">Teléfono del administrador</label>
            </div>

            <div class="relative mb-3">
                <input id="username" type="email" bind:value={username} placeholder="" class="input-style peer" />
                <label for="username" class="floating-label">Correo del administrador</label>
            </div>

            <div class="relative mb-3">
                <input id="password" type="password" bind:value={password} placeholder="" class="input-style peer" />
                <label for="password" class="floating-label">Contraseña del administrador</label>
            </div>
        </div>

        <div class="flex flex-col items-center gap-3 mt-4 w-full">
            <button
                on:click={confirmarRegistro}
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full w-full max-w-xs"
            >
                Confirmar registro
            </button>

            <button
                on:click={cancelar}
                class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full w-full max-w-xs"
            >
                Cancelar
            </button>
        </div>
    </div>
</div>

<style>
    .relative {
        position: relative;
    }

    .input-style {
        border: 2px solid black;
        border-radius: 2rem;
        padding: 0.75rem 1rem;
        outline: none;
        background-color: white;
        width: 100%;
        font-size: 1rem;
        transition: all 0.2s ease;
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

    /* Cuando el input está enfocado o tiene valor */
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