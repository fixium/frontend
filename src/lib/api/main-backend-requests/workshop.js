import { API_BASE_URL } from "$lib/utils/apiConfig";
import { buildErrorMessage } from "$lib/utils/errorUtils";

const API_URL = `${API_BASE_URL}/workshop`;

export async function getWorkshopDetails() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: token
            ? {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
            : { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al obtener detalles del taller'));
    }

    return await response.json();
}

export async function updateWorkshopDetails({ name, phoneNumber, contactEmail }) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: token
            ? {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
            : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber, contactEmail })
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al actualizar detalles del taller'));
    }
}