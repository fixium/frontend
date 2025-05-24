<script>
    import { goto } from "$app/navigation";
    import { login } from "$lib/api/apiAuth";

    let username = '';
    let password = '';
    let showPassword = false;
    let loginError = ''; // Nueva variable para el error

    async function handleLogin() {
        loginError = '';
        const data = await login(username, password);

        if (data && data.success !== false) {
            window.location.href = '/';
        } else {
            loginError = data?.errors?.general || 'Login inválido';
        }
    }

    function handleRegister() {
        goto('/auth/register');
    }
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-sm flex flex-col items-center">
        <img src="/Fix.png" alt="Logo" class="h-28 mb-10 drop-shadow-xl" />

        <form on:submit|preventDefault={handleLogin} class="w-full flex flex-col items-center gap-4">
            <!-- Username -->
            <div class="relative mb-3 w-full">
                <input
                    id="username"
                    type="text"
                    bind:value={username}
                    placeholder=""
                    class="input-style peer"
                />
                <label for="username" class="floating-label">Correo electrónico</label>
            </div>

            <!-- Password -->
            <div class="relative mb-3 w-full">
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

            {#if loginError}
                <p class="text-red-600 text-sm mb-2">{loginError}</p>
            {/if}

            <p class="text-sm text-gray-500 mt-1">Forgot Password?</p>

            <button
                type="submit"
                class="w-48 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-full transition duration-200"
            >
                Iniciar sesión
            </button>
        </form>

        <button
            on:click={handleRegister}
            class="w-48 mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-lg rounded-full transition duration-200"
        >
            Registrar taller
        </button>
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
        background: rgba(255, 255, 255, 0);
        padding: 0 0.25rem;
    }

    .input-style:focus + .floating-label,
    .input-style:not(:placeholder-shown) + .floating-label {
        top: -0.75rem;
        left: 0.75rem;
        font-size: 0.75rem;
        color: #000;
    }

    .drop-shadow-xl {
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.6));
    }
</style>