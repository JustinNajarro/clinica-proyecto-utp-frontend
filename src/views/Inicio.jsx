import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icono from '../components/Icono.jsx';
import TablaCitas from '../components/TablaCitas.jsx';
import { api } from '../api.js';
import { obtenerSesion } from '../sesion.js';
import { esProxima, ordenarPorFecha } from '../formato.js';

export default function Inicio() {
  const { datos: paciente } = obtenerSesion();
  const [proximas, setProximas] = useState([]);
  const [nEspecialidades, setNEspecialidades] = useState(0);
  const [nMedicos, setNMedicos] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [citas, especialidades] = await Promise.all([
          api(`/citas/paciente/${paciente.dni}`),
          api('/especialidades'),
        ]);
        setProximas(ordenarPorFecha(citas.filter(esProxima)));
        setNEspecialidades(especialidades.length);
        const medicos = await Promise.all(
          especialidades.map((e) => api(`/especialidades/${e.idEspecialidad}/medicos`))
        );
        setNMedicos(medicos.reduce((total, lista) => total + lista.length, 0));
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [paciente.dni]);

  return (
    <>
      <div className="titulo-pagina">
        <h1>Bienvenido, {paciente.nombres}</h1>
        <p>Tu salud es lo más importante</p>
      </div>

      <section className="banner">
        <div>
          <h2>Cuidamos de ti en cada etapa de tu vida</h2>
          <p>Reserva tu cita médica en pocos pasos, sin colas ni llamadas.</p>
          <Link to="/agendar" className="boton boton-claro">Agendar cita</Link>
        </div>
        <svg className="banner-pulso" viewBox="0 0 300 120" aria-hidden="true">
          <polyline points="0,70 90,70 110,70 125,30 140,100 155,15 170,85 185,70 300,70" />
        </svg>
      </section>

      {error && <p className="alerta">{error}</p>}

      <section className="estadisticas">
        <div className="tarjeta estadistica">
          <span className="estadistica-icono"><Icono nombre="calendario" tamano={24} /></span>
          <div><strong>{proximas.length}</strong><small>Citas próximas</small></div>
        </div>
        <div className="tarjeta estadistica">
          <span className="estadistica-icono"><Icono nombre="estetoscopio" tamano={24} /></span>
          <div><strong>{nEspecialidades}</strong><small>Especialidades</small></div>
        </div>
        <div className="tarjeta estadistica">
          <span className="estadistica-icono"><Icono nombre="medicos" tamano={24} /></span>
          <div><strong>{nMedicos}</strong><small>Médicos disponibles</small></div>
        </div>
      </section>

      <section className="tarjeta">
        <div className="tarjeta-cabecera">
          <h3>Próximas citas</h3>
          <Link to="/mis-citas">Ver todas</Link>
        </div>
        <TablaCitas
          citas={proximas.slice(0, 3)}
          vacio="No tienes citas programadas. Agenda una desde el botón de arriba."
        />
      </section>
    </>
  );
}
