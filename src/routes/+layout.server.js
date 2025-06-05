import { redirect } from '@sveltejs/kit';

export function load({ cookies, url }) {
    const jwt = cookies.get('jwt');
    const path = url.pathname;

    // Rutas públicas (sin login)
    const publicPaths = ['/auth/login', '/auth/register', '/auth/unauthorized'];
    const isPublic = publicPaths.some(p => path.startsWith(p));

    // Rutas accesibles para cualquier usuario autenticado
    const sharedAuthPaths = ['/dashboard', '/', '/my-account'];

    if (!jwt) {
        if (isPublic) return {};
        // Si ya estamos en /auth/login, no redirigir de nuevo
        if (path === '/auth/login') return {};
        throw redirect(302, '/auth/login');
    }

    // Decodificar el JWT para obtener el rol, username y name
    const { role, username, name, id, exp } = parseJwt(jwt) || {};

    // Si token inválido o expirado: eliminar cookie y redirigir
	if (!exp || Date.now() / 1000 > exp) {
        cookies.set('jwt', '', { path: '/', httpOnly: true, maxAge: 0 });
        if (path === '/auth/login') return {};
        throw redirect(302, '/auth/login');
    }

    // Si está autenticado y trata de ir a /auth/login, redirigir al dashboard
    if (path === '/auth/login' || path === '/auth/register') {
        throw redirect(302, '/dashboard');
    }

    // Definir rutas permitidas y denegadas por rol
    const accessMatrix = {
        ROLE_ADMIN: {
            allowedRoutes: ['/admin', '/receptionist', '/technician'],
            deniedRoutes: ['/technician/repairs/new']
        },
        ROLE_TECHNICIAN: {
            allowedRoutes: ['/technician'],
            deniedRoutes: ['/admin', '/receptionist/tickets/create']
        },
        ROLE_RECEPTIONIST: {
            allowedRoutes: ['/receptionist', '/technician/repairs'],
            deniedRoutes: ['/admin', '/technician/repairs/new']
        }
    };

    const access = accessMatrix[role] || { allowedRoutes: [], deniedRoutes: [] };

    // Comprobar acceso
    const isAllowed = access.allowedRoutes.some(route => path.startsWith(route));
    const isDenied = access.deniedRoutes.some(route => path.startsWith(route));

    if (!isPublic && !sharedAuthPaths.includes(path)) {
        if (!isAllowed || isDenied) {
            throw redirect(302, '/auth/unauthorized');
        }
    }

    return { role, username, name, id, isAuthenticated: true };
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