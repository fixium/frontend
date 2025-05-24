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

    // Decodificar el JWT para obtener el rol, username y name
    const { role, username, name, exp } = parseJwt(jwt) || {};

    if (!role || !exp || Date.now() / 1000 > exp) {
        throw redirect(302, '/auth/login');
    }

    const allowedPaths = {
        ROLE_ADMIN: '/admin',
        ROLE_TECHNICIAN: '/technician',
        ROLE_RECEPTIONIST: '/receptionist',
    };

    // Excepciones de acceso por rol (Rutas especificas a las que puede acceder el rol)
    const roleExceptions = {
        ROLE_TECHNICIAN: [
            '/receptionist/tickets'
        ],
        ROLE_RECEPTIONIST: [
            '/technician/reparaciones'
        ]
    };

    const allowedPrefix = allowedPaths[role];
    const exceptions = roleExceptions[role] || [];

    const hasException = exceptions.some(exceptionPath => path.startsWith(exceptionPath));

    if (!isPublic && !sharedAuthPaths.includes(path)) {
        // Permitir acceso completo a ROLE_ADMIN
        if (
            role !== 'ROLE_ADMIN' &&
            allowedPrefix &&
            !path.startsWith(allowedPrefix) &&
            !hasException
        ) {
            throw redirect(302, '/auth/unauthorized');
        }
    }

    return { role, username, name, isAuthenticated: true };
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
