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

    // Definir rutas permitidas y denegadas por rol
    const accessMatrix = {
        ROLE_ADMIN: {
            allowedRoutes: ['/admin', '/receptionist', '/technician'],
            deniedRoutes: []
        },
        ROLE_TECHNICIAN: {
            allowedRoutes: ['/technician', '/receptionist/tickets'],
            deniedRoutes: ['/admin', '/receptionist/tickets/nuevo']
        },
        ROLE_RECEPTIONIST: {
            allowedRoutes: ['/receptionist', '/technician/reparaciones'],
            deniedRoutes: ['/admin', '/technician/reparaciones/nueva']
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