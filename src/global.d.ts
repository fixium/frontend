interface Window {
    electron: {
        onDownloadProgress: (callback: (progress: number) => void) => void;
        startDownload: (url: string) => Promise<void>;
        cancelDownload: () => void; // Asegúrate de incluir esta línea
    };
}