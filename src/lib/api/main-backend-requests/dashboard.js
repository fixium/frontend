import { buildErrorMessage } from "$lib/utils/errorUtils";

const API_URL = 'http://localhost:8080/api/dashboard';

export async function getDashboardData() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(await buildErrorMessage(response));
        }

        return response;
    } catch (error) {
        throw error;
    }
}