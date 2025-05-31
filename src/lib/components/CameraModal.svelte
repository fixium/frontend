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
            // Iniciar animación y conteo
            startScanAndCountdown();
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
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div
            class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center relative"
            style="width: 640px;"
        >
            <button
                class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
                on:click={() => {
                    stopCamera();
                    dispatch('close');
                }}>&times;</button
            >
            <h2 class="text-xl font-bold mb-4">Capturar</h2>
            <div class="relative w-full flex justify-center items-center" style="max-width: 100%; max-height: 360px;">
                <video
                    bind:this={videoRef}
                    autoplay
                    class="rounded border mb-2 bg-black {isFrontCamera ? 'mirror' : ''}"
                    style="max-width: 100%; max-height: 360px;"
                >
                    <track kind="captions" label="Sin subtítulos" />
                </video>
                <!-- Animación de escaneo -->
                {#if scanning}
                    <div class="scan-line absolute left-0 w-full h-1 pointer-events-none" class:scan-animate={scanAnimation}></div>
                {/if}
                <!-- Conteo regresivo -->
                {#if scanning}
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-6xl font-bold text-white drop-shadow-lg bg-black bg-opacity-40 px-6 py-2 rounded-full">{countdown}</span>
                    </div>
                {/if}
            </div>
            <canvas bind:this={canvasRef} class="hidden"></canvas>
            <div class="flex gap-4 mt-2">
                <button
                    type="button"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    on:click={() => {
                        takePhoto();
                        stopCamera();
                        dispatch('close');
                    }}
                    disabled={scanning}
                >
                    Capturar
                </button>
                <button
                    type="button"
                    class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    on:click={() => {
                        stopCamera();
                        dispatch('close');
                    }}
                >
                    Cancelar
                </button>
                {#if devices.length > 1}
                    <button
                        type="button"
                        class="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                        on:click={switchCamera}
                        title="Cambiar cámara"
                        disabled={scanning}
                    >
                        🔄 Cambiar cámara
                    </button>
                {/if}
            </div>
            {#if devices.length > 1}
                <div class="mt-2 text-xs text-gray-500">Cámara {cameraIndex + 1} de {devices.length}</div>
            {/if}
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
    0% { top: 0; }
    100% { top: 95%; }
}
</style>