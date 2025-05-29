import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = 'http://localhost:8080/api/clients';

export async function registerClient({ name, phone, email, notes }) {
	const res = await fetch(`${API_URL}`, {
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
export async function getClient(clientId) {
	const res = await fetch(`${API_URL}/${clientId}`, {
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

export async function getClients() {
    const res = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(buildErrorMessage(errorBody, 'Error al obtener clientes'));
    }

    return await res.json(); // Devuelve el array de clientes
}