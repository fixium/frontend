export async function addUser({ name, phoneNumber, username, password, role }) {
    const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            phoneNumber,
            username,
            password,
            role
        }),
        credentials: 'include'
    });

    if (!response.ok) {
        const errorText = await response.text(); // Extraer el mensaje de error del backend
        throw new Error(errorText || 'Error adding user');
    }

    return await response.text();
}

export async function updateUser(userId, userData) {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData),
        credentials: "include"
    });

    if (!response.ok) {
        const errorText = await response.text(); // Extraer el mensaje de error del backend
        throw new Error(errorText || "Error al actualizar el usuario");
    }

    return await response.text();
}

export async function deleteUser(userId) {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Error deleting user');
    }

    return true; // Indica que la eliminación fue exitosa
}

export async function fetchUsers() {
    const response = await fetch('http://localhost:8080/api/users', {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Error fetching users');
    }
    return await response.json();
}

async function fetchUserById(userId) {
	const response = await fetch(`http://localhost:8080/api/users/${userId}`);
	if (!response.ok) {
		throw new Error('Error fetching user');
	}
	return await response.json();
}
