const pad = (n) => String(n).padStart(2, '0');

export function aISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function hoyISO() {
  return aISO(new Date());
}

function desdeISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export function fechaLarga(iso) {
  if (!iso) return '';
  return capitalizar(desdeISO(iso).toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }));
}

export function fechaCorta(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function hora(h) {
  return h ? h.slice(0, 5) : '';
}

/** Proximos n dias habiles (sin domingos) para elegir fecha */
export function proximosDias(n = 12) {
  const dias = [];
  const d = new Date();
  while (dias.length < n) {
    if (d.getDay() !== 0) {
      dias.push({
        iso: aISO(d),
        dia: capitalizar(d.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '')),
        num: d.getDate(),
        mes: capitalizar(d.toLocaleDateString('es-PE', { month: 'short' }).replace('.', '')),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

export function iniciales(nombres = '', apellidos = '') {
  return ((nombres[0] || '') + (apellidos[0] || '')).toUpperCase();
}

export function ordenarPorFecha(citas, desc = false) {
  return [...citas].sort((a, b) => {
    const r = (a.fechaCita + a.horaCita).localeCompare(b.fechaCita + b.horaCita);
    return desc ? -r : r;
  });
}

export function esProxima(c) {
  return c.estado === 'PENDIENTE' && c.fechaCita >= hoyISO();
}

export const ETIQUETA_ESTADO = {
  PENDIENTE: 'Pendiente',
  ATENDIDA: 'Atendida',
  CANCELADA: 'Cancelada',
};
