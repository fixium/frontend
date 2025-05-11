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
