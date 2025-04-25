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

export async function getLatestFirmware() {
    return apiFetch('/restore/get-latest-firmware');
}