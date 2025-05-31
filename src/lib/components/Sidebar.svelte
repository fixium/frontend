<script>
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { logout } from '$lib/api/main-backend-requests/auth';
	import { goto } from '$app/navigation';

	export let role, username, name;

	import Icon from '$lib/components/Icon.svelte';

	// let isOpen = false;
	let currentPath = '/';
	let showMenu = false;

	async function handleLogout() {
		const success = await logout();
		if (success) {
			goto('/auth/login'); // Redirige al login después de cerrar sesión
		} else {
			alert('Error al cerrar sesión. Inténtalo de nuevo.');
		}
	}

	function handleAccountManagement() {
		goto('/mi-cuenta');
	}

	onMount(() => {
		currentPath = window.location.pathname;
	});

	// Actualiza currentPath después de cada navegación
	afterNavigate(() => {
		currentPath = window.location.pathname;
	});

	const navItems = [
		{
			section: 'Inicio',
			items: [
				{
					name: 'Dashboard',
					icon: 'chart-bar',
					href: '/dashboard',
					roles: ['ROLE_TECHNICIAN', 'ROLE_ADMIN', 'ROLE_RECEPTIONIST']
				}
			]
		},
		{
			section: 'Reparaciones',
			items: [
				// {
				// 	name: 'Clientes',
				// 	icon: 'user',
				// 	href: '/receptionist/clientes',
				// 	roles: ['ROLE_ADMIN', 'ROLE_RECEPTIONIST']
				// },
				// {
				// 	name: 'Dispositivos',
				// 	icon: 'device-phone-mobile',
				// 	href: '/technician/dispositivos',
				// 	roles: ['ROLE_TECHNICIAN', 'ROLE_ADMIN']
				// },
				{
					name: 'Recepción',
					icon: 'inbox',
					href: '/receptionist/tickets',
					roles: ['ROLE_ADMIN', 'ROLE_RECEPTIONIST']
				},
				{
					name: 'Mis tickets',
					icon: 'inbox',
					href: '/technician/tickets',
					roles: ['ROLE_TECHNICIAN']
				},
				{
					name: 'Reparaciones',
					icon: 'clock',
					href: '/technician/reparaciones',
					roles: ['ROLE_TECHNICIAN', 'ROLE_ADMIN']
				}
			]
		},
		{
			section: 'Administrar Taller',
			items: [
				{
					name: 'Administrar Usuarios',
					icon: 'users',
					href: '/admin/usuarios',
					roles: ['ROLE_ADMIN']
				}
			]
		},
		{
			section: 'Diagnóstico',
			items: [
				{
					name: 'Herramientas',
					icon: 'device-phone-mobile',
					href: '/technician/herramientas',
					roles: ['ROLE_TECHNICIAN', 'ROLE_ADMIN']
				},
				{
					name: 'Asistente inteligente',
					icon: 'chat-bubble-bottom-center-text',
					href: '/technician/asistente',
					roles: ['ROLE_TECHNICIAN', 'ROLE_ADMIN']
				},
				{
					name: 'Análisis de Panic',
					icon: 'bug-ant',
					href: '/technician/analyze-panic',
					roles: ['ROLE_TECHNICIAN', 'ROLE_ADMIN']
				}
			]
		}
		// {
		//     section: 'Colaboración',
		//     items: [
		//         { name: 'Base de soluciones', icon: 'book-open', href: '/colaboracion/soluciones' },
		//         {
		//             name: 'Alertas y recomendaciones',
		//             icon: 'exclamation-triangle',
		//             href: '/colaboracion/alertas'
		//         },
		//         { name: 'Contribuir solución', icon: 'plus-circle', href: '/colaboracion/contribuir' }
		//     ]
		// },
		// {
		//     section: 'Estadísticas',
		//     items: [
		//         { name: 'Reportes', icon: 'chart-pie', href: '/estadisticas/reportes' },
		//         { name: 'Métricas técnicas', icon: 'cpu-chip', href: '/estadisticas/tecnicas' }
		//     ]
		// },
		// {
		//     section: 'Configuración',
		//     items: [
		//         { name: 'Preferencias', icon: 'cog-6-tooth', href: '/configuracion' }, // Ícono ya definido
		//         { name: 'Licencia', icon: 'key', href: '/configuracion/licencia' } // Ícono ya definido
		//     ]
		// }
	];

	// Filtrar los enlaces según el rol
	const filteredNavItems = navItems
		.map((section) => {
			const filteredItems = section.items.filter(
				(item) => !item.roles || item.roles.includes(role)
			);
			return {
				...section,
				items: filteredItems
			};
		})
		.filter((section) => section.items.length > 0); // Oculta secciones sin elementos visibles
</script>

<div class="group flex h-screen">
	<!-- Sidebar -->
	<aside
		class="bg-gray-900 text-white transition-all duration-300 ease-in-out group-hover:w-64 w-18 fixed md:relative h-full z-50 flex flex-col overflow-hidden"
		on:mouseleave={() => (showMenu = false)}
	>
		<!-- Header de la sidebar -->
		<div class="flex items-center justify-start h-16 px-4 border-b border-gray-800">
			<a href="/" class="flex items-center gap-2">
				<img src="/Fix.png" alt="Logo" class="h-12 w-auto" />
				<span class="hidden group-hover:block text-xl font-semibold">Fixium</span>
			</a>
		</div>

		<!-- Navegación -->
		<nav class="flex-1 overflow-y-auto py-4">
			{#each filteredNavItems as section}
				<div class="mb-4">
					<h3 class="hidden group-hover:block text-sm font-semibold text-gray-400 px-4 uppercase">
						{section.section}
					</h3>
					<ul class="space-y-2 px-2">
						{#each section.items as item}
							<li>
								<a
									href={item.href}
									data-sveltekit-navigate
									class="flex items-center p-2 rounded-md transition-colors section-title
                                {currentPath === item.href
										? 'bg-gray-800 text-white'
										: 'text-gray-400'}"
								>
									<span class="inline-flex">
										<Icon name={item.icon} />
									</span>
									<span class="hidden group-hover:block ml-3">{item.name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>

		<!-- Footer de la sidebar -->
		<div class="p-4 border-t border-gray-800 relative">
			<button
				class="flex items-center cursor-pointer w-full text-left"
				on:click={() => (showMenu = !showMenu)}
				on:keydown={(e) => e.key === 'Enter' && (showMenu = !showMenu)}
				aria-expanded={showMenu}
				aria-label="Abrir menú de usuario"
			>
				<div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
					<span class="text-sm font-medium">US</span>
				</div>
				<div class="hidden group-hover:block ml-3">
					<p class="text-sm font-medium">{name}</p>
					<p class="text-xs text-gray-400">{username}</p>
				</div>
			</button>

			{#if showMenu}
				<div class="absolute bottom-16 left-4 bg-gray-800 text-white rounded-md shadow-lg w-48">
					<ul class="py-2">
						<li
							class="px-4 py-2 cursor-pointer account-management"
							on:click={() => goto('/mi-cuenta')}
							on:keydown={(e) => e.key === 'Enter' && handleAccountManagement()}
							role="menuitem"
							tabindex="0"
						>
							Gestionar cuenta
						</li>
						<li
							class="px-4 py-2 hover:text-white cursor-pointer logout"
							on:click={handleLogout}
							on:keydown={(e) => e.key === 'Enter' && handleLogout()}
							role="menuitem"
							tabindex="0"
						>
							Cerrar sesión
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</aside>
</div>

<style>
	nav {
		scrollbar-width: none; /* Oculta la scrollbar en Firefox */
		-ms-overflow-style: none; /* Oculta la scrollbar en IE y Edge */
	}

	nav::-webkit-scrollbar {
		display: none; /* Oculta la scrollbar en Chrome, Safari y Edge */
	}

	.section-title {
		z-index: 0;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.section-title::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, #669ef8);
		z-index: -1;
		transition: left 0.5s ease;
	}

	.section-title:hover::after {
		left: 0;
	}

	.section-title:hover {
		color: #fff;
	}

	li {
		z-index: 0;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	li::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		z-index: -1;
		transition: left 0.5s ease;
	}

	li:hover::after {
		left: 0;
	}

	li:hover {
		color: #fff;
	}

	li.account-management::after {
		background: linear-gradient(90deg, #669ef8, #3e88ff);
	}
	li.logout::after {
		background: linear-gradient(90deg, #f87171, #ff3333);
	}
</style>
