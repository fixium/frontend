import { API_BASE_URL } from "$lib/utils/apiConfig";
import { buildErrorMessage } from "$lib/utils/errorUtils";

const API_AUTH_BASE_URL = `${API_BASE_URL}/auth`;
const JSON_HEADERS = {
    'Content-Type': 'application/json'
};

export async function login(username, password) {
    try {
        const response = await fetch(`${API_AUTH_BASE_URL}/signin`, {
            method: 'POST',
            headers: JSON_HEADERS,
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(buildErrorMessage(errorBody, 'Error al iniciar sesión'));
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { success: false, errors: { general: error.message } };
    }
}

export async function logout() {
    try {
        const response = await fetch(`${API_AUTH_BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(buildErrorMessage(errorBody, 'Error al cerrar sesión'));
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, errors: { general: error.message } };
    }
}

// export async function register(userRegistrationData) {
//     const { workshopName, workshopPhoneNumber, workshopContactEmail, name, phoneNumber, username, password } = userRegistrationData;

//     try {
//         const response = await fetch(`${API_AUTH_BASE_URL}/signup`, {
//             method: 'POST',
//             headers: JSON_HEADERS,
//             body: JSON.stringify({ workshopName, workshopPhoneNumber, workshopContactEmail, name, phoneNumber, username, password }),
//         });

//         let data;
//         const contentType = response.headers.get('Content-Type');

//         if (contentType && contentType.includes('application/json')) {
//             data = await response.json();
//         } else {
//             data = await response.text();
//         }

//         if (!response.ok) {
//             const errorMsg = typeof data === 'string'
//                 ? buildErrorMessage({ message: data }, 'Error al registrar')
//                 : buildErrorMessage(data, 'Error al registrar');
//             return { success: false, errors: { general: errorMsg } };
//         }

//         return { success: true, data };
//     } catch (error) {
//         console.error(error);
//         return { success: false, errors: { general: error.message } };
//     }
// }
export async function register(userRegistrationData, images = []) {
    const { workshopName, workshopPhoneNumber, workshopContactEmail, name, phoneNumber, username, password } = userRegistrationData;

    try {
        const formData = new FormData();

        const jsonBlob = new Blob(
            [JSON.stringify({ workshopName, workshopPhoneNumber, workshopContactEmail, name, phoneNumber, username, password })],
            { type: "application/json" }
        );
        formData.append("data", jsonBlob);

        if (images && images.length > 0) {
            images.forEach((img) => formData.append('images', img));
        } else {
            // Enviar parte vacía si no hay imágenes
            formData.append('images', new Blob([], { type: 'application/octet-stream' }));
        }

        const response = await fetch(`${API_AUTH_BASE_URL}/signup`, {
            method: 'POST',
            body: formData,
        });

        let data;
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const errorMsg = typeof data === 'string'
                ? buildErrorMessage({ message: data }, 'Error al registrar')
                : buildErrorMessage(data, 'Error al registrar');
            return { success: false, errors: { general: errorMsg } };
        }

        return { success: true, data };
    } catch (error) {
        console.error(error);
        return { success: false, errors: { general: error.message } };
    }
}