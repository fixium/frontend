import { buildErrorMessage } from '$lib/utils/errorUtils';

const API_URL = 'http://localhost:8080/api/tickets';

export async function getAllTickets() {
	const res = await fetch(API_URL, {
		credentials: 'include'
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener tickets'));
	}
	return await res.json();
}

export async function getAllMyTickets() {
	const res = await fetch(`${API_URL}/my-tickets`, {
		credentials: 'include'
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener tickets'));
	}
	return await res.json();
}

export async function filterTickets({ customerName, ticketNumber, imei }) {
	const formData = new FormData();
	if (customerName) formData.append('customerName', customerName);
	if (ticketNumber) formData.append('ticketNumber', ticketNumber);
	if (imei) formData.append('imei', imei);

	const res = await fetch(`${API_URL}/filter`, {
		method: 'POST',
		credentials: 'include',
		body: formData
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al filtrar tickets'));
	}
	return await res.json();
}

export async function filterMyTickets({ customerName, ticketNumber, imei }) {
	const formData = new FormData();
	if (customerName) formData.append('customerName', customerName);
	if (ticketNumber) formData.append('ticketNumber', ticketNumber);
	if (imei) formData.append('imei', imei);

	const res = await fetch(`${API_URL}/filter-my-tickets`, {
		method: 'POST',
		credentials: 'include',
		body: formData
	});
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al filtrar tickets'));
	}
	return await res.json();
}

export async function downloadTicketPdf(id) {
	const res = await fetch(`${API_URL}/${id}/pdf`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/pdf'
		}
	});
	if (res.status === 401) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'No tienes permisos para descargar el ticket'));
	}
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al descargar PDF'));
	}
	const blob = await res.blob();
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `ticket-${id}.pdf`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.URL.revokeObjectURL(url);
}

export async function updateTicketStatus(id, status) {
	const res = await fetch(`${API_URL}/${id}/status?status=${encodeURIComponent(status)}`, {
		method: 'PUT',
		credentials: 'include'
	});
	if (res.status === 401) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'No tienes permisos para cambiar el estado'));
	}
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al cambiar el estado'));
	}
	return true;
}

export async function getTicketDetail(id) {
	const res = await fetch(`${API_URL}/${id}/detail`, {
		credentials: 'include'
	});
	if (res.status === 401) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(
			buildErrorMessage(errorBody, 'No tienes permisos para ver el detalle del ticket')
		);
	}
	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener el detalle del ticket'));
	}
	return await res.json();
}

export async function registerTicket({ deviceId, initialStateDescription, technicianId }) {
	const res = await fetch(`${API_URL}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ deviceId, initialStateDescription, technicianId }),
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al crear ticket'));
	}

	return await res.json(); // Devuelve el ticketId
}

export async function getTicket(ticketId) {
	const res = await fetch(`${API_URL}/${ticketId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include'
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(buildErrorMessage(errorBody, 'Error al obtener ticket'));
	}

	return await res.json(); // Devuelve el ticket
}
