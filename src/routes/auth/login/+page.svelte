<script>
	import { goto } from '$app/navigation';
	import { login } from '$lib/api/main-backend-requests/auth';
	import PasswordFancy from '$lib/components/PasswordFancy.svelte';
        import { onMount } from 'svelte';


	let username = '';
	let password = '';
	let loginError = '';
	let loading = false;

	async function handleLogin() {
		loginError = '';
		loading = true;
		try {
			const data = await login(username, password);
			if (data && data.success !== false) {
				window.location.href = '/';
			} else {
				loginError = data?.errors?.general || 'Login inválido';
			}
		} catch (e) {
			loginError = 'Error de red o inesperado';
		} finally {
			loading = false;
		}
	}

	let logoLight = '/Fix_Light.png';
	let logoDark = '/Fix_Dark.png';
	let logoSrc = logoLight;

	function updateLogo() {
		logoSrc = document.documentElement.classList.contains('dark') ? logoLight : logoDark;
	}

	onMount(() => {
		updateLogo();
		// Observa cambios en la clase 'dark'
		const observer = new MutationObserver(updateLogo);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="w-full max-w-sm flex flex-col items-center">
		<img src={logoSrc} 
        alt="Logo" 
        class="h-28 mb-10 drop-shadow-xl" 
        />

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

			{#if loginError}
				<p class="text-red-600 text-sm mb-2 flex items-center gap-2">
					<i class="fa fa-exclamation-circle"></i>
					{loginError}
				</p>
			{/if}

			<button
				type="submit"
				class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-full login-button flex items-center justify-center gap-2"
				disabled={loading}
			>
				{#if loading}
					<svg
						class="animate-spin h-5 w-5 mr-2 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						><circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle><path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
						></path></svg
					>
					Iniciando...
				{:else}
					<i class="fa fa-sign-in-alt"></i>
					Iniciar sesión
				{/if}
			</button>
		</form>

		<button
			on:click={() => goto('/auth/register')}
			class="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-lg rounded-full register-button flex items-center justify-center gap-2"
		>
			<i class="fa fa-user-plus"></i>
			Registrar taller
		</button>
	</div>
</div>

<style>
	.input-style {
		border: 2px solid black;
		border-radius: 2rem;
		padding: 0.6rem 1rem;
		width: 100%;
		background: #fff;
		color: #111;
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s;
	}
	:global(.dark) .input-style {
		background: #222;
		color: #f3f3f3;
		border-color: #66c188;
	}
	.floating-label {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		transition: 0.2s ease;
		color: #666;
		background: transparent;
		pointer-events: none;
	}
	:global(.dark) .floating-label {
		color: #bbb;
	}
	.input-style:focus + .floating-label,
	.input-style:not(:placeholder-shown) + .floating-label {
		top: -0.75rem;
		left: 0.75rem;
		font-size: 0.75rem;
		color: #000;
		background: transparent;
		padding: 0 0.25rem;
	}
	:global(.dark) .input-style:focus + .floating-label,
	:global(.dark) .input-style:not(:placeholder-shown) + .floating-label {
		color: #66c188;
		background: transparent;
	}
	button {
		z-index: 0;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	button::after {
		content: '';
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
		color:  #fff;
	}
</style>
