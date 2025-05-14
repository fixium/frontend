<script lang="ts">
  import { writable } from 'svelte/store';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

  let inputMessage = '';
  const messages = writable<{ role: 'technician' | 'assistant' | 'user'; content: string; copied?: boolean }[]>([]);
  let isLoading = false;
  let chatEndRef: HTMLDivElement | null = null;

  async function sendMessage() {
    if (!inputMessage.trim()) return;

    messages.update(msgs => [...msgs, { role: 'user', content: inputMessage }]);
    isLoading = true;

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          user: "frank"
        }),
        credentials: "include"
      });

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'No se recibió una respuesta válida.';
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

<main class="p-6 flex flex-col h-full max-h-full">
  <h1 class="text-3xl font-bold mb-4">Asistente Técnico</h1>

  <div class="chat-container flex flex-col gap-4 flex-grow overflow-y-auto">
    {#each $messages as msg, index}
      <div class="flex flex-col items-start">
        <div
          class={`rounded-2xl p-4 max-w-2xl whitespace-pre-wrap break-words ${
            msg.role === 'user'
              ? 'bg-gray-200 ml-auto text-right'
              : 'bg-gray-300 mr-auto text-left'
          }`}
        >
          {#if msg.role === 'assistant'}
            <MarkdownRenderer content={msg.content} />
          {:else}
            <p class="font-semibold">{msg.content}</p>
          {/if}
        </div>
        <!-- <button
            class="mt-2 text-blue-500 hover:underline self-end flex items-center gap-1 p-2"
            on:click={() => copyToClipboard(msg.content, index)}
            >
            {#if msg.copied}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-green-500" viewBox="0 0 24 24">
                <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/>
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-blue-500" viewBox="0 0 24 24">
                <path d="M19 21H9c-1.1 0-2-.9-2-2V7H5V5h4V3h6v2h4v2h-2v12c0 1.1-.9 2-2 2zm-6-2h6V7H9v12zm-2-8H7v2h2v-2zm0 4H7v2h2v-2z"/>
                </svg>
            {/if}
            </button> -->
      </div>
    {/each}

    {#if isLoading}
    <div class="self-start bg-gray-300 rounded-2xl p-4 max-w-xl flex items-center gap-2">
        <div class="spinner w-6 h-6 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
    {/if}
    <div bind:this={chatEndRef}></div>
  </div>

  <div class="flex items-center rounded-2xl bg-gray-300 p-4 mt-4">
    <input
      type="text"
      placeholder="Escribir un mensaje:"
      bind:value={inputMessage}
      class="flex-grow bg-transparent focus:outline-none font-semibold"
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
    />
    <button on:click={sendMessage} aria-label="Send message">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-black" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
    </button>
  </div>
</main>