const API_BASE_URL = 'http://localhost:8080/api/users';
const JSON_HEADERS = {
    'Content-Type': 'application/json'
};

export async function addUser({ name, phoneNumber, username, password, role }) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ name, phoneNumber, username, password, role }),
        credentials: 'include'
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error adding user');
    }

    return await response.text();
}

export async function updateUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(userData),
        credentials: "include"
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar el usuario");
    }

    return await response.text();
}

export async function deleteUser(userId) {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Error deleting user');
    }

    return true;
}

export async function fetchUsers() {
    const response = await fetch(API_BASE_URL, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Error fetching users');
    }
    return await response.json();
}

export async function fetchUserById(userId) {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (!response.ok) {
        throw new Error('Error fetching user');
    }
    return await response.json();
}