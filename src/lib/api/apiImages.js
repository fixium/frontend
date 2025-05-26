import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = 'http://localhost:8080/api/images';

export async function uploadDeviceImages(ticketId, files) {
	const formData = new FormData();
	files.forEach((file) => formData.append('files', file));
	formData.append('ticketId', ticketId.toString());

	const response = await fetch(`${API_URL}`, {
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
