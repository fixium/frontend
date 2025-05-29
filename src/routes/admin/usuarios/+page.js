import { fetchUsers } from '$lib/api/apiUsers.js';

export async function load({ fetch }) {
    const users = await fetchUsers(fetch);
    return { users };
}