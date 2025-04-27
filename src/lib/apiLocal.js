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