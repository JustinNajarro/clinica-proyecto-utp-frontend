import Estado from './Estado.jsx';
import { fechaCorta, hora } from '../formato.js';

/** Tabla de citas reutilizable. "acciones" recibe la cita y devuelve botones. */
export default function TablaCitas({ citas, acciones, vacio = 'No hay citas para mostrar.' }) {
  if (!citas.length) {
    return <p className="vacio">{vacio}</p>;
  }
  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Especialidad</th>
            <th>Médico</th>
            <th>Consultorio</th>
            <th>Estado</th>
            {acciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.idCita}>
              <td>{fechaCorta(c.fechaCita)}</td>
              <td>{hora(c.horaCita)}</td>
              <td>{c.especialidad}</td>
              <td>Dr(a). {c.medico}</td>
              <td>{c.consultorio}</td>
              <td><Estado valor={c.estado} /></td>
              {acciones && <td className="tabla-acciones">{acciones(c)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
