<script>
    import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';

    import Icon from '$lib/Icon.svelte';

    let isOpen = true;
    let currentPath = '/';

    function toggleSidebar() {
        isOpen = !isOpen;
    }

    onMount(() => {
        currentPath = window.location.pathname; // Inicializa con la ruta actual
    });

    // Actualiza currentPath después de cada navegación
    afterNavigate(() => {
        currentPath = window.location.pathname;
    });

    const navItems = [
        // {
        //     section: 'Inicio',
        //     items: [{ name: 'Dashboard', icon: 'chart-bar', href: '/' }]
        // },
        {
            section: 'Reparaciones',
            items: [
                {
                    name: 'Herramientas de diagnóstico',
                    icon: 'device-phone-mobile',
                    href: '/herramienta-diagnostico'
                },
                // { name: 'Recepción', icon: 'inbox', href: '/reparaciones/recepcion' },
                // { name: 'Lista de dispositivos', icon: 'list-bullet', href: '/reparaciones/lista' },
                // { name: 'Seguimiento', icon: 'eye', href: '/reparaciones/seguimiento' } // Ícono ya definido
            ]
        },
        // {
        //     section: 'Diagnóstico',
        //     items: [
        //         { name: 'Historial de diagnósticos', icon: 'clock', href: '/diagnostico/historial' },
        //         { name: 'Logs Panic', icon: 'bug-ant', href: '/diagnostico/panic' },
        //         {
        //             name: 'Asistente técnico',
        //             icon: 'chat-bubble-bottom-center-text',
        //             href: '/diagnostico/asistente'
        //         },
        //         {
        //             name: 'Análisis de componentes',
        //             icon: 'wrench-screwdriver',
        //             href: '/diagnostico/componentes'
        //         }
        //     ]
        // },
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
        //     section: 'Usuarios',
        //     items: [
        //         { name: 'Gestión de usuarios', icon: 'users', href: '/usuarios' },
        //         { name: 'Actividad', icon: 'finger-print', href: '/usuarios/actividad' } // Ícono ya definido
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
        //     section: 'Herramientas Dev',
        //     items: [
        //         { name: 'Explorador de archivos', icon: 'folder-open', href: '/dev/explorador' },
        //         { name: 'Simulación GPS', icon: 'map-pin', href: '/dev/gps' },
        //         { name: 'Opciones avanzadas', icon: 'beaker', href: '/dev/avanzado' }
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
</script>

<style>
    nav {
        scrollbar-width: none; /* Oculta la scrollbar en Firefox */
        -ms-overflow-style: none; /* Oculta la scrollbar en IE y Edge */
    }

    nav::-webkit-scrollbar {
        display: none; /* Oculta la scrollbar en Chrome, Safari y Edge */
    }
</style>

<div
    class="group flex h-screen"
>
    <!-- Sidebar -->
    <aside
        class="bg-gray-900 text-white transition-all duration-300 ease-in-out group-hover:w-64 w-18 fixed md:relative h-full z-50 flex flex-col overflow-hidden"
    >
        <!-- Header de la sidebar -->
        <div class="flex items-center justify-start h-16 px-4 border-b border-gray-800">
            <a href="/" class="flex items-center gap-2">
                <img src="/Fix.png" alt="Logo" class="h-8 w-auto" />
                <span class="hidden group-hover:block text-xl font-semibold">Fixium</span>
            </a>
        </div>

        <!-- Navegación -->
        <nav class="flex-1 overflow-y-auto py-4">
            {#each navItems as section}
                <div class="mb-4">
                    <h3 class="hidden group-hover:block text-sm font-semibold text-gray-400 px-4 uppercase">{section.section}</h3>
                    <ul class="space-y-2 px-2">
                        {#each section.items as item}
                            <li>
                                <a
                                    href={item.href}
                                    data-sveltekit-navigate
                                    class="flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors
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
        <div class="p-4 border-t border-gray-800">
            <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span class="text-sm font-medium">US</span>
                </div>
                <div class="hidden group-hover:block ml-3">
                    <p class="text-sm font-medium">User</p>
                    <p class="text-xs text-gray-400">User@fixium.com</p>
                </div>
            </div>
        </div>
    </aside>
</div>