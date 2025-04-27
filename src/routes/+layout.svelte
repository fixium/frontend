<script>
    import '../app.css';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let isDarkMode = false;
    function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		const html = document.documentElement;
		if (isDarkMode) {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
	}
</script>

<style>
    .sidebar {
        position: fixed; /* Fija la barra lateral */
        top: 0;
        left: 0;
        height: 100vh;
        width: 5rem; /* Ancho inicial de la barra lateral */
        z-index: 50; /* Asegura que esté por encima del contenido */
        transition: width 0.3s ease-in-out; /* Transición para el ancho */
    }

    .sidebar:hover {
        width: 13rem; /* Ancho expandido al pasar el mouse */
    }

    .content {
        padding-left: 6rem;
    }
</style>

<div class="flex">
    <!-- Sidebar -->
    <div class="sidebar bg-gray-900 text-white">
        <Sidebar />
    </div>

    <!-- Contenido principal -->
    <div class="content flex-1 h-screen bg-gray-50 p-6 overflow-auto">
        <slot />
    </div>
    <!-- Botón para alternar modo oscuro -->
    <div class="fixed bottom-4 right-4 z-50">
        <button
            on:click={toggleDarkMode}
            class="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-300 transition"
            aria-label="Alternar modo oscuro"
        >
            {#if isDarkMode}
                🌙
            {:else}
                ☀️
            {/if}
        </button>
    </div>
</div>