<script lang="ts">
	import PasswordFancy from '$lib/components/PasswordFancy.svelte';
	import { login } from '$lib/api/apiAuth';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	async function handleLogin() {
		if (await login(username, password)) goto('/');
		else alert('Credenciales incorrectas');
	}
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="w-full max-w-sm flex flex-col items-center">
		<img src="/Fix.png" alt="Logo" class="h-28 mb-10 drop-shadow-xl" />

		<form class="w-full flex flex-col gap-6" on:submit|preventDefault={handleLogin}>
			<!-- usuario -->
			<div class="relative">
				<input
					id="username"
					type="email"
					bind:value={username}
					placeholder=" "
					class="input-style peer w-full"
					required
				/>
				<label for="username" class="floating-label">Correo electrónico</label>
			</div>

			<!-- contraseña fancy -->
			<PasswordFancy bind:value={password} placeholder="Contraseña" required />

			<button
				type="submit"
				class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-full  login-button"
			>
				Login
			</button>
		</form>

		<button
			on:click={() => goto('/auth/register')}
			class="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-lg rounded-full register-button"
		>
			Registrar taller
		</button>
	</div>
</div>

<style>
	/* tus estilos reutilizados */
	.input-style {
		border: 2px solid black;
		border-radius: 2rem;
		padding: 0.6rem 1rem;
		width: 100%;
	}
	.floating-label {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		transition: 0.2s ease;
		color: #666;
	}
	.input-style:focus + .floating-label,
	.input-style:not(:placeholder-shown) + .floating-label {
		top: -0.75rem;
		left: 0.75rem;
		font-size: 0.75rem;
		color: #000;
	}

	button {
        z-index: 0;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    button::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        z-index: -1;
        transition: left 0.8s ease;
    }

	.login-button::after {
        background: linear-gradient(90deg, transparent, #669ef8);

	}
	.register-button::after {
		background: linear-gradient(90deg, transparent, #66c188);
	}

    button:hover::after {
        left: 0;
    }

    button:hover {
        color: #fff;
		}
	
	
</style>
