const BASE_URL = 'http://localhost:8080/api';

import { buildErrorMessage } from "$lib/utils/errorUtils";

export async function registerClient({ name, phone, email, notes }) {
	const res = await fetch(`${BASE_URL}/clients`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, phone, email, notes }),
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		console.error('Error al registrar cliente:', errorBody);
		throw new Error(buildErrorMessage(errorBody, 'Error al registrar cliente'));
	}

	return await res.json(); // Devuelve el clientId
}

export async function registerDevice({ clientId, serialNumber, imei, model, color, notes }) {
	const res = await fetch(`${BASE_URL}/devices`, {
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

export async function registerTicket({ deviceId, initialStateDescription }) {
	const res = await fetch(`${BASE_URL}/tickets`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ deviceId, initialStateDescription }),
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al crear ticket'));
	}

	return await res.json(); // Devuelve el ticketId
}

export async function uploadDeviceImages(ticketId, files) {
	const formData = new FormData();
	files.forEach((file) => formData.append('files', file));
	formData.append('ticketId', ticketId.toString());

	const response = await fetch(`${BASE_URL}/images`, {
		method: 'POST',
		body: formData,
		credentials: 'include'
	});

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al subir imágenes'));
	}

	return await response.json(); // Lista de URLs de las imágenes
}

// GET

export async function getClient(clientId) {
	const res = await fetch(`${BASE_URL}/clients/${clientId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener cliente'));
	}

	return await res.json(); // Devuelve el cliente
}

export async function getDevice(deviceId) {
	const res = await fetch(`${BASE_URL}/devices/${deviceId}`, {
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

export async function getTicket(ticketId) {
	const res = await fetch(`${BASE_URL}/tickets/${ticketId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener ticket'));
	}

	return await res.json(); // Devuelve el ticket
}
