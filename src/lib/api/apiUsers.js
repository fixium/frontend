import { buildErrorMessage } from "$lib/utils/errorUtils";

const API_URL = 'http://localhost:8080/api/users';
const JSON_HEADERS = {
    'Content-Type': 'application/json'
};

// export async function addUser({ name, phoneNumber, username, password, role }) {
//     const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: JSON_HEADERS,
//         body: JSON.stringify({ name, phoneNumber, username, password, role }),
//         credentials: 'include'
//     });

//     if (!response.ok) {
//         const errorBody = await response.json().catch(() => ({}));
//         throw new Error(buildErrorMessage(errorBody, 'Error al agregar usuario'));
//     }

//     return await response.text();
// }

export async function addUser({ name, phoneNumber, username, password, role, images = [] }) {
    const formData = new FormData();
    // Agrega los archivos (si hay)
    if (images && images.length > 0) {
        images.forEach((file) => formData.append('images', file));
    }
    // Agrega los datos del usuario como un campo JSON
    formData.append(
        'request',
        JSON.stringify({ name, phoneNumber, username, password, role })
    );

    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        credentials: 'include'
        // No pongas headers, el navegador los gestiona
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al agregar usuario'));
    }

    return await response.text();
}

export async function updateUser(userId, userData) {
    const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(userData),
        credentials: "include"
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, "Error al actualizar el usuario"));
    }

    return await response.text();
}

export async function deleteUser(userId) {
    const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al eliminar usuario'));
    }

    return true;
}

export async function fetchUsers() {
    const response = await fetch(API_URL, {
        credentials: 'include'
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al obtener usuarios'));
    }
    return await response.json();
}

export async function fetchUserById(userId) {
    const response = await fetch(`${API_URL}/${userId}`, {
        credentials: 'include'
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al obtener usuario'));
    }
    return await response.json();
}