interface Window {
    electron: {
        openFileDialog: () => Promise<string>;
        openFolderDialog: () => Promise<string>;
        onDownloadProgress: (callback: (progress: number) => void) => void;
        startDownload: (url: string) => Promise<void>;
        cancelDownload: () => void; // Asegúrate de incluir esta línea
    };
}