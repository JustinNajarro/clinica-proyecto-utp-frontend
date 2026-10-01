import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PanelAcceso from '../components/PanelAcceso.jsx';
import Icono from '../components/Icono.jsx';
import { api } from '../api.js';
import { guardarSesion, obtenerSesion } from '../sesion.js';

export default function Login() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('paciente');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  if (obtenerSesion()) return <Navigate to="/" replace />;

  function cambiarTipo(t) {
    setTipo(t);
    setUsuario('');
    setPassword('');
    setError('');
  }

  async function ingresar(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      if (tipo === 'paciente') {
        const p = await api('/auth/paciente/login', { method: 'POST', body: { dni: usuario, password } });
        guardarSesion('paciente', p);
        navigate('/inicio');
      } else {
        const a = await api('/auth/admin/login', { method: 'POST', body: { usuario, password } });
        guardarSesion('admin', a);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <PanelAcceso>
      <h2>Iniciar sesión</h2>
      <p className="subtitulo">Ingresa tus credenciales para continuar</p>

      <div className="pestanas">
        <button type="button" className={tipo === 'paciente' ? 'activa' : ''} onClick={() => cambiarTipo('paciente')}>Paciente</button>
        <button type="button" className={tipo === 'admin' ? 'activa' : ''} onClick={() => cambiarTipo('admin')}>Personal</button>
      </div>

      <form onSubmit={ingresar} className="formulario">
        <label className="campo">
          <span>{tipo === 'paciente' ? 'DNI' : 'Usuario'}</span>
          <div className="campo-icono">
            <Icono nombre={tipo === 'paciente' ? 'documento' : 'usuario'} />
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder={tipo === 'paciente' ? '12345678' : 'admin'}
              inputMode={tipo === 'paciente' ? 'numeric' : 'text'}
              maxLength={tipo === 'paciente' ? 8 : 50}
              required
              autoFocus
            />
          </div>
        </label>

        <label className="campo">
          <span>Contraseña</span>
          <div className="campo-icono">
            <Icono nombre="candado" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
          </div>
        </label>

        {error && <p className="alerta">{error}</p>}

        <button className="boton boton-bloque" disabled={cargando}>
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      {tipo === 'paciente' && (
        <p className="pie-form">¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
      )}
    </PanelAcceso>
  );
}
