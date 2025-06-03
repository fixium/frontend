<script>
    export let name;
</script>

<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {#if name === 'chart-bar'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h4v11H3V10zm6 4h4v7h-4v-7zm6-6h4v13h-4V8z" />
    {:else if name === 'device-phone-mobile'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 18h4" />
    {:else if name === 'arrow-uturn-up'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10l7-7m0 0l7 7m-7-7v18" />
    {:else if name === 'cloud-arrow-up'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 014-4h1a4 4 0 118 0h1a4 4 0 110 8H7a4 4 0 01-4-4z" />
    {:else if name === 'document-magnifying-glass'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
    {:else if name === 'inbox'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-3 3m-10-3l3 3" />
    {:else if name === 'list-bullet'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
    {:else if name === 'eye'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    {:else if name === 'clock'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    {:else if name === 'bug-ant'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4a2 2 0 014 0m-4 16a2 2 0 014 0m-4-8a2 2 0 014 0m-4-4a2 2 0 014 0" />
    {:else if name === 'chat-bubble-bottom-center-text'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h8m-8 4h4m-2 8a9 9 0 100-18 9 9 0 000 18zm0 0v-2a3 3 0 00-3-3H5.5" />
    {:else if name === 'wrench-screwdriver'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 18h4" />
    {:else if name === 'book-open'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    {:else if name === 'exclamation-triangle'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
    {:else if name === 'plus-circle'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    {:else if name === 'users'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-5-4m-6 6v-2a4 4 0 00-5-4m5 6h6m-6-6a4 4 0 110-8 4 4 0 010 8zm6 0a4 4 0 110-8 4 4 0 010 8z" />
    {:else if name === 'finger-print'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 2-2-.9-2-2zm0 0c0 1.1-.9 2-2 2s-2-.9-2-2 2-2 2-2 2 .9 2 2z" />
    {:else if name === 'chart-pie'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1021 13h-8V3.055z" />
    {:else if name === 'folder-open'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    {:else if name === 'map-pin'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
    {:else if name === 'beaker'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3a3 3 0 00-3 3v4.5a3 3 0 00.879 2.121l5.25 5.25a3 3 0 004.242 0l5.25-5.25A3 3 0 0021 10.5V6a3 3 0 00-3-3H9.75z" />
    {:else if name === 'cog-6-tooth'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
    {:else if name === 'building-office'}
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21V7a2 2 0 012-2h2V3h6v2h2a2 2 0 012 2v14M9 21V9h6v12" />
    {:else if name === 'key'}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
        <!-- Ícono por defecto -->
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    {/if}
</svg>