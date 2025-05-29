<script lang="ts">
  import { writable } from 'svelte/store';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

  let inputMessage = '';
  const messages = writable<{ role: 'technician' | 'assistant' | 'user'; content: string; copied?: boolean }[]>([]);
  let isLoading = false;
  let chatEndRef: HTMLDivElement | null = null;

  async function sendMessage() {
    if (isLoading || !inputMessage.trim()) return;

    // Añade el mensaje del usuario al historial local
    messages.update(msgs => [...msgs, { role: 'user', content: inputMessage }]);
    isLoading = true;

    try {
      // Obtén el historial actual de mensajes (sin el mensaje de sistema, que lo agrega el backend)
      let currentMessages;
      messages.subscribe(value => { currentMessages = value; })();

      // Prepara el body con el historial completo
      const body = {
        messages: currentMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      };

      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: "include"
      });

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || 'No se recibió una respuesta válida.';
      messages.update(msgs => [...msgs, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      messages.update(msgs => [...msgs, { role: 'assistant', content: 'Hubo un error al procesar tu mensaje.' }]);
    } finally {
      isLoading = false;
      inputMessage = '';
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    if (chatEndRef) {
      chatEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function copyToClipboard(content: string, index: number) {
    navigator.clipboard.writeText(content).then(() => {
      messages.update(msgs => {
        msgs[index].copied = true;
        return msgs;
      });

      setTimeout(() => {
        messages.update(msgs => {
          msgs[index].copied = false;
          return msgs;
        });
      }, 2000); // Cambia el ícono de nuevo después de 2 segundos
    }).catch(err => {
      console.error('Error al copiar el mensaje:', err);
    });
  }
</script>

<style>
  /* Scrollbar personalizada */
  .chat-container::-webkit-scrollbar {
    width: 8px;
  }
  .chat-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .chat-container::-webkit-scrollbar-track {
    background: transparent;
  }
  /* Spinner animado */
  .spinner {
    border-top-color: #2563eb;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>

<main class="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-100 via-white to-gray-200 overflow-hidden">
  <div class="flex flex-col items-center">
    <h1 class="text-4xl font-extrabold mb-6 mt-8 text-blue-700 drop-shadow">Asistente Técnico</h1>
  </div>

  <div class="chat-container flex flex-col gap-4 flex-grow overflow-y-auto px-2 md:px-0 py-4 max-w-2xl mx-auto w-full">
    {#each $messages as msg, index}
      <div class="flex flex-col items-start w-full">
        <div
          class={`relative rounded-3xl px-5 py-3 max-w-xl min-w-[80px] shadow-md transition-all
            ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white ml-auto mr-2 self-end rounded-br-none'
                : 'bg-white text-gray-800 mr-auto ml-2 self-start rounded-bl-none border border-gray-200'
            }
          `}
        >
          {#if msg.role === 'assistant'}
            <MarkdownRenderer content={msg.content} />
          {:else}
            <p class="font-semibold">{msg.content}</p>
          {/if}
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="self-start bg-white border border-gray-200 rounded-3xl px-5 py-3 max-w-xl flex items-center gap-2 shadow-md ml-2">
        <div class="spinner w-6 h-6 border-4 border-blue-300 border-t-blue-600 rounded-full"></div>
        <span class="text-gray-500 font-medium">Pensando...</span>
      </div>
    {/if}
    <div bind:this={chatEndRef}></div>
  </div>

  <div class="flex items-end justify-center w-full max-w-2xl mx-auto px-2 md:px-0 pb-6">
    <div class="flex items-center rounded-3xl bg-white shadow-lg border border-gray-200 p-3 w-full gap-2">
      <textarea
        placeholder="Escribe tu mensaje..."
        bind:value={inputMessage}
        class="flex-grow bg-transparent focus:outline-none font-semibold resize-none text-gray-800 placeholder-gray-400 px-2 py-1"
        rows="1"
        on:keydown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading) sendMessage();
          }
        }}
        disabled={isLoading}
      ></textarea>
      <button 
        on:click={sendMessage} 
        aria-label="Enviar mensaje"
        disabled={isLoading}
        class="transition-all duration-200 rounded-full p-2 bg-blue-500 hover:bg-blue-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-white" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>
</main>