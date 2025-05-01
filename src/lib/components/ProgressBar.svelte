<script lang="ts">
    export let progress: number = 0; // Progreso de la descarga (0 a 1)
    export let onCancel: () => void; // Función para cancelar la descarga
  </script>
  
  <div class="progress-bar-wrapper">
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: {progress * 100}%;"></div>
    </div>
    <button class="cancel-button" on:click={onCancel}>Cancelar</button>
  </div>
  
  <style>
    .progress-bar-wrapper {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 300px;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  
    .progress-bar-container {
      flex: 1;
      height: 8px;
      background-color: #e5e7eb; /* gris claro */
      border-radius: 4px;
      overflow: hidden;
    }
  
    .progress-bar {
      height: 100%;
      background-color: #3b82f6; /* azul */
      transition: width 0.3s ease;
    }
  
    .cancel-button {
      background-color: #ef4444; /* rojo */
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.3s ease;
    }
  
    .cancel-button:hover {
      background-color: #dc2626; /* rojo oscuro */
    }
  </style>