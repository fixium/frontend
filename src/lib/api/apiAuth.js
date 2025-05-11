export async function logout() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al cerrar sesión');
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}