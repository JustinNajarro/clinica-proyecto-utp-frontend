import { Link, Navigate, useLocation } from 'react-router-dom';
import Icono from '../components/Icono.jsx';
import Estado from '../components/Estado.jsx';
import { fechaLarga, hora } from '../formato.js';

export default function Comprobante() {
  const { state } = useLocation();
  const cita = state?.cita;
  if (!cita) return <Navigate to="/mis-citas" replace />;

  return (
    <div className="comprobante-contenedor">
      <section className="tarjeta comprobante">
        <div className="comprobante-cabecera">
          <span className="comprobante-check"><Icono nombre="check" tamano={28} /></span>
          <div>
            <h1>Cita registrada</h1>
            <p>Presenta este código en admisión el día de tu cita.</p>
          </div>
        </div>

        <div className="comprobante-codigo">
          <small>Código de confirmación</small>
          <strong>{cita.codigoConfirmacion}</strong>
        </div>

        <dl className="comprobante-datos">
          <div><dt>Paciente</dt><dd>{cita.paciente}</dd></div>
          <div><dt>DNI</dt><dd>{cita.dniPaciente}</dd></div>
          <div><dt>Especialidad</dt><dd>{cita.especialidad}</dd></div>
          <div><dt>Médico</dt><dd>Dr(a). {cita.medico}</dd></div>
          <div><dt>Fecha</dt><dd>{fechaLarga(cita.fechaCita)}</dd></div>
          <div><dt>Hora</dt><dd>{hora(cita.horaCita)}</dd></div>
          <div><dt>Consultorio</dt><dd>{cita.consultorio}, piso {cita.piso}</dd></div>
          <div><dt>Estado</dt><dd><Estado valor={cita.estado} /></dd></div>
        </dl>

        <p className="comprobante-nota">Llega 15 minutos antes con tu DNI. Si no puedes asistir, cancela la cita desde "Mis citas".</p>

        <div className="comprobante-acciones">
          <button className="boton boton-secundario" onClick={() => window.print()}>
            <Icono nombre="imprimir" tamano={18} /> Imprimir
          </button>
          <Link to="/mis-citas" className="boton">Ir a mis citas</Link>
        </div>
      </section>
    </div>
  );
}
