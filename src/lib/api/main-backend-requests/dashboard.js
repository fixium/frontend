import { API_BASE_URL } from "$lib/utils/apiConfig";
import { buildErrorMessage } from "$lib/utils/errorUtils";

const API_URL = `${API_BASE_URL}/dashboard`;

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