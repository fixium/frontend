export async function login(username, password) {
    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Error al iniciar sesión');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

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

export async function register(userRegistrationData) {
    const { workshopName, workshopPhoneNumber, workshopContactEmail, name, phoneNumber, username, password } = userRegistrationData;

    try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workshopName, workshopPhoneNumber, workshopContactEmail, name, phoneNumber, username, password }),
        });

        let data;
        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json(); // Analizar como JSON si el contenido es JSON
        } else {
            data = await response.text(); // Leer como texto si no es JSON
        }

        if (!response.ok) {
            // Devolver el mensaje de error del backend
            return { success: false, errors: typeof data === 'string' ? { general: data } : data };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        // Devolver la excepción capturada
        return { success: false, errors: { general: error.message } };
    }
}