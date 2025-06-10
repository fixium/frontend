import { API_BASE_URL } from '$lib/utils/apiConfig';
import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = `${API_BASE_URL}/dashboard`;

export async function getDashboardData() {
	try {
		const token = localStorage.getItem('authToken');
		const response = await fetch(API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {})
			}
		});

		if (!response.ok) {
			throw new Error(await buildErrorMessage(response));
		}

		return response;
	} catch (error) {
		throw error;
	}
}

export async function getTicketsCountByStatus() {
	const token = localStorage.getItem('authToken');
	const res = await fetch(`${API_URL}/count-tickets-by-status`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener conteo de tickets por estado'));
	}
	return await res.json(); // [{ status: 'Abierto', count: 5 }, ...]
}

export async function getUsersCountByRole() {
	const token = localStorage.getItem('authToken');
	const res = await fetch(`${API_URL}/count-users-by-role`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener conteo de usuarios por rol'));
	}
	return await res.json(); // [{ role: 'ADMIN', count: 2 }, ...]
}
