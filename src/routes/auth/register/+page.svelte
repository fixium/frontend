<script>
	import { register } from '$lib/api/main-backend-requests/auth';
	import { validateName, validatePhoneNumber } from '$lib/utils/validation';
	import CameraModal from '$lib/components/CameraModal.svelte';
	import PasswordFancy from '$lib/components/PasswordFancy.svelte';

	let workshopName = '';
	let workshopPhoneNumber = '';
	let workshopContactEmail = '';
	let name = '';
	let phoneNumber = '';
	let username = '';
	let password = '';
	let showPassword = false;

	let successMessage = '';
	let errorMessage = '';

	let showCameraModal = false;
	let imageBlobs = [];
	let imagePreviews = [];

	let showReasonModal = false;

	function openCameraModal() {
		errorMessage = '';
		showCameraModal = true;
	}

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

	async function confirmarRegistro() {
		successMessage = '';
		errorMessage = '';

		if (
			!workshopName ||
			!workshopPhoneNumber ||
			!workshopContactEmail ||
			!name ||
			!phoneNumber ||
			!username ||
			!password
		) {
			errorMessage = 'Por favor, completa todos los campos.';
			return;
		}

		if (imageBlobs.length < 3) {
			errorMessage = 'Debes tomar al menos 3 fotos del administrador.';
			return;
		}

		const response = await register(
			{
				workshopName,
				workshopPhoneNumber,
				workshopContactEmail,
				name,
				phoneNumber,
				username,
				password
			},
			imageBlobs
		);

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

<div class="min-h-screen flex items-center justify-center p-4 overflow-auto">
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
			<!-- Validación en tiempo real para el nombre del taller -->
			<div class="relative mb-3">
				<input
					id="workshopName"
					type="text"
					bind:value={workshopName}
					on:input={() => (workshopName = validateName(workshopName))}
					placeholder=""
					class="input-style peer"
				/>
				<label for="workshopName" class="floating-label">Nombre del taller</label>
			</div>

			<!-- Validación en tiempo real para el número de teléfono del taller -->
			<div class="relative mb-3">
				<input
					id="workshopPhoneNumber"
					type="tel"
					bind:value={workshopPhoneNumber}
					on:input={() => (workshopPhoneNumber = validatePhoneNumber(workshopPhoneNumber))}
					placeholder=""
					class="input-style peer"
				/>
				<label for="workshopPhoneNumber" class="floating-label">Número de teléfono del taller</label
				>
			</div>

			<div class="relative mb-3">
				<input
					id="workshopContactEmail"
					type="email"
					bind:value={workshopContactEmail}
					placeholder=""
					class="input-style peer"
				/>
				<label for="workshopContactEmail" class="floating-label"
					>Correo de contacto del taller</label
				>
			</div>

			<!-- Validación en tiempo real para el nombre del administrador -->
			<div class="relative mb-3">
				<input
					id="name"
					type="text"
					bind:value={name}
					on:input={() => (name = validateName(name))}
					placeholder=""
					class="input-style peer"
				/>
				<label for="name" class="floating-label">Nombre del administrador</label>
			</div>

			<!-- Validación en tiempo real para el teléfono del administrador -->
			<div class="relative mb-3">
				<input
					id="phoneNumber"
					type="tel"
					bind:value={phoneNumber}
					on:input={() => (phoneNumber = validatePhoneNumber(phoneNumber))}
					placeholder=""
					class="input-style peer"
				/>
				<label for="phoneNumber" class="floating-label">Teléfono del administrador</label>
			</div>

			<div class="relative mb-3">
				<input
					id="username"
					type="email"
					bind:value={username}
					placeholder=""
					class="input-style peer"
				/>
				<label for="username" class="floating-label">Correo del administrador</label>
			</div>

			<div class="relative mb-3">
                <PasswordFancy bind:value={password} placeholder="Contraseña del administrador" required />

            </div>

		</div>

		<div class="relative mb-3">
			<label class="block mb-1 font-semibold w-full text-center"
				>Fotos del administrador del taller
				<button
					type="button"
					class="ml-1 p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs"
					aria-label="¿Por qué pedimos la foto?"
					on:click={() => (showReasonModal = true)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="white" />
						<path
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							d="M12 8v4m0 4h.01"
						/>
					</svg>
				</button>
			</label>
			{#if imagePreviews.length < 3}
				<div class="flex justify-center">
					<button
						type="button"
						class="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded mb-2"
						on:click={openCameraModal}
					>
						Abrir cámara
					</button>
				</div>
			{/if}
			<div class="flex gap-2 flex-wrap justify-center">
				{#each imagePreviews as preview, idx}
					<div class="relative">
						<img src={preview} alt="Foto tomada" class="w-24 h-24 object-cover rounded mb-2" />
						<button
							type="button"
							class="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
							on:click={() => removePhoto(idx)}
						>
							×
						</button>
					</div>
				{/each}
			</div>
			{#if imagePreviews.length < 3}
				<div class="text-sm text-gray-500 text-center">Debes tomar al menos 3 fotos.</div>
			{/if}
		</div>

		<CameraModal
			bind:show={showCameraModal}
			on:photo={handlePhoto}
			on:close={() => (showCameraModal = false)}
		/>

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

{#if showReasonModal}
	<div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
			<h2 class="font-bold mb-2 text-lg">¿Por qué pedimos la foto?</h2>
			<p class="mb-4 text-sm">
				Solicitamos la foto del administrador para validar su identidad y proteger la seguridad de
				tu taller y de tus clientes. <br />Esta verificación nos ayuda a garantizar que solo
				personas autorizadas puedan realizar acciones importantes dentro del sistema.
			</p>
			<button
				class="bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded"
				on:click={() => (showReasonModal = false)}
			>
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
