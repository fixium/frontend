<script>
    import '../app.css';
    import Sidebar from '$lib/Sidebar.svelte';
</script>
<!-- <slot /> -->

<div class="flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido principal -->
    <div class="flex-1">
        <slot />
    </div>
</div>