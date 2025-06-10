import { fetchUserById } from '$lib/api/main-backend-requests/users';

export async function load({ params, fetch }) {
	try {
		// Pasamos fetch como customFetch para mantener las cookies/sesión del SSR
		const user = await fetchUserById(params.id, fetch);
		return { user };
	} catch (error) {
		throw new Error(error.message || 'Error al obtener los datos del usuario');
	}
}
