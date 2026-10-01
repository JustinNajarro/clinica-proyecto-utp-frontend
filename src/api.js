// Conexion con el backend Spring Boot
const BASE_URL = 'http://localhost:8080/api';

export async function api(ruta, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(BASE_URL + ruta, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
  }
  const texto = await res.text();
  const data = texto ? JSON.parse(texto) : null;
  if (!res.ok) {
    throw new Error(data?.mensaje || `Error ${res.status}`);
  }
  return data;
}
