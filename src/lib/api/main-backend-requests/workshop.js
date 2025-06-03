import { API_BASE_URL } from "$lib/utils/apiConfig";
import { buildErrorMessage } from "$lib/utils/errorUtils";

const API_URL = `${API_BASE_URL}/workshop`;

export async function getWorkshopDetails() {
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

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function updateWorkshopDetails({ name, phoneNumber, contactEmail }) {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phoneNumber, contactEmail })
        });

        if (!response.ok) {
            throw new Error(await buildErrorMessage(response));
        }
    } catch (error) {
        throw error;
    }
}