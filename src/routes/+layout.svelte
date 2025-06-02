<script>
    import '../app.css';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import NavigationControls from '$lib/components/NavigationControls.svelte';
    import { toggleDarkMode } from '$lib/theme.js';
    import { onMount } from 'svelte';
    import { initializeTheme } from '$lib/theme.js';

    export let data;

    let role = data.role;
    let username = data.username;
    let name = data.name;

    let isDarkMode = false;

    function updateDarkMode() {
        isDarkMode = document.documentElement.classList.contains('dark');
    }

    onMount(() => {
        initializeTheme();
        updateDarkMode();
        // Escucha cambios manuales en la clase dark
        const observer = new MutationObserver(updateDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    });

    function handleToggleDarkMode() {
        toggleDarkMode();
        updateDarkMode();
    }
</script>


<svg xmlns="http://www.w3.org/2000/svg" class="goo" version="1.1" width="100%">
    <defs>
        <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15" result="goo"></feColorMatrix>
            <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
        </filter>
    </defs>
</svg>
<div id="cursor"></div>

<style>
	.sidebar {
		position: fixed; /* Fija la barra lateral */
		top: 0;
		left: 0;
		height: 100vh;
		width: 5rem; /* Ancho inicial de la barra lateral */
		z-index: 50; /* Asegura que esté por encima del contenido */
		transition: width 0.3s ease-in-out; /* Transición para el ancho */
        /* transparencia a la sidebar */
        background-color: rgba(8, 21, 37, 0.98); /* Color de fondo con transparencia */
	}


	.sidebar:hover {
		width: 13rem; /* Ancho expandido al pasar el mouse */
	}

	.content.with-sidebar {
		padding-left: 6rem; /* Ajusta el contenido cuando la sidebar está visible */
	}

	.content.full-width {
		padding-left: 0; /* Elimina el espacio cuando la sidebar no está visible */
	}

	.content {
		transition: padding-left 0.3s ease-in-out; /* Transición suave */
	}
</style>


<div class="flex">
    {#if data.isAuthenticated}
        <div class="sidebar bg-gray-900 text-white">
            <Sidebar {role} {username} {name} />
        </div>
    {/if}

    <!-- Contenido principal -->
    <div class="content {data.isAuthenticated ? 'with-sidebar' : 'full-width'} flex-1 h-screen  p-6 overflow-auto">
        <NavigationControls />
        <slot />

                <!-- Botón flotante para modo oscuro/claro -->
        <div class="fixed bottom-4 right-4 z-50">
            <button
                on:click={handleToggleDarkMode}
                class="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 p-3 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
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
</div>
