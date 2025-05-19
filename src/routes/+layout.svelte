<script>
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';

	export let data;

	let role = data.role;

	import { onMount } from 'svelte';
	onMount(() => {
		import('$lib/cursor.js');
	});
</script>

<div class="flex">
	{#if data.isAuthenticated}
		<div class="sidebar bg-gray-900 text-white">
			<Sidebar {role} />
		</div>
	{/if}

	<!-- Contenido principal -->
	<div
		class="content {data.isAuthenticated
			? 'with-sidebar'
			: 'full-width'} flex-1 h-screen bg-gray-50 p-6 overflow-auto"
	>
		<slot />
	</div>
</div>
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
