import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icono from '../components/Icono.jsx';
import { api } from '../api.js';
import { obtenerSesion } from '../sesion.js';
import { fechaLarga, hora, iniciales, proximosDias } from '../formato.js';

const PASOS = ['Especialidad', 'Médico', 'Horario'];

export default function Agendar() {
  const navigate = useNavigate();
  const { datos: paciente } = obtenerSesion();
  const dias = useMemo(() => proximosDias(12), []);

  const [paso, setPaso] = useState(0);
  const [especialidades, setEspecialidades] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [especialidad, setEspecialidad] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [medico, setMedico] = useState(null);
  const [fecha, setFecha] = useState(dias[0].iso);
  const [turnos, setTurnos] = useState([]);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);
  const [turno, setTurno] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api('/especialidades').then(setEspecialidades).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!especialidad) return;
    setMedico(null);
    setMedicos([]);
    api(`/especialidades/${especialidad.idEspecialidad}/medicos`)
      .then(setMedicos)
      .catch((e) => setError(e.message));
  }, [especialidad]);

  useEffect(() => {
    if (!medico || paso !== 2) return;
    setTurno(null);
    setCargandoTurnos(true);
    api(`/medicos/${medico.idMedico}/disponibilidad?fecha=${fecha}`)
      .then(setTurnos)
      .catch((e) => setError(e.message))
      .finally(() => setCargandoTurnos(false));
  }, [medico, fecha, paso]);

  const filtradas = especialidades.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const puedeContinuar = [!!especialidad, !!medico, !!turno][paso];

  async function continuar() {
    setError('');
    if (paso < 2) {
      setPaso(paso + 1);
      return;
    }
    setEnviando(true);
    try {
      const cita = await api('/citas', {
        method: 'POST',
        body: {
          dniPaciente: paciente.dni,
          idMedico: medico.idMedico,
          fecha,
          hora: turno.hora,
          motivo: motivo.trim() || null,
        },
      });
      navigate('/comprobante', { state: { cita } });
    } catch (err) {
      setError(err.message);
      // Si el turno se ocupo, recargamos los horarios
      setTurno(null);
      api(`/medicos/${medico.idMedico}/disponibilidad?fecha=${fecha}`).then(setTurnos).catch(() => {});
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <div className="titulo-pagina">
        <h1>Agendar cita</h1>
        <p>Selecciona la especialidad, el médico y el horario que prefieras.</p>
      </div>

      <ol className="pasos">
        {PASOS.map((nombre, i) => (
          <li key={nombre} className={i < paso ? 'hecho' : i === paso ? 'actual' : ''}>
            <button type="button" disabled={i >= paso} onClick={() => setPaso(i)}>
              <span className="pasos-numero">{i < paso ? <Icono nombre="check" tamano={14} /> : i + 1}</span>
              <span>{nombre}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="agendar">
        <section className="tarjeta">
          {paso === 0 && (
            <>
              <h3>Especialidades disponibles</h3>
              <div className="buscador">
                <Icono nombre="buscar" tamano={16} />
                <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar especialidad…" />
              </div>
              <div className="lista-opciones">
                {filtradas.map((e) => (
                  <button
                    key={e.idEspecialidad}
                    className={`opcion ${especialidad?.idEspecialidad === e.idEspecialidad ? 'seleccionada' : ''}`}
                    onClick={() => setEspecialidad(e)}
                  >
                    <span className="opcion-icono"><Icono nombre="estetoscopio" tamano={18} /></span>
                    <span>{e.nombre}</span>
                  </button>
                ))}
                {!filtradas.length && <p className="vacio">No se encontró esa especialidad.</p>}
              </div>
            </>
          )}

          {paso === 1 && (
            <>
              <h3>Médicos de {especialidad.nombre}</h3>
              <div className="medicos">
                {medicos.map((m) => (
                  <button
                    key={m.idMedico}
                    className={`medico ${medico?.idMedico === m.idMedico ? 'seleccionada' : ''}`}
                    onClick={() => setMedico(m)}
                  >
                    <span className="avatar avatar-grande">{iniciales(m.nombres, m.apellidos)}</span>
                    <span>
                      <strong>Dr(a). {m.nombres} {m.apellidos}</strong>
                      <small>{especialidad.nombre}</small>
                      <small>{m.codigoDoctor}</small>
                    </span>
                  </button>
                ))}
                {!medicos.length && <p className="vacio">Cargando médicos…</p>}
              </div>
            </>
          )}

          {paso === 2 && (
            <>
              <h3>Elige el día</h3>
              <div className="dias">
                {dias.map((d) => (
                  <button
                    key={d.iso}
                    className={`dia ${fecha === d.iso ? 'seleccionada' : ''}`}
                    onClick={() => setFecha(d.iso)}
                  >
                    <small>{d.dia}</small>
                    <strong>{d.num}</strong>
                    <small>{d.mes}</small>
                  </button>
                ))}
              </div>

              <h3>Horarios disponibles</h3>
              {cargandoTurnos ? (
                <p className="vacio">Buscando horarios…</p>
              ) : turnos.length ? (
                <div className="turnos">
                  {turnos.map((t) => (
                    <button
                      key={t.hora}
                      className={`turno ${turno?.hora === t.hora ? 'seleccionada' : ''}`}
                      onClick={() => setTurno(t)}
                    >
                      {hora(t.hora)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="vacio">El médico no atiende este día o ya no quedan horarios. Prueba con otra fecha.</p>
              )}

              <label className="campo campo-motivo">
                <span>Motivo de la consulta (opcional)</span>
                <textarea rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej.: dolor de cabeza frecuente" />
              </label>
            </>
          )}
        </section>

        <aside className="tarjeta resumen">
          <h3>Resumen de la cita</h3>
          <dl>
            <div>
              <span className="resumen-icono"><Icono nombre="estetoscopio" tamano={18} /></span>
              <dt>Especialidad</dt>
              <dd>{especialidad?.nombre || 'Sin elegir'}</dd>
              {paso === 0 && especialidad?.descripcion && <dd className="resumen-nota">{especialidad.descripcion}</dd>}
            </div>
            <div>
              <span className="resumen-icono"><Icono nombre="usuario" tamano={18} /></span>
              <dt>Médico</dt>
              <dd>{medico ? `Dr(a). ${medico.nombres} ${medico.apellidos}` : 'Sin elegir'}</dd>
            </div>
            <div>
              <span className="resumen-icono"><Icono nombre="calendario" tamano={18} /></span>
              <dt>Fecha</dt>
              <dd>{paso === 2 ? fechaLarga(fecha) : 'Sin elegir'}</dd>
            </div>
            <div>
              <span className="resumen-icono"><Icono nombre="reloj" tamano={18} /></span>
              <dt>Hora</dt>
              <dd>{turno ? hora(turno.hora) : 'Sin elegir'}</dd>
            </div>
          </dl>

          {error && <p className="alerta">{error}</p>}

          <button className="boton boton-bloque" disabled={!puedeContinuar || enviando} onClick={continuar}>
            {paso < 2 ? 'Continuar' : enviando ? 'Confirmando…' : 'Confirmar cita'}
          </button>
        </aside>
      </div>
    </>
  );
}
