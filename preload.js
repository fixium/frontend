const { contextBridge, ipcRenderer } = require('electron');

// Exponer funciones seguras al contexto del navegador
contextBridge.exposeInMainWorld('electron', {
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),

    openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),

    // Inicia la descarga desde el proceso main
    startDownload: (url) => ipcRenderer.invoke('start-download', url),

    // Escucha el progreso de descarga
    onDownloadProgress: (callback) => {
        ipcRenderer.on('download-progress', (_, progress) => callback(progress));
    },

    // Cancela la descarga
    cancelDownload: () => ipcRenderer.invoke('cancel-download'),
});
