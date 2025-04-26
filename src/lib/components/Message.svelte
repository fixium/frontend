<script>
    export let type = 'success'; // Puede ser 'success' o 'error'
    export let message = '';
    export let onClose = () => {};
  </script>
  
  <div
    class={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg flex items-center justify-between gap-4 ${
      type === 'success'
        ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
        : 'bg-red-100 border-l-4 border-red-500 text-red-700'
    }`}
  >
    <div>
      <p class="font-semibold">{type === 'success' ? 'Éxito:' : 'Error:'}</p>
      <p>{message}</p>
    </div>
    <button
      on:click={onClose}
      class={`hover:${type === 'success' ? 'text-green-900' : 'text-red-900'}`}
      aria-label={`Cerrar mensaje de ${type}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>