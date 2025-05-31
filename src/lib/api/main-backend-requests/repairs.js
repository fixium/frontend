import { API_BASE_URL } from "$lib/utils/apiConfig";
import { buildErrorMessage } from "$lib/utils/errorUtils";

const API_URL = `${API_BASE_URL}/repairs`;

export async function getAllRepairs(ticketId) {
    const response = await fetch(`${API_URL}/${ticketId}`, {
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

// export async function createRepair(repairRequest) {
//     const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(repairRequest),
//         credentials: 'include'
//     });
//     if (!response.ok) {
//         const errorBody = await response.json().catch(() => ({}));
//         throw new Error(buildErrorMessage(errorBody, 'Error al crear la reparación'));
//     }
//     return await response.text();
// }

export async function createRepair(repairRequest, verificationImage) {
    const formData = new FormData();
    formData.append('repairRequest', new Blob([JSON.stringify(repairRequest)], { type: 'application/json' }));
    
    formData.append('verificationImage', verificationImage);

    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al crear la reparación'));
    }
    return await response.text();
}

export async function getRepairsByImei(imei) {
    const response = await fetch(`${API_URL}/by-imei/${imei}`, {
        credentials: 'include'
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al buscar reparaciones por IMEI'));
    }
    return await response.json();
}

export async function updateRepair(repairId, { diagnosis, repairActions }) {
    const response = await fetch(`${API_URL}/${repairId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ diagnosis, repairActions })
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(buildErrorMessage(errorBody, 'Error al actualizar la reparación'));
    }
    return await response.text();
}