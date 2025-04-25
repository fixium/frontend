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
      {
        section: 'Inicio',
        items: [
          { name: 'Dashboard', icon: 'chart-bar', href: '/' },
        ]
      },
      {
          section: 'Reparaciones',
          items: [
              { name: 'Herramientas de diagnóstico', icon: 'device-phone-mobile', href: '/herramienta-diagnostico' },
              { name: 'Recepción', icon: 'inbox', href: '/reparaciones/recepcion' },
              { name: 'Lista de dispositivos', icon: 'list-bullet', href: '/reparaciones/lista' },
              { name: 'Seguimiento', icon: 'eye', href: '/reparaciones/seguimiento' }, // Ícono ya definido
          ]
      },
      {
        section: 'Diagnóstico',
        items: [
          { name: 'Historial de diagnósticos', icon: 'clock', href: '/diagnostico/historial' },
          { name: 'Logs Panic', icon: 'bug-ant', href: '/diagnostico/panic' },
          { name: 'Asistente técnico', icon: 'chat-bubble-bottom-center-text', href: '/diagnostico/asistente' },
          { name: 'Análisis de componentes', icon: 'wrench-screwdriver', href: '/diagnostico/componentes' },
        ]
      },
      {
        section: 'Colaboración',
        items: [
          { name: 'Base de soluciones', icon: 'book-open', href: '/colaboracion/soluciones' },
          { name: 'Alertas y recomendaciones', icon: 'exclamation-triangle', href: '/colaboracion/alertas' },
          { name: 'Contribuir solución', icon: 'plus-circle', href: '/colaboracion/contribuir' },
        ]
      },
      {
          section: 'Usuarios',
          items: [
              { name: 'Gestión de usuarios', icon: 'users', href: '/usuarios' },
              { name: 'Actividad', icon: 'finger-print', href: '/usuarios/actividad' }, // Ícono ya definido
          ]
      },
      {
        section: 'Estadísticas',
        items: [
          { name: 'Reportes', icon: 'chart-pie', href: '/estadisticas/reportes' },
          { name: 'Métricas técnicas', icon: 'cpu-chip', href: '/estadisticas/tecnicas' },
        ]
      },
      {
        section: 'Herramientas Dev',
        items: [
          { name: 'Explorador de archivos', icon: 'folder-open', href: '/dev/explorador' },
          { name: 'Simulación GPS', icon: 'map-pin', href: '/dev/gps' },
          { name: 'Opciones avanzadas', icon: 'beaker', href: '/dev/avanzado' },
        ]
      },
      {
          section: 'Configuración',
          items: [
              { name: 'Preferencias', icon: 'cog-6-tooth', href: '/configuracion' }, // Ícono ya definido
              { name: 'Licencia', icon: 'key', href: '/configuracion/licencia' }, // Ícono ya definido
          ]
      },
    ];
  </script>
  

  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside
        class="bg-gray-900 text-white transition-all duration-300 ease-in-out {isOpen ? 'w-64' : 'w-16'} 
        fixed md:relative h-full z-10 flex flex-col"
    >
        <!-- Header de la sidebar -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            {#if isOpen}
                <span class="text-xl font-semibold">Fixium</span>
            {/if}
            <button
                on:click={toggleSidebar}
                class="p-2 rounded-md hover:bg-gray-800 focus:outline-none"
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {#if isOpen}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    {:else}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    {/if}
                </svg>
            </button>
        </div>

        <!-- Navegación -->
        <nav class="flex-1 overflow-y-auto py-4">
            {#each navItems as section}
                <div class="mb-4">
                    {#if isOpen}
                        <h3 class="text-sm font-semibold text-gray-400 px-4 uppercase">{section.section}</h3>
                    {/if}
                    <ul class="space-y-2 px-2">
                        {#each section.items as item}
                            <li>
                                <a
                                    href={item.href}
                                    data-sveltekit-navigate
                                    class="flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors
                                    {currentPath === item.href ? 'bg-gray-800 text-white' : 'text-gray-400'}"
                                >
                                    <span class="inline-flex">
                                        <Icon name={item.icon} />
                                    </span>
                                    {#if isOpen}
                                        <span class="ml-3">{item.name}</span>
                                    {/if}
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
                {#if isOpen}
                    <div class="ml-3">
                        <p class="text-sm font-medium">Frank</p>
                        <p class="text-xs text-gray-400">frankskep@gmail.com</p>
                    </div>
                {/if}
            </div>
        </div>
    </aside>
</div>