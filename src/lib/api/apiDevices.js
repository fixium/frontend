import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = 'http://localhost:8080/api/devices';

export async function fetchDevices(clientId) {
	const res = await fetch(`${API_URL}/client/${clientId}`, {
		credentials: 'include'
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener dispositivos'));
	}
	return await res.json();
}

export async function registerDevice({ clientId, serialNumber, imei, model, color, notes }) {
	const res = await fetch(`${API_URL}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ clientId, serialNumber, imei, model, color, notes }),
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
