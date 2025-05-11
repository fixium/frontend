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
			<input
				type="text"
				placeholder="Username"
				bind:value={username}
				class="w-full px-6 py-3 border-2 border-gray-500 rounded-full text-center text-lg outline-none"
			/>

			<input
				type={showPassword ? 'text' : 'password'}
				placeholder="Password"
				bind:value={password}
				class="w-full px-6 py-3 border-2 border-gray-500 rounded-full text-center text-lg outline-none"
			/>

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
	.drop-shadow-xl {
		filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.6));
	}
</style>
