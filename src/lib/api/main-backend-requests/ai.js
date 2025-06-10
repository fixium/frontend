import { API_BASE_URL } from '$lib/utils/apiConfig';

const AI_API_URL = `${API_BASE_URL}/ai`;

export async function analyzePanicLog({ logContent, file }) {
	const formData = new FormData();
	if (file) {
		formData.append('file', file);
	} else {
		formData.append('panicLog', logContent);
	}

	const token = localStorage.getItem('authToken');
	const res = await fetch(`${AI_API_URL}/analyze-panic-log`, {
		method: 'POST',
		body: formData,
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText || 'Error al procesar el log');
	}
	return await res.json();
}

export async function assistantChat(messages) {
	const token = localStorage.getItem('authToken');
	const res = await fetch(`${AI_API_URL}/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {})
		},
		body: JSON.stringify({ messages })
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText || 'Error al procesar el mensaje');
	}
	return await res.json();
}
