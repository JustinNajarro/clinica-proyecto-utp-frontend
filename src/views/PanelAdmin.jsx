import { useCallback, useEffect, useState } from 'react';
import Icono from '../components/Icono.jsx';
import Estado from '../components/Estado.jsx';
import { api } from '../api.js';
import { fechaCorta, hoyISO, hora } from '../formato.js';

export default function PanelAdmin() {
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState('');
  const [buscar, setBuscar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    api('/citas')
      .then(setCitas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  useEffect(cargar, [cargar]);

  async function cambiarEstado(c, nuevo) {
    setError('');
    try {
      await api(`/citas/${c.idCita}/estado`, { method: 'PUT', body: { estado: nuevo } });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  const hoy = hoyISO();
  const deHoy = citas.filter((c) => c.fechaCita === hoy);
  const contar = (e) => citas.filter((c) => c.estado === e).length;

  const texto = buscar.trim().toLowerCase();
  const filtradas = citas.filter((c) =>
    (!fecha || c.fechaCita === fecha) &&
    (!estado || c.estado === estado) &&
    (!texto || c.paciente.toLowerCase().includes(texto) || c.dniPaciente.includes(texto)
      || c.codigoConfirmacion.toLowerCase().includes(texto) || c.medico.toLowerCase().includes(texto))
  );

  return (
    <>
      <div className="titulo-pagina">
        <h1>Agenda de citas</h1>
        <p>Revisa las citas registradas y actualiza su estado.</p>
      </div>

      <section className="estadisticas estadisticas-4">
        <div className="tarjeta estadistica">
          <span className="estadistica-icono"><Icono nombre="calendario" tamano={24} /></span>
          <div><strong>{deHoy.length}</strong><small>Citas de hoy</small></div>
        </div>
        <div className="tarjeta estadistica">
          <span className="estadistica-icono icono-ambar"><Icono nombre="reloj" tamano={24} /></span>
          <div><strong>{contar('PENDIENTE')}</strong><small>Pendientes</small></div>
        </div>
        <div className="tarjeta estadistica">
          <span className="estadistica-icono icono-verde"><Icono nombre="check" tamano={24} /></span>
          <div><strong>{contar('ATENDIDA')}</strong><small>Atendidas</small></div>
        </div>
        <div className="tarjeta estadistica">
          <span className="estadistica-icono icono-rojo"><Icono nombre="salir" tamano={24} /></span>
          <div><strong>{contar('CANCELADA')}</strong><small>Canceladas</small></div>
        </div>
      </section>

      <section className="tarjeta">
        <div className="filtros">
          <div className="buscador">
            <Icono nombre="buscar" tamano={16} />
            <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar por paciente, DNI, médico o código" />
          </div>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} aria-label="Filtrar por fecha" />
          <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="ATENDIDA">Atendidas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
          {(fecha || estado || buscar) && (
            <button className="boton-texto" onClick={() => { setFecha(''); setEstado(''); setBuscar(''); }}>Limpiar filtros</button>
          )}
        </div>

        {error && <p className="alerta">{error}</p>}

        {cargando ? (
          <p className="vacio">Cargando citas…</p>
        ) : !filtradas.length ? (
          <p className="vacio">No hay citas con esos filtros.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Especialidad</th>
                  <th>Médico</th>
                  <th>Estado</th>
                  <th>Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((c) => (
                  <tr key={c.idCita}>
                    <td className="codigo">{c.codigoConfirmacion}</td>
                    <td>{fechaCorta(c.fechaCita)}</td>
                    <td>{hora(c.horaCita)}</td>
                    <td>{c.paciente}<small className="celda-sub">DNI {c.dniPaciente}</small></td>
                    <td>{c.especialidad}</td>
                    <td>Dr(a). {c.medico}</td>
                    <td><Estado valor={c.estado} /></td>
                    <td>
                      <select value={c.estado} onChange={(e) => cambiarEstado(c, e.target.value)} aria-label="Cambiar estado">
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="ATENDIDA">Atendida</option>
                        <option value="CANCELADA">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
