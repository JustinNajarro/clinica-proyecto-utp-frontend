// Guarda quien inicio sesion: { tipo: 'paciente' | 'admin', datos: {...} }
const CLAVE = 'sesion_clinica';

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

export function guardarSesion(tipo, datos) {
  localStorage.setItem(CLAVE, JSON.stringify({ tipo, datos }));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE);
}
