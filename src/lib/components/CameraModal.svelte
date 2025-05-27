<script>
    import { createEventDispatcher, onDestroy, tick } from "svelte";
    export let show = false;
    const dispatch = createEventDispatcher();

    let videoRef;
    let canvasRef;
    let stream = null;

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            await tick();
            if (videoRef) {
                videoRef.srcObject = stream;
                await videoRef.play();
            }
        } catch (err) {
            dispatch("error", { message: "No se pudo acceder a la cámara." });
        }
    }

    function takePhoto() {
        const context = canvasRef.getContext("2d");
        context.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
        canvasRef.toBlob(blob => {
            dispatch("photo", { blob, url: URL.createObjectURL(blob) });
        }, "image/jpeg");
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    $: if (show) startCamera();
    onDestroy(stopCamera);
</script>

{#if show}
<div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center relative" style="width: 540px;">
        <button class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl" on:click={() => { stopCamera(); dispatch("close"); }}>&times;</button>
        <h2 class="text-xl font-bold mb-4">Tomar foto</h2>
        <video bind:this={videoRef} width="640" height="360" autoplay class="rounded border mb-2 bg-black">
            <track kind="captions" label="No captions available" />
        </video>
        <canvas bind:this={canvasRef} width="640" height="360" class="hidden"></canvas>
        <div class="flex gap-4 mt-2">
            <button type="button" class="bg-green-600 text-white px-4 py-2 rounded" on:click={() => { takePhoto(); stopCamera(); dispatch("close"); }}>
                Tomar foto
            </button>
            <button type="button" class="bg-gray-400 text-white px-4 py-2 rounded" on:click={() => { stopCamera(); dispatch("close"); }}>
                Cancelar
            </button>
        </div>
    </div>
</div>
{/if}