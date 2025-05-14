<script>
    import { goto } from "$app/navigation";
    import { login } from "$lib/api/apiAuth";

    let username = '';
    let password = '';
    let showPassword = false;

    async function handleLogin() {
        const data = await login(username, password);

        if (data) {
            window.location.href = '/';
        } else {
            console.error('Login inválido');
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
            </div>

            <p class="text-sm text-gray-500 mt-1">Forgot Password?</p>

            <button
                type="submit"
                class="w-48 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-full transition duration-200"
            >
                Login
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