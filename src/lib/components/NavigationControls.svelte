<script>
	const goBack = () => history.back();
	const goForward = () => history.forward();
	const reload = () => location.reload();
</script>

<!-- Puedes usar Heroicons (https://heroicons.com/) o cualquier SVG simple para los íconos -->
<div class="flex gap-1 items-center">
	<button
		on:click={goBack}
		class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
		aria-label="Atrás"
	>
		<!-- Icono flecha izquierda -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-4 h-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
	<button
		on:click={reload}
		class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
		aria-label="Recargar"
	>
		<!-- Icono recargar -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-4 h-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 4v5h.582M19.418 19A9 9 0 105 5.582"
			/>
		</svg>
	</button>
	<button
		on:click={goForward}
		class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-gray-100 hover:bg-gray-900 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
		aria-label="Adelante"
	>
		<!-- Icono flecha derecha -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-4 h-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>
