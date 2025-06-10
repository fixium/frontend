import { API_BASE_URL } from '$lib/utils/apiConfig';
import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = `${API_BASE_URL}/users`;
const JSON_HEADERS = {
	'Content-Type': 'application/json'
};

export async function addUser({ name, phoneNumber, username, password, role, images = [] }) {
	const formData = new FormData();

	images.forEach((file) => formData.append('images', file));

	const jsonBlob = new Blob([JSON.stringify({ name, phoneNumber, username, password, role })], {
		type: 'application/json'
	});
	formData.append('data', jsonBlob);

	const token = localStorage.getItem('authToken');
	const response = await fetch(API_URL, {
		method: 'POST',
		body: formData,
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al agregar usuario'));
	}

	return await response.text();
}

export async function updateUser(userId, userData) {
	const token = localStorage.getItem('authToken');
	const response = await fetch(`${API_URL}/${userId}`, {
		method: 'PUT',
		headers: {
			...JSON_HEADERS,
			...(token ? { Authorization: `Bearer ${token}` } : {})
		},
		body: JSON.stringify(userData)
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al actualizar el usuario'));
	}

	return await response.text();
}

export async function deleteUser(userId) {
	const token = localStorage.getItem('authToken');
	const response = await fetch(`${API_URL}/${userId}`, {
		method: 'DELETE',
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al eliminar usuario'));
	}

	return true;
}

export async function fetchUsers(customFetch = fetch) {
	const token = localStorage.getItem('authToken');
	const response = await customFetch(API_URL, {
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});
	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener usuarios'));
	}
	return await response.json();
}

export async function fetchTechnicians() {
	const token = localStorage.getItem('authToken');
	const response = await fetch(`${API_URL}/technicians`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});
	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener técnicos'));
	}
	return await response.json();
}

export async function fetchUserById(userId, customFetch = fetch) {
	const token = localStorage.getItem('authToken');
	const response = await customFetch(`${API_URL}/${userId}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});
	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener usuario'));
	}
	return await response.json();
}

export async function changePassword(passwordRequest) {
	const token = localStorage.getItem('authToken');
	const response = await fetch(`${API_URL}/change-password`, {
		method: 'PATCH',
		headers: {
			...JSON_HEADERS,
			...(token ? { Authorization: `Bearer ${token}` } : {})
		},
		body: JSON.stringify(passwordRequest)
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al cambiar la contraseña'));
	}

	return await response.text();
}

export async function deleteMyAccount() {
	const token = localStorage.getItem('authToken');
	const response = await fetch(`${API_URL}/delete-my-account`, {
		method: 'DELETE',
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al eliminar tu cuenta'));
	}

	return true;
}
