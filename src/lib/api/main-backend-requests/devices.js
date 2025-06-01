import { API_BASE_URL } from '$lib/utils/apiConfig';
import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = `${API_BASE_URL}/devices`;

export async function fetchDevices(customerId) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_URL}/customer/${customerId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al obtener dispositivos'));
    }
    return await res.json();
}

export async function registerDevice({ customerId, serialNumber, imei, model, color, notes }) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ customerId, serialNumber, imei, model, color, notes })
    });

    if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(buildErrorMessage(errorBody, 'Error al registrar dispositivo'));
    }

    return await res.json(); // Devuelve el deviceId
}
export async function getDevice(deviceId) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_URL}/${deviceId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });

    if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(buildErrorMessage(errorBody, 'Error al obtener dispositivo'));
    }

    return await res.json(); // Devuelve el dispositivo
}