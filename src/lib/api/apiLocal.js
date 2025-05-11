import apiFetch from './apiFetch';

// ========================
// DeviceController Endpoints
// ========================

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

export async function activateDevice() {
    return apiFetch('/device/activate', { method: 'POST' });
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

// ========================
// RestoreController Endpoints
// ========================

export async function enterRecoveryMode() {
    return apiFetch('/restore/enter-recovery', { method: 'POST' });
}

export async function exitRecoveryMode() {
    return apiFetch('/restore/exit-recovery', { method: 'POST' });
}

export async function createDeviceBackup(backupPath) {
    return apiFetch('/restore/backup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ backup_path: backupPath })
    });
}

export async function restoreDeviceBackup(backupPath) {
    return apiFetch('/restore/restore-backup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ backup_path: backupPath })
    });
}

export async function getSignedFirmwares() {
    return apiFetch('/restore/get-signed-firmwares');
}

export async function restoreDeviceWithIPSW(ipswFilePath) {
    return apiFetch('/restore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipsw_file_path: ipswFilePath })
    });
}