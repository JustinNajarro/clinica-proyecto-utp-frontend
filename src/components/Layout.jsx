import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icono from './Icono.jsx';
import Logo from './Logo.jsx';
import { cerrarSesion, obtenerSesion } from '../sesion.js';
import { iniciales } from '../formato.js';

export default function Layout({ menu }) {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const u = sesion?.datos || {};
  const rol = sesion?.tipo === 'admin' ? (u.cargo || 'Personal administrativo') : 'Paciente';

  function salir() {
    cerrarSesion();
    navigate('/login');
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-marca">
          <Logo tamano={34} />
          <div>
            <strong>Hospital José Agurto Tello</strong>
            <small>Chosica</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <NavLink key={item.to} to={item.to} end>
              <Icono nombre={item.icono} />
              <span>{item.texto}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-salir" onClick={salir}>
          <Icono nombre="salir" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className="app-cuerpo">
        <header className="topbar">
          <div className="topbar-usuario">
            <span className="avatar">{iniciales(u.nombres, u.apellidos)}</span>
            <div>
              <strong>{u.nombres} {u.apellidos?.split(' ')[0]}</strong>
              <small>{rol}</small>
            </div>
          </div>
        </header>
        <main className="pagina">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
