import { fetchUsers } from '$lib/api/main-backend-requests/users.js';

export async function load({ fetch }) {
	const users = await fetchUsers(fetch);
	return { users };
}
