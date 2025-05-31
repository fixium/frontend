<script>
	import { createEventDispatcher, onDestroy, tick } from 'svelte';
	export let show = false;
	const dispatch = createEventDispatcher();

	let videoRef;
	let canvasRef;
	let stream = null;

	let devices = [];
	let cameraIndex = 0;
	let isFrontCamera = false;

	let countdown = 3;
	let scanning = false;
	let countdownInterval;
	let scanAnimation = false;

	async function getDevices() {
		const allDevices = await navigator.mediaDevices.enumerateDevices();
		devices = allDevices.filter((d) => d.kind === 'videoinput');
	}

	async function startCamera() {
		await getDevices();
		if (devices.length === 0) {
			dispatch('error', { message: 'No se detectaron cámaras.' });
			return;
		}
		try {
			if (stream) stopCamera();
			const device = devices[cameraIndex];
			isFrontCamera = /front|user/i.test(device.label);
			stream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: device.deviceId } }
			});
			await tick();
			if (videoRef) {
				videoRef.srcObject = stream;
				await videoRef.play();
			}
			// Quita esta línea:
			// startScanAndCountdown();
		} catch (err) {
			dispatch('error', { message: 'No se pudo acceder a la cámara.' });
		}
	}

	function takePhoto() {
		const width = videoRef.videoWidth;
		const height = videoRef.videoHeight;
		canvasRef.width = width;
		canvasRef.height = height;
		const context = canvasRef.getContext('2d');
		context.drawImage(videoRef, 0, 0, width, height);
		canvasRef.toBlob((blob) => {
			dispatch('photo', { blob, url: URL.createObjectURL(blob) });
		}, 'image/jpeg');
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
		clearInterval(countdownInterval);
		scanning = false;
		scanAnimation = false;
		countdown = 3;
	}

	async function switchCamera() {
		cameraIndex = (cameraIndex + 1) % devices.length;
		await startCamera();
	}

	function startScanAndCountdown() {
		countdown = 3;
		scanning = true;
		scanAnimation = true;
		clearInterval(countdownInterval);
		countdownInterval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				setTimeout(() => {
					takePhoto();
					stopCamera();
					dispatch('close');
				}, 400); // Pequeño delay para que la animación termine
			}
		}, 1000);
	}

	$: if (show) startCamera();
	onDestroy(stopCamera);
</script>

{#if show}
	<div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
		<div
			class="relative flex flex-col items-center justify-center"
			style="width: 370px; height: 650px;"
		>
			<!-- Video ocupa todo el modal -->
			<div class="absolute inset-0 flex items-center justify-center">
				<video
					bind:this={videoRef}
					autoplay
					class="w-full h-full object-cover rounded-3xl border-4 border-white shadow-xl {isFrontCamera
						? 'mirror'
						: ''}"
					style="background: #000;"
				>
					<track kind="captions" label="Sin subtítulos" />
				</video>
				<!-- Animación de escaneo -->
				{#if scanning}
					<div
						class="scan-line absolute left-0 w-full h-1 pointer-events-none rounded-full"
						class:scan-animate={scanAnimation}
					></div>
				{/if}
				<!-- Conteo regresivo -->
				{#if scanning}
					<div class="absolute inset-0 flex items-center justify-center">
						<span
							class="text-6xl font-bold text-white drop-shadow-lg bg-black bg-opacity-40 px-6 py-2 rounded-full"
							>{countdown}</span
						>
					</div>
				{/if}
			</div>
			<canvas bind:this={canvasRef} class="hidden"></canvas>

			<!-- Botón cerrar (X) -->
			<button
				class="absolute top-3 right-4 text-white bg-black bg-opacity-40 hover:bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center text-2xl z-10"
				on:click={() => {
					stopCamera();
					dispatch('close');
				}}
				aria-label="Cerrar">&times;</button
			>

			<!-- Botón cambiar cámara -->
			{#if devices.length > 1}
				<button
					type="button"
					class="absolute bottom-8 right-8 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl z-10 border-2 border-white"
					on:click={switchCamera}
					title="Cambiar cámara"
					disabled={scanning}
				>
					🔄
				</button>
			{/if}

			<!-- Botón de captura (círculo grande) -->
			<button
				type="button"
				class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border-4 border-gray-300 hover:border-blue-400 w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition z-10"
				on:click={startScanAndCountdown}
				disabled={scanning}
				aria-label="Capturar"
			>
				<span class="block w-12 h-12 bg-gray-200 rounded-full"></span>
			</button>
		</div>
	</div>
{/if}

<style>
	.mirror {
		transform: scaleX(-1);
	}
	.scan-line {
		top: 0;
		background: linear-gradient(90deg, #00eaff 0%, #00ffae 100%);
		opacity: 0.85;
		border-radius: 2px;
		height: 6px;
		z-index: 10;
	}
	.scan-animate {
		animation: scan-move 1s linear infinite;
	}
	@keyframes scan-move {
		0% {
			top: 0;
		}
		100% {
			top: 95%;
		}
	}
</style>
