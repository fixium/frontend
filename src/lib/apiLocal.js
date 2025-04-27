import apiFetch from './apiFetch';

// DeviceController endpoints
export async function pairDevice() {
    return apiFetch('/device/pair', { method: 'POST' });
}

export async function unpairDevice() {
    return apiFetch('/device/unpair', { method: 'POST' });
}

export async function fetchDeviceInfo() {
    return apiFetch('/device/info');
}

export async function restartDevice() {
    return apiFetch('/device/restart', { method: 'POST' });
}

export async function shutdownDevice() {
    return apiFetch('/device/shutdown', { method: 'POST' });
}

export async function fetchDeviceLogs() {
    const response = await fetch('/device-api/device/extract-logs');
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener los logs del dispositivo');
    }

    // Crear un blob desde la respuesta y descargar el archivo
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crash_logs.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

// RestoreController endpoints
export async function enterRecoveryMode() {
    return apiFetch('/restore/enter-recovery', { method: 'POST' });
}

export async function exitRecoveryMode() {
    return apiFetch('/restore/exit-recovery', { method: 'POST' });
}

export async function getLatestFirmware() {
    return apiFetch('/restore/get-latest-firmware');
}