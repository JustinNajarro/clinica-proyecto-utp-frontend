import Icono from './Icono.jsx';
import Logo from './Logo.jsx';

/** Pantalla dividida para login y registro */
export default function PanelAcceso({ children }) {
  return (
    <div className="acceso">
      <section className="acceso-lado">
        <div className="acceso-marca">
          <Logo tamano={52} />
          <div>
            <strong>Hospital José Agurto Tello</strong>
            <span>Chosica</span>
            <small>Tu salud, nuestra prioridad</small>
          </div>
        </div>

        <div className="acceso-mensaje">
          <h1>Bienvenido</h1>
          <p>Inicia sesión para reservar y gestionar tus citas médicas desde cualquier lugar.</p>
          <ul>
            <li><Icono nombre="calendario" /> Citas en línea</li>
            <li><Icono nombre="medicos" /> Múltiples especialidades</li>
            <li><Icono nombre="corazon" /> Atención rápida y segura</li>
          </ul>
        </div>

        <svg className="acceso-pulso" viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="0,50 220,50 245,50 260,20 275,70 290,10 305,60 320,50 600,50" />
        </svg>
      </section>

      <section className="acceso-form">
        <div className="tarjeta acceso-tarjeta">{children}</div>
      </section>
    </div>
  );
}
