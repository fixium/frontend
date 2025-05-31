import { buildErrorMessage } from '$lib/utils/errorUtils';
import { API_BASE_URL } from '$lib/utils/apiConfig';

const API_URL = `${API_BASE_URL}/customers`;

export async function registerCustomer({ name, phone, email, notes }) {
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
export async function getCustomer(customerId) {
	const res = await fetch(`${API_URL}/${customerId}`, {
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

export async function getCustomers() {
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