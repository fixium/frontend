const BASE_URL = 'http://localhost:8081/device-api';

async function apiFetch(endpoint, options = {}) {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, options);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({})); // Maneja errores de JSON vacío
			throw new Error(errorData.detail || 'Error en la solicitud');
		}

		// Verifica si hay contenido antes de intentar parsear como JSON
		const text = await response.text();
		return text ? JSON.parse(text) : {}; // Devuelve un objeto vacío si no hay contenido
	} catch (error) {
		console.error(`Error en ${endpoint}:`, error.message);
		throw error;
	}
}

export default apiFetch;
