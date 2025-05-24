const API_URL = 'http://localhost:8080/api/devices';

export async function fetchDevices(clientId) {
  const res = await fetch(`${API_URL}/client/${clientId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener dispositivos');
  return await res.json();
}