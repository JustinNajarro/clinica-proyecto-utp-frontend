import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './views/Login.jsx';
import Registro from './views/Registro.jsx';
import Inicio from './views/Inicio.jsx';
import Agendar from './views/Agendar.jsx';
import Comprobante from './views/Comprobante.jsx';
import MisCitas from './views/MisCitas.jsx';
import Perfil from './views/Perfil.jsx';
import PanelAdmin from './views/PanelAdmin.jsx';
import AdminEspecialidades from './views/AdminEspecialidades.jsx';
import AdminMedicos from './views/AdminMedicos.jsx';
import { obtenerSesion } from './sesion.js';

const MENU_PACIENTE = [
  { to: '/inicio', texto: 'Inicio', icono: 'inicio' },
  { to: '/agendar', texto: 'Agendar cita', icono: 'agendar' },
  { to: '/mis-citas', texto: 'Mis citas', icono: 'calendario' },
  { to: '/perfil', texto: 'Perfil', icono: 'usuario' },
];

const MENU_ADMIN = [
  { to: '/admin', texto: 'Agenda de citas', icono: 'agenda' },
  { to: '/admin/especialidades', texto: 'Especialidades', icono: 'estetoscopio' },
  { to: '/admin/medicos', texto: 'Médicos', icono: 'medicos' },
];

function Protegida({ tipo, children }) {
  const sesion = obtenerSesion();
  if (!sesion) return <Navigate to="/login" replace />;
  if (sesion.tipo !== tipo) return <Redireccion />;
  return children;
}

function Redireccion() {
  const sesion = obtenerSesion();
  if (!sesion) return <Navigate to="/login" replace />;
  return <Navigate to={sesion.tipo === 'admin' ? '/admin' : '/inicio'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route element={<Protegida tipo="paciente"><Layout menu={MENU_PACIENTE} /></Protegida>}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/mis-citas" element={<MisCitas />} />
        <Route path="/comprobante" element={<Comprobante />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route element={<Protegida tipo="admin"><Layout menu={MENU_ADMIN} /></Protegida>}>
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="/admin/especialidades" element={<AdminEspecialidades />} />
        <Route path="/admin/medicos" element={<AdminMedicos />} />
      </Route>

      <Route path="*" element={<Redireccion />} />
    </Routes>
  );
}
