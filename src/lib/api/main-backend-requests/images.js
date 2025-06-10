import { API_BASE_URL } from '$lib/utils/apiConfig';
import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = `${API_BASE_URL}/images`;

export async function uploadDeviceImages(ticketId, files) {
	const formData = new FormData();
	files.forEach((file) => formData.append('files', file));
	formData.append('ticketId', ticketId.toString());

	const token = localStorage.getItem('authToken');
	const response = await fetch(`${API_URL}`, {
		method: 'POST',
		body: formData,
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al subir imágenes'));
	}

	return await response.json(); // Lista de URLs de las imágenes
}
