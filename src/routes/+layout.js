import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	if (typeof window === 'undefined') return; // Solo cliente

	const jwt = localStorage.getItem('authToken');
	const path = url.pathname;

	const publicPaths = ['/auth/login', '/auth/register', '/auth/unauthorized'];
	const isPublic = publicPaths.some(p => path.startsWith(p));
	const sharedAuthPaths = ['/dashboard', '/', '/mi-cuenta'];

	// 🔐 Si no hay token y no es ruta pública → redirige
	if (!jwt) {
		if (isPublic) return {};
		if (path === '/auth/login') return {};
        throw redirect(302, '/auth/login');
	}

	const payload = parseJwt(jwt);

	// 🔒 Si token inválido o expirado → borrar y redirigir
	if (!payload || !payload.exp || Date.now() / 1000 > payload.exp) {
		localStorage.removeItem('authToken');
		throw redirect(302, '/auth/login');
	}

	const { role, username, name, id } = payload;

	// Si esta autenticado y accede a login → redirigir a dashboard
	if (path === '/auth/login' || path === '/auth/register') {
        throw redirect(302, '/dashboard');
    }

	// 🚫 Validar acceso por rol
	const accessMatrix = {
		ROLE_ADMIN: {
			allowedRoutes: ['/admin', '/receptionist', '/technician'],
			deniedRoutes: ['/technician/reparaciones/nueva']
		},
		ROLE_TECHNICIAN: {
			allowedRoutes: ['/technician'],
			deniedRoutes: ['/admin', '/receptionist/tickets/nuevo']
		},
		ROLE_RECEPTIONIST: {
			allowedRoutes: ['/receptionist', '/technician/reparaciones'],
			deniedRoutes: ['/admin', '/technician/reparaciones/nueva']
		}
	};

	const access = accessMatrix[role] || { allowedRoutes: [], deniedRoutes: [] };
	const isAllowed = access.allowedRoutes.some(route => path.startsWith(route));
	const isDenied = access.deniedRoutes.some(route => path.startsWith(route));

	if (!isPublic && !sharedAuthPaths.includes(path)) {
		if (!isAllowed || isDenied) {
			throw redirect(302, '/auth/unauthorized');
		}
	}

	return { role, username, name, id, isAuthenticated: true };
}

// 🔍 Decodificador JWT seguro
function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		console.warn('Token inválido:', e);
		return null;
	}
}
