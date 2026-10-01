import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TablaCitas from '../components/TablaCitas.jsx';
import { api } from '../api.js';
import { obtenerSesion } from '../sesion.js';
import { esProxima, fechaCorta, hora, ordenarPorFecha } from '../formato.js';

export default function MisCitas() {
  const navigate = useNavigate();
  const { datos: paciente } = obtenerSesion();
  const [citas, setCitas] = useState([]);
  const [pestana, setPestana] = useState('proximas');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    api(`/citas/paciente/${paciente.dni}`)
      .then(setCitas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [paciente.dni]);

  useEffect(cargar, [cargar]);

  async function cancelar(c) {
    if (!window.confirm(`¿Cancelar tu cita de ${c.especialidad} del ${fechaCorta(c.fechaCita)} a las ${hora(c.horaCita)}?`)) return;
    setError('');
    try {
      await api(`/citas/${c.idCita}/cancelar?dni=${paciente.dni}`, { method: 'PUT' });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  const proximas = ordenarPorFecha(citas.filter(esProxima));
  const historial = ordenarPorFecha(citas.filter((c) => !esProxima(c)), true);
  const lista = pestana === 'proximas' ? proximas : historial;

  return (
    <>
      <div className="titulo-pagina titulo-con-accion">
        <div>
          <h1>Mis citas</h1>
          <p>Aquí puedes ver y gestionar tus citas médicas.</p>
        </div>
        <Link to="/agendar" className="boton">Agendar cita</Link>
      </div>

      <section className="tarjeta">
        <div className="pestanas pestanas-izquierda">
          <button className={pestana === 'proximas' ? 'activa' : ''} onClick={() => setPestana('proximas')}>
            Próximas citas ({proximas.length})
          </button>
          <button className={pestana === 'historial' ? 'activa' : ''} onClick={() => setPestana('historial')}>
            Historial ({historial.length})
          </button>
        </div>

        {error && <p className="alerta">{error}</p>}

        {cargando ? (
          <p className="vacio">Cargando citas…</p>
        ) : (
          <TablaCitas
            citas={lista}
            vacio={pestana === 'proximas' ? 'No tienes citas próximas.' : 'Aún no tienes citas en tu historial.'}
            acciones={(c) => (
              <>
                <button className="boton boton-chico" onClick={() => navigate('/comprobante', { state: { cita: c } })}>Ver</button>
                {esProxima(c) && (
                  <button className="boton boton-chico boton-peligro" onClick={() => cancelar(c)}>Cancelar</button>
                )}
              </>
            )}
          />
        )}
      </section>
    </>
  );
}
