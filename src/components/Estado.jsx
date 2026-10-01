import { ETIQUETA_ESTADO } from '../formato.js';

export default function Estado({ valor }) {
  return <span className={`estado estado-${valor?.toLowerCase()}`}>{ETIQUETA_ESTADO[valor] || valor}</span>;
}
