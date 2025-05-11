import { redirect } from '@sveltejs/kit';

export function load({ cookies, url }) {
	const jwt = cookies.get('jwt');
	const path = url.pathname;

	// Rutas públicas (sin login)
	const publicPaths = ['/auth/login', '/auth/register', '/auth/unauthorized'];
	const isPublic = publicPaths.some(p => path.startsWith(p));

	// Rutas accesibles para cualquier usuario autenticado
	const sharedAuthPaths = ['/dashboard', '/'];

	if (!jwt) {
		if (isPublic) return {};
		throw redirect(302, '/auth/login');
	}

	// Decodificar el JWT para obtener el rol
	const { role } = parseJwt(jwt) || {};

	if (!role) {
		throw redirect(302, '/auth/login');
	}

	const allowedPaths = {
		ROLE_TECHNICIAN: '/technician',
		ROLE_ADMIN: '/admin'
	};

	const allowedPrefix = allowedPaths[role];

	if (!isPublic && !sharedAuthPaths.includes(path)) {
		// Permitir acceso completo a ROLE_ADMIN
		if (role !== 'ROLE_ADMIN' && allowedPrefix && !path.startsWith(allowedPrefix)) {
			throw redirect(302, '/auth/unauthorized');
		}
	}

	return { role, isAuthenticated: true };
}

function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		console.error('Error al decodificar el JWT:', e);
		return null;
	}
}
