const BASE_URL = 'http://localhost:8080/api/repairs';

import { buildErrorMessage } from "$lib/utils/errorUtils";

export async function getAllRepairs(ticketId) {
    const response = await fetch(`${BASE_URL}/${ticketId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al obtener las reparaciones'));
    }
    return await response.json();
}

export async function createRepair(repairRequest) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairRequest),
        credentials: 'include'
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al crear la reparación'));
    }
    return await response.text();
}

export async function getRepairsByImei(imei) {
    const response = await fetch(`${BASE_URL}/by-imei/${imei}`, {
        credentials: 'include'
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al buscar reparaciones por IMEI'));
    }
    return await response.json();
}