<script>
    import '../app.css';
    import Sidebar from '$lib/Sidebar.svelte';
</script>

<style>
    .sidebar {
        position: fixed; /* Fija la barra lateral */
        top: 0;
        left: 0;
        height: 100vh;
        width: 4rem; /* Ancho inicial de la barra lateral */
        z-index: 50; /* Asegura que esté por encima del contenido */
        transition: width 0.7s ease-in-out; /* Transición para el ancho */
    }

    .sidebar:hover {
        width: 16rem; /* Ancho expandido al pasar el mouse */
    }

    .content {
        padding-left: 4rem; /* Espacio inicial para el contenido */
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
</div>