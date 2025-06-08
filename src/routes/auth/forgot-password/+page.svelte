<script>
  import { onMount } from 'svelte';
  import { forgotPassword } from '$lib/api/main-backend-requests/auth.js';
  let email = '';
  let message = '';
  let loading = false;

  async function handleSubmit(e) {
    e.preventDefault();
    loading = true;
    message = '';
    try {
      const result = await forgotPassword(email);
      message = result.message;
    } catch (err) {
      message = 'Ocurrió un error. Intenta de nuevo.';
    }
    loading = false;
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
  <label for="email" class="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
    <i class="fas fa-envelope text-blue-600"></i>
    Correo electrónico
  </label>
  <div class="relative mb-5">
    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
      <i class="fas fa-at text-gray-400"></i>
    </span>
    <input
      id="email"
      type="email"
      bind:value={email}
      required
      class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      placeholder="Ingresa tu correo"
      autocomplete="email"
    />
  </div>
  <button type="submit" class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
    {#if loading}
      <i class="fas fa-spinner fa-spin"></i>
      Enviando...
    {:else}
      <i class="fas fa-key"></i>
      Restablecer contraseña
    {/if}
  </button>
  {#if message}
    <div class="mt-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium
      {message === 'Ocurrió un error. Intenta de nuevo.' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}">
      {#if message === 'Ocurrió un error. Intenta de nuevo.'}
        <i class="fas fa-exclamation-circle text-red-500"></i>
      {:else}
        <i class="fas fa-check-circle text-green-500"></i>
      {/if}
      <span>{message}</span>
    </div>
  {/if}
</form>