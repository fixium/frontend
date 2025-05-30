import { API_BASE_URL } from '$lib/utils/apiConfig';
import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = `${API_BASE_URL}/devices`;

export async function fetchDevices(customerId) {
	const res = await fetch(`${API_URL}/customer/${customerId}`, {
		credentials: 'include'
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener dispositivos'));
	}
	return await res.json();
}

export async function registerDevice({ customerId, serialNumber, imei, model, color, notes }) {
	const res = await fetch(`${API_URL}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ customerId, serialNumber, imei, model, color, notes }),
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al registrar dispositivo'));
	}

	return await res.json(); // Devuelve el deviceId
}
export async function getDevice(deviceId) {
	const res = await fetch(`${API_URL}/${deviceId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener dispositivo'));
	}

	return await res.json(); // Devuelve el dispositivo
}
